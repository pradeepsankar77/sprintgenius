import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Filter,
  Search,
  Plus,
  Link2,
  Calendar,
  AlertTriangle,
  Flame,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function KanbanBoard({
  tasks,
  sprints,
  onUpdateTaskStatus,
  onOpenTaskModal,
  onAddNewTask,
}) {
  const [selectedSprintFilter, setSelectedSprintFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique sprint numbers
  const sprintNumbers = Array.from(
    new Set(tasks.map((t) => t.sprintNumber).filter(Boolean))
  ).sort((a, b) => a - b);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Sprint filter
    if (selectedSprintFilter !== "all") {
      if (selectedSprintFilter === "backlog") {
        if (task.sprintNumber !== null && task.sprintNumber !== undefined) return false;
      } else {
        if (task.sprintNumber !== Number(selectedSprintFilter)) return false;
      }
    }

    // Priority filter
    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(q);
      const matchesDesc = task.description?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc) return false;
    }

    return true;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "Pending");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "In Progress");
  const completedTasks = filteredTasks.filter((t) => t.status === "Completed");

  const handleStatusShift = (task, newStatus) => {
    if (newStatus === "Completed" && task.status !== "Completed") {
      // Trigger joyous confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#6366f1", "#06b6d4", "#10b981", "#a855f7"],
        });
      } catch {
        // ignore
      }
    }
    onUpdateTaskStatus(task._id, newStatus);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-500/15 border-rose-500/30 text-rose-300";
      case "Medium":
        return "bg-amber-500/15 border-amber-500/30 text-amber-300";
      case "Low":
        return "bg-sky-500/15 border-sky-500/30 text-sky-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  const getEffortStyle = (effort) => {
    switch (effort) {
      case "Small":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
      case "Medium":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-300";
      case "Large":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  const renderCard = (task) => {
    return (
      <div
        key={task._id}
        onClick={() => onOpenTaskModal(task)}
        className="group relative bg-[#0f172a]/90 hover:bg-[#131d35] border border-slate-800/90 hover:border-indigo-500/40 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        {/* Top Badges: Sprint & Priority */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.sprintNumber ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                Sprint {task.sprintNumber}
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-750">
                Backlog
              </span>
            )}

            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority || "Unassigned"}
            </span>

            {task.effort && task.effort !== "Unassigned" && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getEffortStyle(
                  task.effort
                )}`}
              >
                {task.effort}
              </span>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2">
          {task.title}
        </h4>

        {/* Short Description */}
        {task.description && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
            <Link2 className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">
              Blocked by: {task.dependencies.join(", ")}
            </span>
          </div>
        )}

        {/* Card Footer: Quick status switcher */}
        <div
          className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1">
            {task.status !== "Pending" && (
              <button
                onClick={() =>
                  handleStatusShift(
                    task,
                    task.status === "Completed" ? "In Progress" : "Pending"
                  )
                }
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Move Left"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}

            {task.status !== "Completed" && (
              <button
                onClick={() =>
                  handleStatusShift(
                    task,
                    task.status === "Pending" ? "In Progress" : "Completed"
                  )
                }
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Move Right"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {task.status === "Completed" ? (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Done
              </span>
            ) : task.status === "In Progress" ? (
              <button
                onClick={() => handleStatusShift(task, "Completed")}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium transition-colors"
              >
                <Check className="w-2.5 h-2.5" /> Complete
              </button>
            ) : (
              <button
                onClick={() => handleStatusShift(task, "In Progress")}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-medium transition-colors"
              >
                Start
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Kanban Filters & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d1322]/80 border border-slate-800 rounded-xl p-3">
        {/* Sprint Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedSprintFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              selectedSprintFilter === "all"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
            }`}
          >
            All Sprints ({tasks.length})
          </button>

          {sprintNumbers.map((num) => {
            const count = tasks.filter((t) => t.sprintNumber === num).length;
            return (
              <button
                key={num}
                onClick={() => setSelectedSprintFilter(String(num))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedSprintFilter === String(num)
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
                }`}
              >
                Sprint {num} ({count})
              </button>
            );
          })}

          <button
            onClick={() => setSelectedSprintFilter("backlog")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              selectedSprintFilter === "backlog"
                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
            }`}
          >
            Backlog ({tasks.filter((t) => !t.sprintNumber).length})
          </button>
        </div>

        {/* Search & Add Task */}
        <div className="flex items-center gap-2">
          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-750 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-750 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-36 sm:w-48"
            />
          </div>

          {/* Add Task Button */}
          <button
            onClick={onAddNewTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium text-indigo-300 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Story</span>
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Pending */}
        <div className="bg-[#0b101d]/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pending
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {pendingTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {pendingTasks.length === 0 ? (
              <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                No pending tasks
              </div>
            ) : (
              pendingTasks.map(renderCard)
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-[#0b101d]/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                In Progress
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {inProgressTasks.length === 0 ? (
              <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                No tasks in development
              </div>
            ) : (
              inProgressTasks.map(renderCard)
            )}
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="bg-[#0b101d]/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[460px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Completed
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {completedTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {completedTasks.length === 0 ? (
              <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                No completed stories yet
              </div>
            ) : (
              completedTasks.map(renderCard)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

