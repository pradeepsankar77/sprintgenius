const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Sprint = require("../models/Sprint");

const router = express.Router();

// GET /projects - List all projects with task counts and metadata
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const taskCount = await Task.countDocuments({ project: p._id });
        const completedCount = await Task.countDocuments({
          project: p._id,
          status: "Completed",
        });
        const sprintCount = await Sprint.countDocuments({ project: p._id });
        return {
          ...p.toObject(),
          taskCount,
          completedCount,
          sprintCount,
        };
      })
    );
    res.json(projectsWithCounts);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /projects - Create project from raw text/markdown directly (no file required)
router.post("/", async (req, res) => {
  try {
    const { name, rawText } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }
    const project = await Project.create({
      name,
      rawText: rawText || "",
      status: "uploaded",
    });
    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    console.error("Failed to create project:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /projects/:id - Get project detail
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /projects/:id - Delete project and cascaded tasks & sprints
router.delete("/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    await Task.deleteMany({ project: projectId });
    await Sprint.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);
    res.json({ message: "Project and associated tasks/sprints deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /projects/:id/tasks - Get all tasks for a project
router.get("/:id/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /projects/:id/sprints - Get sprints with populated tasks
router.get("/:id/sprints", async (req, res) => {
  try {
    const sprints = await Sprint.find({ project: req.params.id })
      .populate("tasks")
      .sort({ number: 1 });
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

