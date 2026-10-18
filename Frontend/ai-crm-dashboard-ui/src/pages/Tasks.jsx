import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPast, isToday } from "date-fns";

import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarCheck,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { StatCard } from "../components/common/StatCard";

import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Field,
  Badge,
  Dialog,
  Dropdown,
  DropdownItem,
  Tabs,
  Spinner,
} from "../components/ui";

import { tasksApi, leadsApi } from "../lib/services";
import { shortDate, dateInputValue } from "../lib/format";

import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";

import { cn } from "../lib/utils";

// ─────────────────────────────────────────────
// Priority bars
// ─────────────────────────────────────────────

const PRIORITY_BAR = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-slate-300",
};

// ─────────────────────────────────────────────
// Groups
// ─────────────────────────────────────────────

const GROUPS = [
  {
    key: "overdue",
    label: "Overdue",
    labelClass: "text-rose-700",
    countClass: "bg-rose-50 text-rose-700",
  },
  {
    key: "today",
    label: "Due today",
    labelClass: "text-amber-700",
    countClass: "bg-amber-50 text-amber-700",
  },
  {
    key: "upcoming",
    label: "Upcoming",
    labelClass: "text-ink",
    countClass: "bg-surface-muted text-ink-soft",
  },
  {
    key: "nodate",
    label: "No due date",
    labelClass: "text-ink-soft",
    countClass: "bg-surface-muted text-ink-soft",
  },
  {
    key: "completed",
    label: "Completed",
    labelClass: "text-brand-700",
    countClass: "bg-brand-50 text-brand-700",
  },
];

// ─────────────────────────────────────────────
// Status tabs
// IMPORTANT: values match Backend enum
// ─────────────────────────────────────────────

const STATUS_TABS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

// ─────────────────────────────────────────────
// Display helpers
// ─────────────────────────────────────────────

function formatStatus(status) {
  if (!status) return "";

  return status
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function formatPriority(priority) {
  if (!priority) return "";

  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1)
  );
}

// ─────────────────────────────────────────────
// Overdue
// ─────────────────────────────────────────────

function isOverdue(task) {
  if (
    !task.dueDate ||
    task.status === "completed"
  ) {
    return false;
  }

  const date = new Date(task.dueDate);

  return isPast(date) && !isToday(date);
}

// ─────────────────────────────────────────────
// Group task
// ─────────────────────────────────────────────

function groupKey(task) {
  if (task.status === "completed") {
    return "completed";
  }

  if (!task.dueDate) {
    return "nodate";
  }

  const date = new Date(task.dueDate);

  if (isToday(date)) {
    return "today";
  }

  if (isPast(date)) {
    return "overdue";
  }

  return "upcoming";
}

// ─────────────────────────────────────────────
// Task Form
// ─────────────────────────────────────────────

function TaskFormDialog({
  open,
  onClose,
  task,
  leads = [],
  onSaved,
}) {
  const isEdit = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  useEffect(() => {
    if (!open) return;

    if (task) {
      reset({
        title: task.title ?? "",
        description: task.description ?? "",
        dueDate: dateInputValue(task.dueDate),

        // Backend values
        status: task.status ?? "pending",
        priority: task.priority ?? "medium",

        relatedLead:
          task.relatedLead?._id ?? "",
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: "",

        // Backend values
        status: "pending",
        priority: "medium",

        relatedLead: "",
      });
    }
  }, [open, task, reset]);

  const onSubmit = async (values) => {
    const payload = {
      title: values.title.trim(),

      description:
        values.description?.trim() || "",

      dueDate:
        values.dueDate || null,

      // EXACT backend enum values
      status: values.status,

      // EXACT backend enum values
      priority: values.priority,

      relatedLead:
        values.relatedLead || null,
    };

    try {
      if (isEdit) {
        await tasksApi.update(
          task._id,
          payload
        );

        toast.success("Task updated");
      } else {
        await tasksApi.create(payload);

        toast.success("Task created");
      }

      onSaved();
      onClose();
    } catch (error) {
      toast.error(
        error?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        isEdit
          ? "Edit task"
          : "New task"
      }
      description={
        isEdit
          ? "Update the details below."
          : "Fill in the details to create a task."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Field
          label="Title"
          error={errors.title?.message}
        >
          <Input
            placeholder="e.g. Follow up with Acme Corp"
            {...register("title", {
              required:
                "Title is required",
            })}
          />
        </Field>

        <Field label="Description">
          <Textarea
            rows={3}
            placeholder="Optional notes…"
            {...register("description")}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Due date">
            <Input
              type="date"
              {...register("dueDate")}
            />
          </Field>

          <Field label="Priority">
            <Select
              {...register("priority")}
            >
              {TASK_PRIORITIES.map(
                (priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {formatPriority(
                      priority
                    )}
                  </option>
                )
              )}
            </Select>
          </Field>
        </div>

        <Field label="Status">
          <Select
            {...register("status")}
          >
            {TASK_STATUSES.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {formatStatus(status)}
                </option>
              )
            )}
          </Select>
        </Field>

        <Field label="Linked lead">
          <Select
            {...register("relatedLead")}
          >
            <option value="">
              No linked lead
            </option>

            {leads.map((lead) => (
              <option
                key={lead._id}
                value={lead._id}
              >
                {lead.name}
                {lead.company
                  ? ` — ${lead.company}`
                  : ""}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="flex-1"
            loading={isSubmitting}
          >
            {isEdit
              ? "Save changes"
              : "Create task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Task Row
// ─────────────────────────────────────────────

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const done =
    task.status === "completed";

  const inProgress =
    task.status === "in progress";

  const overdue = isOverdue(task);

  const dueToday = task.dueDate
    ? isToday(
        new Date(task.dueDate)
      )
    : false;

  return (
    <div className="group relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/50">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-full",
          PRIORITY_BAR[
            task.priority
          ] || "bg-slate-300"
        )}
      />

      <button
        type="button"
        onClick={() =>
          onToggle(task)
        }
        aria-label={
          done
            ? "Mark as pending"
            : "Mark as completed"
        }
        className={cn(
          "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors",

          done
            ? "text-brand-600 hover:text-brand-400"
            : inProgress
            ? "text-sky-500 hover:text-brand-500"
            : "text-ink-soft hover:text-brand-500"
        )}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : inProgress ? (
          <CircleDot className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            done
              ? "line-through text-ink-soft"
              : "text-ink"
          )}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 truncate text-xs text-ink-soft">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium",

                overdue
                  ? "bg-rose-50 text-rose-700"
                  : dueToday
                  ? "bg-amber-50 text-amber-700"
                  : "bg-surface-muted text-ink-soft"
              )}
            >
              {overdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}

              {overdue
                ? `Overdue · ${shortDate(
                    task.dueDate
                  )}`
                : dueToday
                ? `Today · ${shortDate(
                    task.dueDate
                  )}`
                : shortDate(
                    task.dueDate
                  )}
            </span>
          )}

          <Badge
            className={cn(
              "text-xs",
              PRIORITY_STYLES[
                task.priority
              ]
            )}
          >
            {formatPriority(
              task.priority
            )}
          </Badge>

          <Badge
            className={cn(
              "text-xs",
              TASK_STATUS_STYLES[
                task.status
              ]
            )}
          >
            {formatStatus(
              task.status
            )}
          </Badge>

          {task.relatedLead && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              <Building2 className="h-3 w-3" />
              {task.relatedLead.name}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <Dropdown
          trigger={
            <button
              type="button"
              className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted hover:text-ink"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem
            onClick={() =>
              onEdit(task)
            }
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownItem>

          <DropdownItem
            danger
            onClick={() =>
              onDelete(task)
            }
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Group Header
// ─────────────────────────────────────────────

function GroupHeader({
  label,
  count,
  labelClass,
  countClass,
}) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-muted/30 px-5 py-2">
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-wide",
          labelClass
        )}
      >
        {label}
      </span>

      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-semibold",
          countClass
        )}
      >
        {count}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Progress
// ─────────────────────────────────────────────

function ProgressCard({
  completed,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (completed / total) * 100
        )
      : 0;

  return (
    <Card className="px-5 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">
          {completed} of {total} tasks done
        </span>

        <span className="text-sm font-semibold text-brand-700">
          {percentage}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function Tasks() {
  const [tasks, setTasks] =
    useState(null);

  const [leads, setLeads] =
    useState([]);

  const [tab, setTab] =
    useState("all");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [toDelete, setToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // ───────────────────────────────────────────
  // Load
  // ───────────────────────────────────────────

  const load = () => {
    setTasks(null);

    tasksApi
      .list()
      .then((response) => {
        setTasks(
          response?.tasks || []
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load tasks:",
          error
        );

        setTasks([]);

        toast.error(
          error?.message ||
            "Could not load tasks"
        );
      });
  };

  useEffect(() => {
    load();

    leadsApi
      .list()
      .then((response) => {
        setLeads(
          response?.leads || []
        );
      })
      .catch(() => {
        setLeads([]);
      });
  }, []);

  // ───────────────────────────────────────────
  // Statistics
  // ───────────────────────────────────────────

  const stats = useMemo(() => {
    if (!tasks) {
      return {
        total: 0,
        pending: 0,
        overdue: 0,
        completed: 0,
      };
    }

    return {
      total: tasks.length,

      pending: tasks.filter(
        (task) =>
          task.status === "pending"
      ).length,

      overdue:
        tasks.filter(isOverdue).length,

      completed: tasks.filter(
        (task) =>
          task.status === "completed"
      ).length,
    };
  }, [tasks]);

  // ───────────────────────────────────────────
  // Filter
  // ───────────────────────────────────────────

  const filtered = useMemo(() => {
    if (!tasks) {
      return [];
    }

    if (tab === "all") {
      return tasks;
    }

    return tasks.filter(
      (task) =>
        task.status === tab
    );
  }, [tasks, tab]);

  // ───────────────────────────────────────────
  // Groups
  // ───────────────────────────────────────────

  const groupedSections =
    useMemo(() => {
      const map = {};

      GROUPS.forEach((group) => {
        map[group.key] = [];
      });

      filtered.forEach((task) => {
        const key = groupKey(task);

        if (map[key]) {
          map[key].push(task);
        }
      });

      return GROUPS.filter(
        (group) =>
          map[group.key].length > 0
      ).map((group) => ({
        ...group,
        tasks: map[group.key],
      }));
    }, [filtered]);

  // ───────────────────────────────────────────
  // New task
  // ───────────────────────────────────────────

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  // ───────────────────────────────────────────
  // Edit
  // ───────────────────────────────────────────

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  // ───────────────────────────────────────────
  // Toggle
  // IMPORTANT: lowercase values
  // ───────────────────────────────────────────

  const handleToggle = async (
    task
  ) => {
    const next =
      task.status === "completed"
        ? "pending"
        : "completed";

    try {
      await tasksApi.update(
        task._id,
        {
          status: next,
        }
      );

      toast.success(
        next === "completed"
          ? "Task completed"
          : "Task marked as pending"
      );

      load();
    } catch (error) {
      toast.error(
        error?.message ||
          "Could not update task"
      );
    }
  };

  // ───────────────────────────────────────────
  // Delete
  // ───────────────────────────────────────────

  const confirmDelete =
    async () => {
      if (!toDelete?._id) {
        return;
      }

      setDeleting(true);

      try {
        await tasksApi.delete(
          toDelete._id
        );

        toast.success(
          "Task deleted"
        );

        setToDelete(null);

        load();
      } catch (error) {
        toast.error(
          error?.message ||
            "Could not delete task"
        );
      } finally {
        setDeleting(false);
      }
    };

  // ───────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        subtitle="Stay on top of every commitment."
      >
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total tasks"
          value={stats.total}
          icon={CalendarCheck}
        />

        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Circle}
        />

        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          accent
        />
      </div>

      {tasks !== null && (
        <ProgressCard
          completed={
            stats.completed
          }
          total={stats.total}
        />
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-line px-5 py-3">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={STATUS_TABS}
          />
        </div>

        {tasks === null ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No tasks here"
            description={
              tab === "all"
                ? "Add your first follow-up to get started."
                : `No tasks with status "${formatStatus(
                    tab
                  )}".`
            }
            action={
              tab === "all" ? (
                <Button
                  onClick={openNew}
                >
                  <Plus className="h-4 w-4" />
                  Add task
                </Button>
              ) : null
            }
          />
        ) : (
          <div>
            {groupedSections.map(
              (group) => (
                <div
                  key={group.key}
                >
                  <GroupHeader
                    label={group.label}
                    count={
                      group.tasks.length
                    }
                    labelClass={
                      group.labelClass
                    }
                    countClass={
                      group.countClass
                    }
                  />

                  <div className="divide-y divide-line">
                    {group.tasks.map(
                      (task) => (
                        <TaskRow
                          key={
                            task._id
                          }
                          task={task}
                          onToggle={
                            handleToggle
                          }
                          onEdit={
                            openEdit
                          }
                          onDelete={
                            setToDelete
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Card>

      <TaskFormDialog
        open={formOpen}
        onClose={() =>
          setFormOpen(false)
        }
        task={editing}
        leads={leads}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(
          toDelete
        )}
        onClose={() =>
          setToDelete(null)
        }
        onConfirm={
          confirmDelete
        }
        loading={deleting}
        title="Delete this task?"
        description={`"${toDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}