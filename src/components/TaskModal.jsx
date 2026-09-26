import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Save,
  Link2,
  Calendar,
  AlertCircle,
  Clock,
  Layers,
} from "lucide-react";

export default function TaskModal({
  task,
  isOpen,
  onClose,
  onSaveTask,
  onDeleteTask,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Unassigned");
  const [effort, setEffort] = useState("Unassigned");
  const [status, setStatus] = useState("Pending");
  const [sprintNumber, setSprintNumber] = useState("");
  const [dependenciesText, setDependenciesText] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "Unassigned");
      setEffort(task.effort || "Unassigned");
      setStatus(task.status || "Pending");
      setSprintNumber(task.sprintNumber !== null && task.sprintNumber !== undefined ? String(task.sprintNumber) : "");
      setDependenciesText(task.dependencies?.join(", ") || "");
    } else {
      // New task defaults
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setEffort("Medium");
      setStatus("Pending");
      setSprintNumber("1");
      setDependenciesText("");
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dependencies = dependenciesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      priority,
      effort,
      status,
      sprintNumber: sprintNumber ? Number(sprintNumber) : null,
      dependencies,
    };

    onSaveTask(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">
            {task ? "Edit User Story" : "Create New User Story"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Story Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket gateway streaming"
              className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Detailed Scope & Acceptance Criteria
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical specs, expected behaviors, acceptance criteria..."
              className="w-full bg-slate-900 border border-slate-750 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Grid of attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Status */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Effort */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Effort
              </label>
              <select
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Small">Small (1-2d)</option>
                <option value="Medium">Medium (3-5d)</option>
                <option value="Large">Large (1-2w)</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Sprint */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Sprint #
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={sprintNumber}
                onChange={(e) => setSprintNumber(e.target.value)}
                placeholder="None"
                className="w-full bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              Dependencies (Prerequisite Story Titles, comma separated)
            </label>
            <input
              type="text"
              value={dependenciesText}
              onChange={(e) => setDependenciesText(e.target.value)}
              placeholder="e.g. Auth Architecture, Database Schema"
              className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {task ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this story?")) {
                    onDeleteTask(task._id);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Story</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

