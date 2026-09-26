const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dependencies: [{ type: String }], // titles of tasks this one depends on

    priority: {
      type: String,
      enum: ["High", "Medium", "Low", "Unassigned"],
      default: "Unassigned",
    },
    effort: {
      type: String,
      enum: ["Small", "Medium", "Large", "Unassigned"],
      default: "Unassigned",
    },

    sprintNumber: { type: Number, default: null },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
