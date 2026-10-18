
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  StickyNote,
  Link2,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import {
  Button,
  Card,
  Textarea,
  Select,
  Field,
  Badge,
  Dialog,
  Dropdown,
  DropdownItem,
  Spinner,
} from "../components/ui";
import { notesApi, leadsApi } from "../lib/services";
import { relative } from "../lib/format";
import { cn } from "../lib/utils";

// ── StatTile ───────────────────────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#13233a] via-[#0e1b2e] to-[#0b1626] p-4 shadow-[0_8px_26px_rgba(0,0,0,0.13)] transition duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-[0_16px_35px_rgba(0,0,0,0.22)] sm:p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/[0.05] blur-2xl transition duration-300 group-hover:bg-cyan-400/[0.12]" />
      <div className="relative flex items-center gap-3">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/[0.06] transition duration-300 group-hover:scale-105", tint)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 font-display text-xl font-bold tracking-tight text-slate-100">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

// ── FilterChip ─────────────────────────────────────────────────────────────
function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200",
        active
          ? "border-cyan-300/30 bg-gradient-to-r from-cyan-400 to-blue-500 text-[#071321] shadow-[0_4px_15px_rgba(34,211,238,0.13)]"
          : "border-white/[0.08] bg-[#0a1525] text-slate-400 hover:border-white/15 hover:bg-white/[0.04] hover:text-slate-100"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-xs font-semibold",
          active ? "bg-black/10 text-[#071321]" : "bg-white/[0.07] text-slate-300"
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ── NoteCard ───────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  // Prefer lead over contact for the linked-entity chip
  const entity = note.lead ?? note.contact ?? null;

  return (
    <div
      className={cn(
        "notes-card group relative mb-4 flex break-inside-avoid flex-col gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br from-[#13243b] via-[#0e1b2e] to-[#0a1525] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]",
        note.pinned
          ? "border-cyan-300/25 ring-1 ring-cyan-300/10 hover:border-cyan-300/40"
          : "border-white/[0.08] hover:border-white/[0.16]"
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/[0.035] blur-3xl transition duration-500 group-hover:bg-cyan-400/[0.09]" />

      {/* Pinned accent strip along the top */}
      {note.pinned && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500" />
      )}

      {/* Pinned icon badge */}
      {note.pinned && (
        <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          <Pin className="h-3.5 w-3.5" aria-label="Pinned" />
        </span>
      )}

      {/* Note content */}
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07] text-cyan-200">
            <StickyNote className="h-4 w-4" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Note
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words pr-6 text-sm leading-7 text-slate-200">
          {note.content}
        </p>
      </div>

      {/* Footer: linked chip + timestamp + actions */}
      <div className="relative mt-auto flex items-end justify-between gap-2 border-t border-white/[0.07] pt-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {entity && (
            <Badge className="inline-flex max-w-[160px] items-center gap-1 truncate rounded-lg border border-cyan-300/15 bg-cyan-300/[0.07] text-xs font-medium text-cyan-200">
              <Link2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{entity.name}</span>
            </Badge>
          )}
          <span className="text-xs text-slate-500">{relative(note.createdAt)}</span>
        </div>

        {/* Overflow menu */}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <Dropdown
            trigger={
              <button
                className="rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-cyan-200"
                aria-label="Note options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => onTogglePin(note)}>
              {note.pinned ? (
                <>
                  <PinOff className="h-4 w-4" /> Unpin
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4" /> Pin
                </>
              )}
            </DropdownItem>
            <DropdownItem onClick={() => onEdit(note)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownItem>
            <DropdownItem danger onClick={() => onDelete(note)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

// ── NoteFormDialog ─────────────────────────────────────────────────────────
function NoteFormDialog({ open, onClose, note, leads, onSaved }) {
  const isEditing = Boolean(note);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset form whenever the dialog opens or the note being edited changes
  useEffect(() => {
    if (open) {
      reset({
        content: note?.content ?? "",
        lead: note?.lead?._id ?? "",
        pinned: note?.pinned ?? false,
      });
    }
  }, [open, note, reset]);

  const onSubmit = async (values) => {
    const payload = {
      content: values.content,
      pinned: values.pinned,
      // Pass lead id only if selected; undefined removes the field on update
      lead: values.lead || undefined,
    };

    try {
      if (isEditing) {
        await notesApi.update(note._id, payload);
        toast.success("Note updated");
      } else {
        await notesApi.create(payload);
        toast.success("Note created");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message ?? "Could not save note");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit note" : "New note"}
      description={
        isEditing ? "Update your note below." : "Add a note linked to a lead or contact."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="notes-form mt-3 flex flex-col gap-5">
        {/* Content */}
        <Field label="Note" error={errors.content?.message}>
          <Textarea
            rows={6}
            placeholder="Write your note here…"
            {...register("content", { required: "Note content is required." })}
          />
        </Field>

        {/* Lead picker */}
        <Field label="Link to lead">
          <Select {...register("lead")}>
            <option value="">No linked lead</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name}{l.company ? ` — ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        {/* Pinned pill toggle */}
        <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.09] bg-[#0b1728] px-4 py-3.5 transition duration-200 hover:border-cyan-300/20 hover:bg-[#102039]">
          <div className="relative flex-shrink-0">
            <input type="checkbox" className="peer sr-only" {...register("pinned")} />
            <div className="h-5 w-9 rounded-full bg-slate-700 transition peer-checked:bg-cyan-400" />
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-slate-100 shadow transition peer-checked:translate-x-4 peer-checked:bg-[#071321]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200 transition group-hover:text-cyan-200">
              Pin this note
            </p>
            <p className="mt-0.5 text-xs leading-5 text-slate-400">
              Pinned notes appear at the top of the list.
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex gap-3 border-t border-white/[0.08] pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={isSubmitting}>
            {isEditing ? "Save changes" : "Create note"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Notes() {
  // ── Data ───────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState(null);  // null = loading
  const [leads, setLeads] = useState([]);    // lead picker options

  // ── UI state ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pinned" | "linked" | "unlinked"
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const load = () => {
    setNotes(null);
    notesApi.list().then((res) => setNotes(res.notes)).catch(() => setNotes([]));
  };

  useEffect(() => {
    load();
    leadsApi.list().then((res) => setLeads(res.leads ?? [])).catch(() => {});
  }, []);

  // ── KPI counts ────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const list = notes || [];
    return {
      total: list.length,
      pinned: list.filter((n) => n.pinned).length,
      linked: list.filter((n) => n.lead || n.contact).length,
      unlinked: list.filter((n) => !n.lead && !n.contact).length,
    };
  }, [notes]);

  // ── Quick-filter chip counts ──────────────────────────────────────────
  const chipCounts = useMemo(() => ({
    all: kpis.total,
    pinned: kpis.pinned,
    linked: kpis.linked,
    unlinked: kpis.unlinked,
  }), [kpis]);

  // ── Client-side filtering ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!notes) return [];
    let list = notes;

    if (filter === "pinned") list = list.filter((n) => n.pinned);
    else if (filter === "linked") list = list.filter((n) => n.lead || n.contact);
    else if (filter === "unlinked") list = list.filter((n) => !n.lead && !n.contact);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.content?.toLowerCase().includes(q));
    }

    return list;
  }, [notes, filter, search]);

  const isActive = search.trim() || filter !== "all";

  // ── Handlers ──────────────────────────────────────────────────────────
  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (note) => { setEditing(note); setFormOpen(true); };
  const handleSaved = () => { setFormOpen(false); load(); };

  const handleTogglePin = async (note) => {
    try {
      await notesApi.update(note._id, { pinned: !note.pinned });
      toast.success(note.pinned ? "Note unpinned" : "Note pinned");
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not update note");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await notesApi.remove(toDelete._id);
      toast.success("Note deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not delete note");
    } finally {
      setDeleting(false);
    }
  };

  const clearAll = () => { setSearch(""); setFilter("all"); };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="notes-page space-y-6 pb-8">
      {/* Page header */}
      <PageHeader title="Notes" subtitle="Capture context across your deals and contacts.">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New note
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={StickyNote}
          tint="bg-gradient-to-br from-cyan-400/20 to-blue-500/10 text-cyan-300"
          label="Total notes"
          value={kpis.total}
        />
        <StatTile
          icon={Pin}
          tint="bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-300"
          label="Pinned"
          value={kpis.pinned}
        />
        <StatTile
          icon={Link2}
          tint="bg-gradient-to-br from-sky-400/20 to-blue-500/10 text-sky-300"
          label="Linked"
          value={kpis.linked}
        />
        <StatTile
          icon={FileText}
          tint="bg-gradient-to-br from-violet-400/20 to-fuchsia-500/10 text-violet-300"
          label="Unlinked"
          value={kpis.unlinked}
        />
      </div>

      {/* Toolbar */}
      <Card className="notes-panel space-y-4 rounded-2xl border border-white/[0.08] bg-[#0d192b]/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.16)] sm:p-5">
        {/* Search row */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="h-11 w-full rounded-xl border border-white/10 bg-[#091423] pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition duration-200 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>

        {/* Quick-filter chips + result count */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
          <FilterChip
            label="All"
            count={chipCounts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterChip
            label="Pinned"
            count={chipCounts.pinned}
            active={filter === "pinned"}
            onClick={() => setFilter("pinned")}
          />
          <FilterChip
            label="Linked"
            count={chipCounts.linked}
            active={filter === "linked"}
            onClick={() => setFilter("linked")}
          />
          <FilterChip
            label="Unlinked"
            count={chipCounts.unlinked}
            active={filter === "unlinked"}
            onClick={() => setFilter("unlinked")}
          />

          <div className="ml-auto flex flex-wrap items-center gap-3">
            {isActive && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-cyan-300"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="whitespace-nowrap text-sm text-slate-400">
              <span className="font-semibold text-slate-100">{filtered.length}</span> of{" "}
              {notes?.length ?? 0}
            </span>
          </div>
        </div>
      </Card>

      {/* Masonry grid / loading / empty */}
      {notes === null ? (
        <Card className="notes-panel flex justify-center rounded-2xl border border-white/[0.08] bg-[#0d192b]/90 py-16">
          <Spinner />
        </Card>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#13233a] to-[#0b1626] px-4 py-8 shadow-[0_12px_35px_rgba(0,0,0,0.14)]">
          <EmptyState
            icon={StickyNote}
            title={isActive ? "No notes match" : "No notes yet"}
            description={
              isActive
                ? "Try adjusting your search or filters."
                : "Start capturing context for your leads and deals."
            }
            action={
              !isActive ? (
                <Button onClick={openNew}>
                  <Plus className="h-4 w-4" /> New note
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setToDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {/* New / Edit dialog */}
      <NoteFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        note={editing}
        leads={leads}
        onSaved={handleSaved}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this note?"
        description="This note will be permanently removed and cannot be recovered."
        confirmLabel="Delete note"
      />
    </div>
  );
}
