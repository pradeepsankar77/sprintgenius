const express = require("express");
const Task = require("../models/Task");
const Sprint = require("../models/Sprint");

const router = express.Router();

// PATCH /tasks/:id - Update task fields (status, priority, effort, sprintNumber, title, description)
router.patch("/:id", async (req, res) => {
  try {
    const { status, priority, effort, sprintNumber, title, description, dependencies } = req.body;
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (effort !== undefined) updates.effort = effort;
    if (sprintNumber !== undefined) updates.sprintNumber = sprintNumber;
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (dependencies !== undefined) updates.dependencies = dependencies;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });

    // If sprintNumber changed, sync with Sprint document
    if (sprintNumber !== undefined) {
      // Remove from other sprints
      await Sprint.updateMany(
        { project: task.project, tasks: task._id },
        { $pull: { tasks: task._id } }
      );
      if (sprintNumber !== null) {
        await Sprint.findOneAndUpdate(
          { project: task.project, number: sprintNumber },
          { $addToSet: { tasks: task._id } },
          { upsert: true }
        );
      }
    }

    res.json(task);
  } catch (err) {
    console.error("Failed to update task:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Create a task
router.post("/", async (req, res) => {
  try {
    const { projectId, title, description, priority, effort, dependencies, sprintNumber } = req.body;
    if (!projectId || !title) {
      return res.status(400).json({ error: "Project ID and title are required" });
    }

    const task = await Task.create({
      project: projectId,
      title,
      description: description || "",
      priority: priority || "Unassigned",
      effort: effort || "Unassigned",
      dependencies: dependencies || [],
      sprintNumber: sprintNumber || null,
      status: "Pending",
    });

    if (sprintNumber) {
      await Sprint.findOneAndUpdate(
        { project: projectId, number: sprintNumber },
        { $addToSet: { tasks: task._id } },
        { upsert: true }
      );
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await Sprint.updateMany({ project: task.project }, { $pull: { tasks: task._id } });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

