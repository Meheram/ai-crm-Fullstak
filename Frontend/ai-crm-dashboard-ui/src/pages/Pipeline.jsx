
import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sparkles, GripVertical, Building2, TrendingUp, Layers, Target, DollarSign } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Spinner, Avatar, Badge, Card } from "../components/ui";
import { leadsApi, aiApi } from "../lib/services";
import { currency } from "../lib/format";
import { PIPELINE_STAGES, STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";

/* Group a flat lead list into { stage: Lead[] } buckets. */
const toBoard = (leads) => {
  const board = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, []]));
  for (const l of leads) (board[l.status] || board.New).push(l);
  return board;
};

export default function Pipeline() {
  const [board, setBoard] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    leadsApi
      .list()
      .then((res) => setBoard(toBoard(res.leads)))
      .catch(() => setBoard(toBoard([])));
  }, []);

  if (!board) return <Spinner />;

  const findContainer = (id) => {
    if (id in board) return id;
    return PIPELINE_STAGES.find((s) => board[s].some((l) => l._id === id));
  };

  const activeLead = activeId
    ? Object.values(board).flat().find((l) => l._id === activeId)
    : null;

  /* Move cards between columns live as the user drags over them. */
  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findContainer(active.id);
    const to = findContainer(over.id);
    if (!from || !to || from === to) return;

    setBoard((prev) => {
      const fromItems = [...prev[from]];
      const toItems = [...prev[to]];
      const idx = fromItems.findIndex((l) => l._id === active.id);
      if (idx === -1) return prev;
      const [moved] = fromItems.splice(idx, 1);
      moved.status = to;
      // Insert near the hovered card (or append if hovering the column).
      const overIdx = toItems.findIndex((l) => l._id === over.id);
      toItems.splice(overIdx === -1 ? toItems.length : overIdx, 0, moved);
      return { ...prev, [from]: fromItems, [to]: toItems };
    });
  };

  /* Persist the final ordering + stage to the backend. */
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const container = findContainer(over.id);
    if (!container) return;

    setBoard((prev) => {
      const items = [...prev[container]];
      const oldIdx = items.findIndex((l) => l._id === active.id);
      const newIdx = items.findIndex((l) => l._id === over.id);
      const reordered =
        oldIdx !== -1 && newIdx !== -1 ? arrayMove(items, oldIdx, newIdx) : items;
      const next = { ...prev, [container]: reordered };

      // Build the persistence payload across all affected columns.
      const updates = [];
      PIPELINE_STAGES.forEach((stage) => {
        next[stage].forEach((l, order) =>
          updates.push({ id: l._id, status: stage, order })
        );
      });
      leadsApi.reorder(updates).catch(() => toast.error("Could not save pipeline"));
      return next;
    });
  };

  /* ── KPI computations ─────────────────────────────────────────────── */
  const allLeads = Object.values(board).flat();
  const totalValue = allLeads.reduce((s, l) => s + (l.value || 0), 0);
  const openDeals = allLeads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const wonLeads = allLeads.filter((l) => l.status === "Won");
  const wonValue = wonLeads.reduce((s, l) => s + (l.value || 0), 0);
  const closedCount = wonLeads.length + (board.Lost?.length || 0);
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  return (
    <div className="pipeline-page relative space-y-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl sm:p-5">
        <PageHeader
          title="Pipeline"
          subtitle={`${allLeads.length} leads · ${currency(totalValue, { compact: true })} in play`}
        />
      </div>

      {/* KPI summary strip */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={DollarSign}
          tint="bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-300/20"
          label="Total pipeline"
          value={currency(totalValue, { compact: true })}
        />
        <StatTile
          icon={Layers}
          tint="bg-sky-400/15 text-sky-300 ring-1 ring-sky-300/20"
          label="Open deals"
          value={openDeals.length}
        />
        <StatTile
          icon={Target}
          tint="bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20"
          label="Won value"
          value={currency(wonValue, { compact: true })}
        />
        <StatTile
          icon={TrendingUp}
          tint="bg-violet-400/15 text-violet-300 ring-1 ring-violet-300/20"
          label="Win rate"
          value={`${winRate}%`}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="pipeline-board relative z-10 flex gap-5 overflow-x-auto rounded-3xl border border-white/10 bg-black/10 p-3 pb-5 shadow-inner backdrop-blur-sm sm:p-4">
          {PIPELINE_STAGES.map((stage) => (
            <Column key={stage} stage={stage} leads={board[stage]} />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

/* ── KPI stat tile (matches Leads page pattern) ─────────────────────── */
function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="pipeline-stat-card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-4 shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-cyan-950/20">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/[0.06] blur-2xl transition-all duration-300 group-hover:bg-cyan-400/[0.12]" />
      <div className="relative flex items-center gap-3">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110", tint)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium tracking-wide text-slate-400">{label}</p>
          <p className="mt-1 truncate font-display text-xl font-bold tracking-tight text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/* ── Column ─────────────────────────────────────────────────────────── */
function Column({ stage, leads }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLES[stage];
  const value = leads.reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="pipeline-column flex w-80 shrink-0 flex-col">
      {/* Colored top accent bar */}
      <div className={cn("mb-3 h-1.5 w-full rounded-full shadow-sm", style.bar)} />

      {/* Column header */}
      <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white/5", style.dot)} />
            <h3 className="truncate text-sm font-bold tracking-wide text-white">{stage}</h3>
            <span className="rounded-lg border border-white/10 bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-200">
              {leads.length}
            </span>
          </div>
          <span className="shrink-0 text-xs font-semibold text-cyan-200">
            {currency(value, { compact: true })}
          </span>
        </div>
      </div>

      {/* Droppable column body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[60vh] flex-1 flex-col gap-3 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-3 transition-all duration-200",
          isOver && "border-cyan-300/70 bg-cyan-400/[0.08] shadow-inner shadow-cyan-500/10"
        )}
      >
        <SortableContext
          items={leads.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <SortableCard key={lead._id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 px-3 py-8 text-center">
            <Layers className="h-5 w-5 text-slate-600" />
            <p className="text-xs font-medium text-slate-500">Drop leads here</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sortable card wrapper ──────────────────────────────────────────── */
function SortableCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-2xl transition-all duration-200",
        isDragging && "opacity-40 scale-[0.98]"
      )}
    >
      <LeadCard lead={lead} dragHandle={{ attributes, listeners }} />
    </div>
  );
}

/* ── Card UI ────────────────────────────────────────────────────────── */
function LeadCard({ lead, dragHandle, overlay }) {
  const [suggesting, setSuggesting] = useState(false);

  // AI: suggest the next best action / priority for this lead.
  const suggest = async (e) => {
    e.stopPropagation();
    setSuggesting(true);
    try {
      const res = await aiApi.leadSummary({ leadId: lead._id });
      toast(`AI suggestion for ${lead.name}`, {
        description: `${res.nextBestAction} (suggested priority: ${res.suggestedPriority})`,
        duration: 7000,
      });
    } catch (err) {
      toast.error(err.message || "AI unavailable");
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950/95 p-3.5 shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:shadow-xl hover:shadow-black/25",
        overlay
          ? "rotate-2 scale-[1.02] border-cyan-300/50 shadow-2xl shadow-cyan-950/40"
          : ""
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Name / company row + drag handle */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="shrink-0 rounded-xl bg-white/[0.05] p-0.5 ring-1 ring-white/10">
            <Avatar name={lead.name} size="sm" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-100 transition-colors group-hover:text-cyan-100">
              {lead.name}
            </p>
            <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-400">
              <Building2 className="h-3 w-3 shrink-0 text-cyan-400/80" />
              {lead.company || "—"}
            </p>
          </div>
        </div>
        {dragHandle && (
          <button
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-cyan-200 active:cursor-grabbing cursor-grab"
            aria-label="Drag"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Value + priority */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
        <span className="truncate text-sm font-bold tracking-tight text-white">
          {currency(lead.value)}
        </span>
        <Badge className={cn("shrink-0 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold", PRIORITY_STYLES[lead.priority])}>
          {lead.priority}
        </Badge>
      </div>

      {/* AI suggest button — appears on hover, hidden in DragOverlay */}
      {!overlay && (
        <button
          onClick={suggest}
          disabled={suggesting}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 py-2 text-xs font-semibold text-cyan-200 opacity-100 transition-all duration-200 hover:border-cyan-300/30 hover:from-cyan-400/20 hover:to-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
        >
          <Sparkles className={cn("h-3.5 w-3.5", suggesting && "animate-pulse")} />
          {suggesting ? "Thinking…" : "AI suggest next step"}
        </button>
      )}
    </div>
  );
}
