/* Shared domain constants kept in one place so UI + filters stay in sync
   with the backend enums. */

// ─────────────────────────────────────────────
// Lead constants
// ─────────────────────────────────────────────

export const LEAD_STAGES = [
  "New",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

export const PIPELINE_STAGES = [
  "New",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

export const LEAD_PRIORITIES = [
  "Low",
  "Medium",
  "High",
];

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Cold Outreach",
  "Social",
  "Event",
  "Other",
];

// ─────────────────────────────────────────────
// Task constants
// IMPORTANT:
// These values MUST exactly match the Backend
// Mongoose enums.
// ─────────────────────────────────────────────

export const TASK_STATUSES = [
  "pending",
  "in progress",
  "completed",
];

export const TASK_PRIORITIES = [
  "low",
  "medium",
  "high",
];

// ─────────────────────────────────────────────
// Lead stage styles
// ─────────────────────────────────────────────

export const STAGE_STYLES = {
  New: {
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700",
    bar: "bg-sky-500",
  },

  Qualified: {
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    bar: "bg-violet-500",
  },

  Proposal: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
  },

  Won: {
    dot: "bg-brand-500",
    badge: "bg-brand-50 text-brand-700",
    bar: "bg-brand-500",
  },

  Lost: {
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
  },
};

// ─────────────────────────────────────────────
// Lead priority styles
// ─────────────────────────────────────────────

export const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-rose-50 text-rose-700",
};

// ─────────────────────────────────────────────
// Task priority styles
// IMPORTANT:
// Keys MUST match TASK_PRIORITIES.
// ─────────────────────────────────────────────

export const TASK_PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

// ─────────────────────────────────────────────
// Task status styles
// IMPORTANT:
// Keys MUST match TASK_STATUSES.
// ─────────────────────────────────────────────

export const TASK_STATUS_STYLES = {
  pending: "bg-slate-100 text-slate-600",

  "in progress":
    "bg-sky-50 text-sky-700",

  completed:
    "bg-brand-50 text-brand-700",
};