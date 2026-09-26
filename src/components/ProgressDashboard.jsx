import React, { useState } from "react";
import {
  Bot,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  RotateCw,
  Sparkles,
  Share2,
} from "lucide-react";

export default function ProgressDashboard({
  progressData,
  totalTasks,
  isRunning,
  onRefreshProgress,
}) {
  const [copied, setCopied] = useState(false);

  const percentages = progressData?.percentages || {
    completed: 0,
    inProgress: 0,
    pending: 100,
  };

  const summary =
    progressData?.summary ||
    "Sprint backlog is initialized. Kick off development on foundational stories to start generating velocity metrics.";

  const handleCopy = () => {
    const textToCopy = `*SprintGenius AI — Sprint Status Report*\nProgress: ${percentages.completed}% Completed | ${percentages.inProgress}% In Progress | ${percentages.pending}% Pending\n\n*Executive Briefing:*\n${summary}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#0d1322]/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Agent 6: Agile Coach & Executive Progress Intelligence
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuously synthesizes task progress, sprint health, and produces real-time stakeholder updates.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshProgress}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isRunning ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          ) : (
            <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>Recalculate Velocity</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Completed */}
        <div className="bg-[#0b101e] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed
            </span>
            <span className="font-semibold text-emerald-400">{percentages.completed}%</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round((percentages.completed / 100) * totalTasks) || 0}
            <span className="text-xs font-normal text-slate-500 ml-1.5">/ {totalTasks} stories</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentages.completed}%` }}
            />
          </div>
        </div>

        {/* Metric 2: In Progress */}
        <div className="bg-[#0b101e] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> In Progress
            </span>
            <span className="font-semibold text-amber-400">{percentages.inProgress}%</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round((percentages.inProgress / 100) * totalTasks) || 0}
            <span className="text-xs font-normal text-slate-500 ml-1.5">in flight</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentages.inProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Pending */}
        <div className="bg-[#0b101e] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Backlog / Pending
            </span>
            <span className="font-semibold text-slate-400">{percentages.pending}%</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Math.round((percentages.pending / 100) * totalTasks) || 0}
            <span className="text-xs font-normal text-slate-500 ml-1.5">queued</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-slate-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentages.pending}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Sprint Velocity Score */}
        <div className="bg-[#0b101e] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Velocity Index
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Optimal
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {percentages.completed > 60 ? "A+" : percentages.completed > 30 ? "A" : "B+"}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Estimated on-time delivery confidence
            </p>
          </div>
        </div>
      </div>

      {/* AI Agile Coach Natural Language Summary Card */}
      <div className="relative rounded-xl bg-gradient-to-r from-indigo-950/40 via-[#0d152a] to-emerald-950/20 border border-indigo-500/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Executive AI Standup Briefing
            </h4>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for Standup</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-normal italic">
          "{summary}"
        </p>
      </div>
    </div>
  );
}

