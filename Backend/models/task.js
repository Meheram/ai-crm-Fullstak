import mongoose from "mongoose";

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

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "pending",
      index: true,
    },

    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "medium",
    },

    relatedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },

    relatedContact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;