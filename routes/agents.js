const express = require("express");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Sprint = require("../models/Sprint");
const { askBobForJSON, askBob } = require("../services/ibmBob");

const router = express.Router();

// ---------------------------------------------------------------------
// Agent 1: Requirement Analyzer
// POST /agents/analyze-requirements  { projectId }
// Reads the project's parsed text and extracts features/tasks/dependencies.
// ---------------------------------------------------------------------
router.post("/analyze-requirements", async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const prompt = `You are a requirement analyzer for a software project.
Read the requirement text below and extract a list of tasks needed to build it.
For each task, give: title, short description, and any dependencies (titles of other tasks it depends on, or empty array).
Return JSON in this exact shape: { "tasks": [ { "title": "", "description": "", "dependencies": [] } ] }`;

    const result = await askBobForJSON(prompt, project.rawText);

    const createdTasks = await Task.insertMany(
      result.tasks.map((t) => ({
        project: project._id,
        title: t.title,
        description: t.description,
        dependencies: t.dependencies || [],
      }))
    );

    project.status = "analyzed";
    await project.save();

    res.json({ message: "Requirements analyzed", tasks: createdTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Agents 2 & 3: Priority Manager + Effort Estimator (combined pass)
// POST /agents/classify-tasks  { projectId }
// ---------------------------------------------------------------------
router.post("/classify-tasks", async (req, res) => {
  try {
    const { projectId } = req.body;
    const tasks = await Task.find({ project: projectId });
    if (!tasks.length) return res.status(404).json({ error: "No tasks found for this project" });

    const taskList = tasks.map((t) => ({ id: t._id.toString(), title: t.title, description: t.description }));

    const prompt = `You are classifying software development tasks.
For each task below, assign:
- priority: "High", "Medium", or "Low" (based on business impact, risk, dependencies)
- effort: "Small" (1-2 days), "Medium" (3-5 days), or "Large" (1-2 weeks)
Return JSON: { "classifications": [ { "id": "<task id>", "priority": "", "effort": "" } ] }

Tasks:
${JSON.stringify(taskList, null, 2)}`;

    const result = await askBobForJSON(prompt);

    const updates = result.classifications.map((c) =>
      Task.findByIdAndUpdate(c.id, { priority: c.priority, effort: c.effort })
    );
    await Promise.all(updates);

    const updatedTasks = await Task.find({ project: projectId });
    res.json({ message: "Tasks classified", tasks: updatedTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Agent 4: Sprint Planner
// POST /agents/plan-sprints  { projectId }
// ---------------------------------------------------------------------
router.post("/plan-sprints", async (req, res) => {
  try {
    const { projectId } = req.body;
    const tasks = await Task.find({ project: projectId });
    if (!tasks.length) return res.status(404).json({ error: "No tasks found for this project" });

    const taskList = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      priority: t.priority,
      effort: t.effort,
      dependencies: t.dependencies,
    }));

    const prompt = `You are a sprint planner. Group these tasks into sprints (aim for 2-week sprints).
Consider priority, effort, and dependencies - a task cannot be in an earlier sprint than its dependencies.
Return JSON: { "sprints": [ { "number": 1, "taskIds": ["..."] } ] }

Tasks:
${JSON.stringify(taskList, null, 2)}`;

    const result = await askBobForJSON(prompt);

    // Clear any previous sprint plan for this project, then recreate it.
    await Sprint.deleteMany({ project: projectId });

    const sprints = await Sprint.insertMany(
      result.sprints.map((s) => ({
        project: projectId,
        number: s.number,
        tasks: s.taskIds,
      }))
    );

    await Promise.all(
      result.sprints.map((s) =>
        Task.updateMany({ _id: { $in: s.taskIds } }, { sprintNumber: s.number })
      )
    );

    const project = await Project.findById(projectId);
    project.status = "planned";
    await project.save();

    res.json({ message: "Sprint plan created", sprints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Agent 5: Risk Detection
// POST /agents/detect-risks  { projectId }
// ---------------------------------------------------------------------
router.post("/detect-risks", async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    const tasks = await Task.find({ project: projectId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const prompt = `You are a risk detection agent for a software project.
Based on the original requirements and the current task/sprint plan below, identify:
- missing requirements
- dependency conflicts
- tasks at risk of delay
- high-risk modules
Return JSON: { "risks": [ { "type": "", "description": "" } ] }

Tasks and plan:
${JSON.stringify(tasks.map((t) => ({ title: t.title, priority: t.priority, effort: t.effort, sprint: t.sprintNumber, dependencies: t.dependencies })), null, 2)}`;

    const result = await askBobForJSON(prompt, project.rawText);
    res.json({ risks: result.risks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------
// Agent 6: Progress Tracker
// GET /agents/progress/:projectId
// ---------------------------------------------------------------------
router.get("/progress/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    if (!tasks.length) return res.status(404).json({ error: "No tasks found for this project" });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;

    const percentages = {
      completed: Math.round((completed / total) * 100),
      inProgress: Math.round((inProgress / total) * 100),
      pending: Math.round((pending / total) * 100),
    };

    // Ask Bob for a short natural-language summary of where the project stands.
    const summary = await askBob(
      `Write a 2-3 sentence progress summary for a project that is ${percentages.completed}% complete, ${percentages.inProgress}% in progress, and ${percentages.pending}% pending. Be concise and practical for a project manager.`
    );

    res.json({ percentages, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
