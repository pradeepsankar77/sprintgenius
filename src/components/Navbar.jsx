import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  Plus,
  ChevronDown,
  Activity,
  FolderGit2,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function Navbar({
  projects,
  selectedProject,
  onSelectProject,
  onOpenUpload,
  onDeleteProject,
  isBackendOnline,
  onOpenTemplates,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090e1a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SprintGenius
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 uppercase tracking-wider">
                IBM Bob 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Multi-Agent Agile Copilot
            </p>
          </div>
        </div>

        {/* Center: Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-750 hover:border-slate-600 text-sm font-medium text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span className="max-w-[160px] sm:max-w-[240px] truncate">
              {selectedProject ? selectedProject.name : "Select a Project"}
            </span>
            {selectedProject && (
              <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {selectedProject.taskCount || 0} tasks
              </span>
            )}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-750 shadow-2xl z-30 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                  <span>Projects ({projects.length})</span>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenTemplates();
                    }}
                    className="text-indigo-400 hover:text-indigo-300 normal-case font-normal cursor-pointer text-xs"
                  >
                    Demo PRDs
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto py-1 space-y-1">
                  {projects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No projects yet. Create or upload a PRD to get started!
                    </div>
                  ) : (
                    projects.map((p) => {
                      const isSelected = selectedProject?._id === p._id;
                      return (
                        <div
                          key={p._id}
                          className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30"
                              : "hover:bg-slate-800/80 text-slate-300"
                          }`}
                          onClick={() => {
                            onSelectProject(p);
                            setDropdownOpen(false);
                          }}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-xs font-medium truncate">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              <span>{p.taskCount || 0} tasks</span>
                              <span>•</span>
                              <span className="capitalize">{p.status || "uploaded"}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete project "${p.name}"?`)) {
                                onDeleteProject(p._id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenUpload();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-xs font-medium text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Project / Upload Document
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Actions & Health Status */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Templates */}
          <button
            onClick={onOpenTemplates}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo PRDs</span>
          </button>

          {/* New Project Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer hover:shadow-indigo-500/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload PRD</span>
          </button>

          {/* Backend Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isBackendOnline
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
            title={
              isBackendOnline
                ? "Connected to SprintGenius API (Port 5000)"
                : "Backend offline - using local simulation mode"
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="hidden lg:inline">
              {isBackendOnline ? "API Live" : "Demo Mode"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

