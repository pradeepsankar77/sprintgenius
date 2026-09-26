import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Kanban,
  CalendarDays,
  ShieldAlert,
  Bot,
  Layers,
  FileUp,
  FolderGit2,
  RefreshCw,
  ExternalLink,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

import Navbar from "./components/Navbar";
import AgentPipeline from "./components/AgentPipeline";
import KanbanBoard from "./components/KanbanBoard";
import SprintRoadmap from "./components/SprintRoadmap";
import RiskAnalysisView from "./components/RiskAnalysisView";
import ProgressDashboard from "./components/ProgressDashboard";
import UploadModal from "./components/UploadModal";
import TaskModal from "./components/TaskModal";

import {
  getProjects,
  getProjectTasks,
  getProjectSprints,
  createProject,
  uploadDocument,
  deleteProject,
  updateTask,
  createTask,
  deleteTask,
  runAgent1_AnalyzeRequirements,
  runAgents23_ClassifyTasks,
  runAgent4_PlanSprints,
  runAgent5_DetectRisks,
  runAgent6_GetProgress,
  checkBackendHealth,
} from "./services/api";

import { SAMPLE_PRDS } from "./data/sampleProjects";

export default function App() {
  // Global Project & Task State
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [risks, setRisks] = useState([]);
  const [progressData, setProgressData] = useState(null);

  // Active View Tab: "kanban" | "roadmap" | "risks" | "insights"
  const [activeTab, setActiveTab] = useState("kanban");

  // Agent Pipeline State
  const [agentStates, setAgentStates] = useState({
    analyzer: "idle",
    classifier: "idle",
    planner: "idle",
    risk: "idle",
    coach: "idle",
  });
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  // Modals & Health State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmittingPRD, setIsSubmittingPRD] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  const addLog = (agent, message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, agent, message }, ...prev]);
  };

  // Initial Data Load
  useEffect(() => {
    initApp();
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      setIsBackendOnline(health.status === "online");
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const initApp = async () => {
    const health = await checkBackendHealth();
    setIsBackendOnline(health.status === "online");

    try {
      const pList = await getProjects();
      setProjects(pList);
      if (pList.length > 0) {
        selectProject(pList[0]);
      } else {
        // Automatically preload the first sample PRD if no projects exist
        loadInitialSamplePRD();
      }
    } catch (err) {
      console.warn("Backend not reached during init, loading local sample:", err);
      setIsBackendOnline(false);
      loadInitialSamplePRD();
    }
  };

  const loadInitialSamplePRD = async () => {
    const sample = SAMPLE_PRDS[0];
    try {
      const res = await createProject({ name: sample.name, rawText: sample.text });
      if (res && res.project) {
        setProjects([res.project]);
        selectProject(res.project);
        addLog("System", `Initialized project "${sample.name}" from template.`);
      }
    } catch {
      // Fallback local memory project
      const mockProject = {
        _id: "demo-proj-1",
        name: sample.name,
        rawText: sample.text,
        status: "uploaded",
        createdAt: new Date().toISOString(),
      };
      setProjects([mockProject]);
      setSelectedProject(mockProject);
    }
  };

  const selectProject = async (project) => {
    setSelectedProject(project);
    try {
      const [tList, sList] = await Promise.all([
        getProjectTasks(project._id),
        getProjectSprints(project._id),
      ]);
      setTasks(tList || []);
      setSprints(sList || []);

      // If tasks already exist, load progress
      if (tList && tList.length > 0) {
        try {
          const prog = await runAgent6_GetProgress(project._id);
          setProgressData(prog);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
    }
  };

  // ----------------------------------------------------
  // Autonomous 6-Agent Pipeline Execution
  // ----------------------------------------------------
  const handleRunPipeline = async () => {
    if (!selectedProject || isPipelineRunning) return;
    setIsPipelineRunning(true);
    addLog("Pipeline", `Starting Autonomous Multi-Agent Orchestration on "${selectedProject.name}"`);

    // Reset agent states
    setAgentStates({
      analyzer: "running",
      classifier: "idle",
      planner: "idle",
      risk: "idle",
      coach: "idle",
    });
    setActiveAgentId("analyzer");

    try {
      // STAGE 1: Agent 1 - Requirement Analyzer
      addLog("Agent 1: Requirement Analyzer", "Parsing requirement text and extracting user stories & dependencies...");
      const res1 = await runAgent1_AnalyzeRequirements(selectedProject._id);
      const updatedTasks1 = res1.tasks || (await getProjectTasks(selectedProject._id));
      setTasks(updatedTasks1);
      setAgentStates((prev) => ({ ...prev, analyzer: "completed", classifier: "running" }));
      setActiveAgentId("classifier");
      addLog("Agent 1: Requirement Analyzer", `Extracted ${updatedTasks1.length} granular user stories.`);

      await new Promise((r) => setTimeout(r, 600));

      // STAGE 2: Agents 2 & 3 - Priority & Effort
      addLog("Agents 2 & 3: Priority & Effort", "Evaluating business impact, complexity matrices, and assigning effort...");
      const res2 = await runAgents23_ClassifyTasks(selectedProject._id);
      const updatedTasks2 = res2.tasks || (await getProjectTasks(selectedProject._id));
      setTasks(updatedTasks2);
      setAgentStates((prev) => ({ ...prev, classifier: "completed", planner: "running" }));
      setActiveAgentId("planner");
      addLog("Agents 2 & 3: Priority & Effort", "Completed priority matrix and story point estimation.");

      await new Promise((r) => setTimeout(r, 600));

      // STAGE 3: Agent 4 - Sprint Planner
      addLog("Agent 4: Sprint Planner", "Formulating balanced 2-week sprints respecting prerequisite dependencies...");
      const res4 = await runAgent4_PlanSprints(selectedProject._id);
      setSprints(res4.sprints || []);
      const updatedTasks3 = await getProjectTasks(selectedProject._id);
      setTasks(updatedTasks3);
      setAgentStates((prev) => ({ ...prev, planner: "completed", risk: "running" }));
      setActiveAgentId("risk");
      addLog("Agent 4: Sprint Planner", `Organized tasks into ${res4.sprints?.length || 2} execution sprints.`);

      await new Promise((r) => setTimeout(r, 600));

      // STAGE 4: Agent 5 - Risk Detection
      addLog("Agent 5: Risk Detection", "Auditing architecture for delivery bottlenecks and missing specs...");
      const res5 = await runAgent5_DetectRisks(selectedProject._id);
      setRisks(res5.risks || []);
      setAgentStates((prev) => ({ ...prev, risk: "completed", coach: "running" }));
      setActiveAgentId("coach");
      addLog("Agent 5: Risk Detection", `Identified ${res5.risks?.length || 0} risk vectors with mitigations.`);

      await new Promise((r) => setTimeout(r, 600));

      // STAGE 5: Agent 6 - Agile Coach & Progress
      addLog("Agent 6: Agile Coach", "Calculating velocity metrics and synthesizing executive standup briefing...");
      const res6 = await runAgent6_GetProgress(selectedProject._id);
      setProgressData(res6);
      setAgentStates((prev) => ({ ...prev, coach: "completed" }));
      setActiveAgentId(null);
      addLog("Agent 6: Agile Coach", "Sprint intelligence briefing synthesized successfully.");

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#06b6d4", "#a855f7", "#10b981"],
        });
      } catch {
        // ignore
      }
      addLog("Pipeline", "Autonomous multi-agent execution completed with 100% success!");
    } catch (err) {
      console.error("Pipeline run error:", err);
      addLog("Pipeline Error", err.message);
      setAgentStates((prev) => ({ ...prev, [activeAgentId || "analyzer"]: "error" }));
    } finally {
      setIsPipelineRunning(false);
      setActiveAgentId(null);
    }
  };

  // ----------------------------------------------------
  // Single Agent Run Trigger
  // ----------------------------------------------------
  const handleRunAgent = async (agentKey) => {
    if (!selectedProject || isPipelineRunning) return;
    setAgentStates((prev) => ({ ...prev, [agentKey]: "running" }));
    setActiveAgentId(agentKey);

    try {
      if (agentKey === "analyzer") {
        addLog("Agent 1", "Parsing requirements...");
        const res = await runAgent1_AnalyzeRequirements(selectedProject._id);
        const t = res.tasks || (await getProjectTasks(selectedProject._id));
        setTasks(t);
        addLog("Agent 1", `Ingestion complete. Extracted ${t.length} tasks.`);
      } else if (agentKey === "classifier") {
        addLog("Agents 2 & 3", "Classifying priority and effort...");
        const res = await runAgents23_ClassifyTasks(selectedProject._id);
        setTasks(res.tasks || (await getProjectTasks(selectedProject._id)));
        addLog("Agents 2 & 3", "Tasks classified.");
      } else if (agentKey === "planner") {
        addLog("Agent 4", "Planning sprints...");
        const res = await runAgent4_PlanSprints(selectedProject._id);
        setSprints(res.sprints || []);
        setTasks(await getProjectTasks(selectedProject._id));
        addLog("Agent 4", `Sprints planned: ${res.sprints?.length || 0} sprints.`);
      } else if (agentKey === "risk") {
        addLog("Agent 5", "Auditing risks...");
        const res = await runAgent5_DetectRisks(selectedProject._id);
        setRisks(res.risks || []);
        addLog("Agent 5", `Identified ${res.risks?.length || 0} risks.`);
      } else if (agentKey === "coach") {
        addLog("Agent 6", "Calculating progress...");
        const res = await runAgent6_GetProgress(selectedProject._id);
        setProgressData(res);
        addLog("Agent 6", "Progress updated.");
      }
      setAgentStates((prev) => ({ ...prev, [agentKey]: "completed" }));
    } catch (err) {
      addLog(agentKey, `Failed: ${err.message}`);
      setAgentStates((prev) => ({ ...prev, [agentKey]: "error" }));
    } finally {
      setActiveAgentId(null);
    }
  };

  // ----------------------------------------------------
  // Task Actions
  // ----------------------------------------------------
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(taskId, { status: newStatus });
      if (selectedProject) {
        const prog = await runAgent6_GetProgress(selectedProject._id);
        setProgressData(prog);
      }
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  const handleSaveTask = async (taskPayload) => {
    try {
      if (editingTask) {
        // Update existing
        const updated = await updateTask(editingTask._id, taskPayload);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? { ...t, ...taskPayload } : t))
        );
        addLog("Task Manager", `Updated story: "${taskPayload.title}"`);
      } else {
        // Create new
        const created = await createTask({
          ...taskPayload,
          projectId: selectedProject._id,
        });
        setTasks((prev) => [...prev, created]);
        addLog("Task Manager", `Created new story: "${taskPayload.title}"`);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Save task error:", err);
      alert("Failed to save task: " + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setIsTaskModalOpen(false);
      setEditingTask(null);
      addLog("Task Manager", "Story deleted.");
    } catch (err) {
      alert("Failed to delete task: " + err.message);
    }
  };

  // ----------------------------------------------------
  // Project Ingestion Handlers
  // ----------------------------------------------------
  const handleUploadFile = async (file, projName, autoRun) => {
    setIsSubmittingPRD(true);
    try {
      const data = await uploadDocument(file, projName);
      const newProj = data.project;
      setProjects((prev) => [newProj, ...prev]);
      await selectProject(newProj);
      setIsUploadOpen(false);
      addLog("Upload", `Document "${file.name}" ingested into project "${projName}".`);

      if (autoRun) {
        setTimeout(() => handleRunPipeline(), 300);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document: " + err.message);
    } finally {
      setIsSubmittingPRD(false);
    }
  };

  const handleCreateProjectFromText = async (name, text, autoRun) => {
    setIsSubmittingPRD(true);
    try {
      const data = await createProject({ name, rawText: text });
      const newProj = data.project;
      setProjects((prev) => [newProj, ...prev]);
      await selectProject(newProj);
      setIsUploadOpen(false);
      addLog("Project", `Created project "${name}" with specification.`);

      if (autoRun) {
        setTimeout(() => handleRunPipeline(), 300);
      }
    } catch (err) {
      console.error("Create project error:", err);
      alert("Failed to create project: " + err.message);
    } finally {
      setIsSubmittingPRD(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      const updatedList = projects.filter((p) => p._id !== projectId);
      setProjects(updatedList);
      if (selectedProject?._id === projectId) {
        if (updatedList.length > 0) {
          selectProject(updatedList[0]);
        } else {
          setSelectedProject(null);
          setTasks([]);
          setSprints([]);
          setRisks([]);
          setProgressData(null);
        }
      }
      addLog("Project", "Project deleted.");
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={selectProject}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenTemplates={() => setIsUploadOpen(true)}
        onDeleteProject={handleDeleteProject}
        isBackendOnline={isBackendOnline}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Project Context Hero Banner */}
        {selectedProject ? (
          <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1424]/90 to-slate-900/90 border border-slate-800 p-5 shadow-lg overflow-hidden backdrop-blur-xl">
            <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Active Sprint Workspace
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedProject._id?.slice(-6)}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {selectedProject.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-1">
                  {selectedProject.rawText
                    ? selectedProject.rawText.slice(0, 160) + "..."
                    : "Product requirement document ingested. Ready for autonomous agent orchestration."}
                </p>
              </div>

              {/* Quick stats pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-slate-850/80 border border-slate-750 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Stories
                  </span>
                  <span className="text-sm font-bold text-white">
                    {tasks.length}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-850/80 border border-slate-750 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Sprints
                  </span>
                  <span className="text-sm font-bold text-indigo-300">
                    {sprints.length || 2}
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-850/80 border border-slate-750 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Completed
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {tasks.filter((t) => t.status === "Completed").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-dashed border-slate-800">
            <FolderGit2 className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">No Project Selected</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Upload a requirement document or load a demo PRD template to get started.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md cursor-pointer"
            >
              Upload PRD Document
            </button>
          </div>
        )}

        {/* The Crown Jewel: Autonomous Multi-Agent Stepper */}
        <AgentPipeline
          project={selectedProject}
          agentStates={agentStates}
          activeAgentId={activeAgentId}
          isPipelineRunning={isPipelineRunning}
          onRunPipeline={handleRunPipeline}
          onRunAgent={handleRunAgent}
          logs={logs}
        />

        {/* View Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "kanban"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Sprint Kanban Board</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300">
                {tasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("roadmap")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Sprint Roadmap</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300">
                {sprints.length || 2} Sprints
              </span>
            </button>

            <button
              onClick={() => setActiveTab("risks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "risks"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>AI Risk Matrix</span>
              {risks.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300">
                  {risks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("insights")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "insights"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Agile Coach & Progress</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
                Live
              </span>
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        <div className="pt-2">
          {activeTab === "kanban" && (
            <KanbanBoard
              tasks={tasks}
              sprints={sprints}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onOpenTaskModal={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onAddNewTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === "roadmap" && (
            <SprintRoadmap
              tasks={tasks}
              sprints={sprints}
              onOpenTaskModal={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activeTab === "risks" && (
            <RiskAnalysisView
              risks={risks}
              isRunning={agentStates.risk === "running"}
              onRerunAgent={() => handleRunAgent("risk")}
            />
          )}

          {activeTab === "insights" && (
            <ProgressDashboard
              progressData={progressData}
              totalTasks={tasks.length}
              isRunning={agentStates.coach === "running"}
              onRefreshProgress={() => handleRunAgent("coach")}
            />
          )}
        </div>
      </main>

      {/* Upload / PRD Ingestion Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmitFile={handleUploadFile}
        onSubmitText={handleCreateProjectFromText}
        isSubmitting={isSubmittingPRD}
      />

      {/* Task Inspection & Editing Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-850 py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SprintGenius AI © 2026 • Powered by IBM Bob 2.0 Multi-Agent Framework
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>6 Autonomous Agents</span>
            <span>•</span>
            <span>Zero-Config Agile Execution</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
