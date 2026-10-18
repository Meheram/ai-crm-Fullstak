import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CalendarRange,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Target,
  Layers,
  PieChart as PieIcon,
  CalendarClock,
  Trophy,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { format, isPast } from "date-fns";
import { HeroCard } from "../components/dashboard/HeroCard";
import { AiInsightsCard } from "../components/ai/AiInsightsCard";
import {
  Card,
  SectionHeading,
  Badge,
  Tabs,
  Skeleton,
  Avatar,
} from "../components/ui";
import { analyticsApi, contactsApi, leadsApi, tasksApi } from "../lib/services";
import { currency, shortDate, timeOf } from "../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

/* Executive Navy & Gold palette */
const SOURCE_COLORS = [
  "#D6B875",
  "#A98B4F",
  "#73859C",
  "#E8D9B0",
  "#52647C",
  "#B7A06D",
];

const NAVY_CARD =
  "!border-[#344154] !bg-[#1A2638] shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-all duration-300 hover:!border-[#8F794C] hover:shadow-[0_16px_36px_rgba(0,0,0,0.24)]";

const GOLD_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4CB8C]/30 bg-gradient-to-r from-[#D6B875] to-[#B99A59] font-semibold text-[#101827] shadow-[0_6px_18px_rgba(214,184,117,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    analyticsApi.overview().then(setData).catch(() => setData(false));
    contactsApi.list().then((res) => setContacts(res.contacts || [])).catch(() => {});
    leadsApi.list().then((res) => setLeads(res.leads || [])).catch(() => {});
    tasksApi.list().then((res) => setTasks(res.tasks || [])).catch(() => {});
  }, []);

  if (data === null) return <DashboardSkeleton />;
  const stats = data?.stats || {};

  // A friendly trailing date-range label for the header pill.
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const rangeLabel = `${format(start, "dd MMM")} – ${format(today, "dd MMM, yyyy")}`;

  return (
    <div className="min-h-full space-y-6 rounded-2xl bg-[#101827] p-3 text-[#F4F1E9] sm:space-y-7 sm:p-5 lg:p-6">
      {/* Title row */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#344154] bg-gradient-to-br from-[#1A2638] via-[#172336] to-[#101827] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#D6B875]">
            Executive Overview
          </p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#F4F1E9] sm:text-[2.5rem]">
            Welcome Back,{" "}
            <span className="text-[#D6B875]">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#A8B4C5]">
            Here is what is happening with your business.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-[#344154] bg-[#101827]/80 px-4 py-3 text-sm font-medium text-[#D2D8E2] sm:flex">
            <CalendarRange className="h-4 w-4 text-[#D6B875]" />
            {rangeLabel}
          </div>
          <Link
            to="/leads"
            className={cn(GOLD_BUTTON, "h-11 px-5 text-sm")}
          >
            <Plus className="h-4 w-4" />
            Add New Lead
          </Link>
        </div>
      </div>

      {/* Balanced 3-column composition */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* Left column */}
        <div className="space-y-5 lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#8F794C]/40 bg-gradient-to-br from-[#263548] via-[#1A2638] to-[#101827] shadow-[0_16px_35px_rgba(0,0,0,0.2)]">
            <HeroCard value={stats.pipelineValue} />
          </div>

          <Card className={cn("rounded-2xl p-5", NAVY_CARD)}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#A8B4C5]">
                Weekly Revenue
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D6B875]/20 bg-[#D6B875]/10">
                <CreditCard className="h-4 w-4 text-[#D6B875]" />
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="font-display text-2xl font-bold tracking-tight text-[#F4F1E9]">
                {currency(stats.revenueWon, { compact: true })}
              </p>
              <Badge className="border border-[#86C7A0]/20 bg-[#86C7A0]/10 text-[#9AD8AF]">
                <ArrowUpRight className="h-3 w-3" /> 12.8%
              </Badge>
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-[#D6B875]/40 via-[#344154] to-transparent" />
          </Card>

          {/* Conversion stat */}
          <Card className={cn("rounded-2xl p-6", NAVY_CARD)}>
            <SectionHeading
              icon={Target}
              title="Conversion"
              subtitle="Win rate"
            />
            <div className="mt-5 flex items-end gap-2">
              <p className="font-display text-3xl font-bold text-[#F4F1E9]">
                {stats.conversionRate ?? 0}
                <span className="ml-1 text-xl text-[#D6B875]">%</span>
              </p>
              <Badge className="mb-1 border border-[#86C7A0]/20 bg-[#86C7A0]/10 text-[#9AD8AF]">
                <ArrowUpRight className="h-3 w-3" /> 4.1%
              </Badge>
            </div>
            <p className="mt-2 text-sm text-[#A8B4C5]">
              {stats.totalLeads ?? 0} leads · {stats.openTasks ?? 0} open tasks
            </p>
          </Card>

          <UpcomingTasks tasks={tasks} />
          <TopContactsCard contacts={contacts} />
        </div>

        {/* Center column */}
        <div className="space-y-5 lg:col-span-6">
          <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
            <SectionHeading
              icon={CreditCard}
              title="Pipeline Engagement"
              subtitle="New leads per month"
              action={
                <Tabs
                  value={range}
                  onChange={setRange}
                  tabs={[
                    { value: "monthly", label: "Monthly" },
                    { value: "annually", label: "Annually" },
                  ]}
                />
              }
            />
            <div className="mt-5 rounded-xl border border-[#344154]/70 bg-[#101827]/45 p-2 sm:p-3">
              <EngagementChart trend={data?.trend || []} />
            </div>
          </Card>

          <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
            <SectionHeading
              title="Lead Activity"
              subtitle="Recent lead movements"
              to="/leads"
            />
            <div className="mt-5">
              <ActivityTable leads={data?.recentLeads || []} />
            </div>
          </Card>

          <PipelineByStage pipeline={data?.pipeline || []} />
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:col-span-3">
          {/* Revenue / balance card */}
          <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
            <SectionHeading
              title="Revenue Goal"
              subtitle="Closed-won total"
              to="/pipeline"
            />
            <div className="mt-5 rounded-xl border border-[#D6B875]/15 bg-gradient-to-br from-[#263548]/80 to-[#101827] px-3 py-4">
              <p className="text-center text-sm text-[#A8B4C5]">Total Won</p>
              <p className="mt-1 text-center font-display text-3xl font-bold tracking-tight text-[#D6B875]">
                {currency(stats.revenueWon)}
              </p>
              <BalanceChart trend={data?.trend || []} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/leads"
                className={cn(GOLD_BUTTON, "h-10 flex-1 text-sm")}
              >
                <Plus className="h-4 w-4" /> Add Lead
              </Link>
              <Link
                to="/tasks"
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#52647C] bg-[#263548]/60 text-sm font-medium text-[#E2E7EF] transition-all duration-300 hover:border-[#D6B875]/60 hover:bg-[#344154]"
              >
                <CheckCircle2 className="h-4 w-4 text-[#D6B875]" /> Task
              </Link>
            </div>
          </Card>

          <div className="overflow-hidden rounded-2xl border border-[#344154] bg-[#1A2638] shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
            <AiInsightsCard />
          </div>

          <LeadsBySource leads={leads} />
          <TopDeals leads={leads} />
        </div>
      </div>
    </div>
  );
}

/* Pipeline by stage */
function PipelineByStage({ pipeline, className }) {
  const maxValue = Math.max(...pipeline.map((s) => s.value), 1);
  const totalValue = pipeline.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD, className)}>
      <SectionHeading
        icon={Layers}
        title="Pipeline by Stage"
        subtitle="Deal value across each stage"
        to="/pipeline"
      />
      <div className="mt-5 space-y-5">
        {pipeline.map((s) => {
          const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
          const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
          return (
            <div key={s.stage}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-[#E2E7EF]">
                  <span className={cn("h-2.5 w-2.5 rounded-full ring-4 ring-white/5", style.dot)} />
                  {s.stage}
                  <span className="text-[#8E9CB0]">· {s.count}</span>
                </span>
                <span className="font-semibold text-[#F4F1E9]">
                  {currency(s.value, { compact: true })}
                  <span className="ml-1.5 text-xs font-normal text-[#A8B4C5]">
                    {pct}%
                  </span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full border border-[#344154] bg-[#101827]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8F794C] via-[#D6B875] to-[#E8D9B0] shadow-[0_0_12px_rgba(214,184,117,0.18)] transition-all duration-500"
                  style={{ width: `${Math.max((s.value / maxValue) * 100, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
        {pipeline.length === 0 && (
          <p className="py-6 text-center text-sm text-[#A8B4C5]">
            No pipeline data yet.
          </p>
        )}
      </div>
    </Card>
  );
}

/* Leads by source */
function LeadsBySource({ leads }) {
  const grouped = leads.reduce((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const dataset = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
      <SectionHeading
        icon={PieIcon}
        title="Leads by Source"
        subtitle="Where leads come from"
      />
      {dataset.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#A8B4C5]">
          No leads yet.
        </p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataset}
                  dataKey="value"
                  innerRadius={44}
                  outerRadius={66}
                  paddingAngle={3}
                  stroke="#1A2638"
                  strokeWidth={3}
                >
                  {dataset.map((_, i) => (
                    <Cell
                      key={i}
                      fill={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip unit=" leads" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-[#F4F1E9]">
                {leads.length}
              </span>
              <span className="text-[11px] text-[#A8B4C5]">leads</span>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-2">
            {dataset.map((d, i) => (
              <li
                key={d.name}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-[#263548]/70"
              >
                <span className="flex min-w-0 items-center gap-2 text-[#B7C1D0]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(214,184,117,0.12)]"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-semibold text-[#F4F1E9]">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/* Upcoming follow-ups */
function UpcomingTasks({ tasks }) {
  const upcoming = tasks
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 4);

  return (
    <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
      <SectionHeading
        icon={CalendarClock}
        title="Upcoming Follow-ups"
        subtitle="Don't let these slip"
        to="/tasks"
      />
      {upcoming.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#A8B4C5]">
          You're all caught up 🎉
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {upcoming.map((t) => {
            const overdue = t.dueDate && isPast(new Date(t.dueDate));
            return (
              <li key={t._id} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    overdue
                      ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                      : "border-[#D6B875]/20 bg-[#D6B875]/10 text-[#D6B875]"
                  )}
                >
                  {overdue ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#F4F1E9]">
                    {t.title}
                  </p>
                  <p className={cn("mt-1 text-xs", overdue ? "text-rose-300" : "text-[#A8B4C5]")}>
                    {t.dueDate ? shortDate(t.dueDate) : "No due date"}
                    {t.relatedLead?.name ? ` · ${t.relatedLead.name}` : ""}
                  </p>
                </div>
                <Badge className={cn("border border-[#52647C] bg-[#263548] text-[#E2E7EF]", PRIORITY_STYLES[t.priority])}>
                  {t.priority}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* Top open deals */
function TopDeals({ leads }) {
  const deals = [...leads]
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 5);

  return (
    <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
      <SectionHeading
        icon={Trophy}
        title="Top Open Deals"
        subtitle="Biggest active opportunities"
        to="/leads"
      />
      {deals.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#A8B4C5]">
          No open deals yet.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {deals.map((l, i) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <li
                key={l._id}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-[#344154] hover:bg-[#263548]/60"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D6B875]/20 bg-[#D6B875]/10 text-xs font-bold text-[#D6B875]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#F4F1E9]">
                    {l.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-[#A8B4C5]">
                    <Building2 className="h-3 w-3 shrink-0 text-[#D6B875]" />
                    {l.company || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#F4F1E9]">
                    {currency(l.value, { compact: true })}
                  </p>
                  <span className={cn("text-[11px] font-medium", style.badge, "bg-transparent px-0")}>
                    {l.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* Engagement bar chart */
function EngagementChart({ trend }) {
  const counts = trend.map((t) => t.leads);
  const max = Math.max(...counts, 1);
  const maxIndex = counts.indexOf(max);
  const prev = maxIndex > 0 ? counts[maxIndex - 1] : 0;
  const growth = prev > 0 ? Math.round(((max - prev) / prev) * 1000) / 10 : 17.8;

  const renderPeak = (props) => {
    const { x, y, width, index } = props;
    if (index !== maxIndex) return null;
    const cx = x + width / 2;
    return (
      <g>
        <circle
          cx={cx}
          cy={y}
          r={5}
          fill="#D6B875"
          stroke="#1A2638"
          strokeWidth={2}
        />
        <rect
          x={cx - 26}
          y={y - 34}
          width={52}
          height={22}
          rx={11}
          fill="#D6B875"
        />
        <text
          x={cx}
          y={y - 19}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#101827"
        >
          +{growth}%
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={trend} barCategoryGap="28%" margin={{ top: 30 }}>
        <CartesianGrid
          vertical={false}
          stroke="#344154"
          strokeDasharray="4 5"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#A8B4C5", fontSize: 12 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#A8B4C5", fontSize: 12 }}
          width={30}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
        />
        <Tooltip
          cursor={{ fill: "#52647C", fillOpacity: 0.15 }}
          content={<ChartTooltip unit=" leads" />}
        />
        <Bar
          dataKey="leads"
          radius={[8, 8, 3, 3]}
          maxBarSize={42}
          label={renderPeak}
        >
          {trend.map((t, i) => (
            <Cell
              key={i}
              fill={i === maxIndex ? "#D6B875" : "#52647C"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function BalanceChart({ trend }) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={trend} margin={{ top: 14, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D6B875" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#D6B875" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={<ChartTooltip prefix="$" />} />
        <Area
          type="monotone"
          dataKey="won"
          stroke="#D6B875"
          strokeWidth={2.5}
          fill="url(#balance)"
          activeDot={{ r: 4, fill: "#E8D9B0", stroke: "#101827", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#52647C] bg-[#101827] px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <p className="text-xs font-medium text-[#A8B4C5]">{label}</p>
      <p className="text-sm font-semibold text-[#D6B875]">
        {prefix}
        {Number(payload[0].value).toLocaleString()}
        {unit}
      </p>
    </div>
  );
}

/* Recent activity table */
function ActivityTable({ leads }) {
  if (!leads.length)
    return (
      <p className="py-10 text-center text-sm text-[#A8B4C5]">
        No recent activity yet.
      </p>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-[#344154]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#101827]/80 text-left text-[11px] uppercase tracking-[0.12em] text-[#A8B4C5]">
            <th className="px-3 py-3 font-semibold sm:px-4">Name</th>
            <th className="px-3 py-3 font-semibold sm:px-4">Date</th>
            <th className="hidden px-3 py-3 font-semibold sm:table-cell sm:px-4">Time</th>
            <th className="px-3 py-3 font-semibold sm:px-4">Status</th>
            <th className="px-3 py-3 text-right font-semibold sm:px-4">Value</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <tr
                key={l.id}
                className="border-t border-[#344154] transition-colors hover:bg-[#263548]/70"
              >
                <td className="px-3 py-3.5 sm:px-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={l.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-[#F4F1E9]">{l.name}</p>
                      <p className="text-xs text-[#A8B4C5]">{l.company || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[#B7C1D0] sm:px-4">
                  {shortDate(l.updatedAt)}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-3.5 text-[#B7C1D0] sm:table-cell sm:px-4">
                  {timeOf(l.updatedAt)}
                </td>
                <td className="px-3 py-3.5 sm:px-4">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-[#E2E7EF]">
                    <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                    {l.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-semibold text-[#D6B875] sm:px-4">
                  {currency(l.value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* Top contacts */
function TopContactsCard({ contacts }) {
  const top = contacts.slice(0, 4);
  const overflow = Math.max(contacts.length - top.length, 0);

  return (
    <Card className={cn("rounded-2xl p-5 sm:p-6", NAVY_CARD)}>
      <SectionHeading
        title="Top Contacts"
        subtitle="Your key relationships"
        to="/contacts"
      />
      {contacts.length === 0 ? (
        <p className="mt-4 text-sm text-[#A8B4C5]">No contacts yet.</p>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex -space-x-3">
            {top.map((c) => (
              <Avatar
                key={c._id}
                name={c.name}
                src={c.avatar}
                size="md"
                className="ring-2 ring-[#1A2638]"
              />
            ))}
            {overflow > 0 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A2638] bg-gradient-to-br from-[#D6B875] to-[#A98B4F] text-sm font-bold text-[#101827]">
                +{overflow}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="whitespace-nowrap text-sm font-semibold text-[#D6B875] transition-colors hover:text-[#E8D9B0] hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-full space-y-6 rounded-2xl bg-[#101827] p-3 sm:p-5 lg:p-6">
      <Skeleton className="h-12 w-80 rounded-xl !bg-[#263548]" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-64 rounded-2xl !bg-[#1A2638]" />
          <Skeleton className="h-24 rounded-2xl !bg-[#1A2638]" />
        </div>
        <div className="space-y-5 lg:col-span-6">
          <Skeleton className="h-80 rounded-2xl !bg-[#1A2638]" />
          <Skeleton className="h-64 rounded-2xl !bg-[#1A2638]" />
        </div>
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-56 rounded-2xl !bg-[#1A2638]" />
          <Skeleton className="h-32 rounded-2xl !bg-[#1A2638]" />
          <Skeleton className="h-32 rounded-2xl !bg-[#1A2638]" />
        </div>
      </div>
    </div>
  );
}