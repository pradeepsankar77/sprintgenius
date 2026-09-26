import React from "react";
import {
  CalendarDays,
  Layers,
  Link2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function SprintRoadmap({ tasks, sprints, onOpenTaskModal }) {
  // Group tasks by sprintNumber
  const sprintMap = {};
  tasks.forEach((task) => {
    const sNum = task.sprintNumber || "Backlog";
    if (!sprintMap[sNum]) sprintMap[sNum] = [];
    sprintMap[sNum].push(task);
  });

  const sprintKeys = Object.keys(sprintMap).sort((a, b) => {
    if (a === "Backlog") return 1;
    if (b === "Backlog") return -1;
    return Number(a) - Number(b);
  });

  return (
    <div className="w-full bg-[#0d1322]/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Sprint Roadmap & Dependency Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured 2-week execution cycles scheduled by Agent 4 respecting prerequisite constraints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500" /> Done
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500" /> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 border border-slate-600" /> Pending
          </span>
        </div>
      </div>

      {/* Sprints Timeline Lanes */}
      <div className="space-y-4">
        {sprintKeys.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No sprints formulated yet. Run Agent 4 (Sprint Planner) to organize your tasks.
          </div>
        ) : (
          sprintKeys.map((sKey) => {
            const sprintTasks = sprintMap[sKey] || [];
            const isBacklog = sKey === "Backlog";
            const completedCount = sprintTasks.filter((t) => t.status === "Completed").length;
            const completionPct = Math.round((completedCount / sprintTasks.length) * 100) || 0;

            return (
              <div
                key={sKey}
                className="bg-[#0b101e] border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                {/* Sprint Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-850">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        isBacklog
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                      }`}
                    >
                      {isBacklog ? "Backlog / Unassigned" : `Sprint ${sKey} (2 Weeks)`}
                    </span>
                    <span className="text-xs text-slate-400">
                      {sprintTasks.length} user {sprintTasks.length === 1 ? "story" : "stories"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 min-w-[36px]">
                      {completionPct}%
                    </span>
                  </div>
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sprintTasks.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => onOpenTaskModal(t)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        t.status === "Completed"
                          ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                          : t.status === "In Progress"
                          ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            t.priority === "High"
                              ? "bg-rose-500/20 text-rose-300"
                              : t.priority === "Medium"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-sky-500/20 text-sky-300"
                          }`}
                        >
                          {t.priority || "Unassigned"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {t.effort || "Medium"}
                        </span>
                      </div>

                      <h4 className="text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
                        {t.title}
                      </h4>

                      {t.dependencies && t.dependencies.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-[10px] text-cyan-400/90 truncate">
                          <Link2 className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{t.dependencies.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

