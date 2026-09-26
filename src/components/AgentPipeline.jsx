import React, { useState } from "react";
import {
  FileSearch,
  SlidersHorizontal,
  Clock,
  CalendarDays,
  ShieldAlert,
  Bot,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from "lucide-react";

export const AGENT_SPECS = [
  {
    id: 1,
    key: "analyzer",
    title: "Agent 1",
    name: "Requirement Analyzer",
    desc: "Parses PRD & extracts granular tasks with dependencies",
    icon: FileSearch,
    color: "cyan",
    endpoint: "analyze-requirements",
  },
  {
    id: 2,
    key: "classifier",
    title: "Agents 2 & 3",
    name: "Priority & Effort Estimator",
    desc: "Assigns business priority & story effort (S/M/L)",
    icon: SlidersHorizontal,
    color: "indigo",
    endpoint: "classify-tasks",
  },
  {
    id: 3,
    key: "planner",
    title: "Agent 4",
    name: "Sprint Planner",
    desc: "Optimizes tasks into balanced 2-week sprints",
    icon: CalendarDays,
    color: "purple",
    endpoint: "plan-sprints",
  },
  {
    id: 4,
    key: "risk",
    title: "Agent 5",
    name: "Risk Detection Agent",
    desc: "Identifies architectural blockers, gaps & delays",
    icon: ShieldAlert,
    color: "rose",
    endpoint: "detect-risks",
  },
  {
    id: 5,
    key: "coach",
    title: "Agent 6",
    name: "Agile Coach & Progress",
    desc: "Generates burndown metrics & PM executive briefing",
    icon: Bot,
    color: "emerald",
    endpoint: "progress",
  },
];

export default function AgentPipeline({
  project,
  agentStates,
  activeAgentId,
  isPipelineRunning,
  onRunPipeline,
  onRunAgent,
  logs,
}) {
  const [consoleOpen, setConsoleOpen] = useState(false);

  const getStepStatus = (agentId) => {
    return agentStates[agentId] || "idle"; // "idle" | "running" | "completed" | "error"
  };

  return (
    <div className="w-full bg-[#0d1322]/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl">
      {/* Top Bar: Pipeline Title & Global Autonomous Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Autonomous Multi-Agent Orchestration Pipeline
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              6 Agents Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end intelligence: Ingests documents, decomposes user stories, estimates effort, allocates sprints, and assesses delivery risk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Autonomous Run All Button */}
          <button
            onClick={onRunPipeline}
            disabled={!project || isPipelineRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all cursor-pointer ${
              isPipelineRunning
                ? "bg-slate-700 cursor-not-allowed opacity-75"
                : !project
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isPipelineRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Orchestrating Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Run Autonomous Pipeline</span>
              </>
            )}
          </button>

          {/* Toggle Live Console Button */}
          <button
            onClick={() => setConsoleOpen(!consoleOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            title="Toggle Live Telemetry Log Console"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Logs</span>
            {logs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-[10px] text-indigo-300 font-mono">
                {logs.length}
              </span>
            )}
            {consoleOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Agents Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-5">
        {AGENT_SPECS.map((agent, index) => {
          const status = getStepStatus(agent.key);
          const isRunning = status === "running";
          const isCompleted = status === "completed";
          const isError = status === "error";
          const isCurrentActive = activeAgentId === agent.key;

          const colorTheme = {
            cyan: {
              border: "border-cyan-500/30",
              activeBorder: "border-cyan-400 shadow-cyan-500/20",
              bg: "bg-cyan-500/10 text-cyan-400",
              badge: "bg-cyan-500/20 text-cyan-300",
            },
            indigo: {
              border: "border-indigo-500/30",
              activeBorder: "border-indigo-400 shadow-indigo-500/20",
              bg: "bg-indigo-500/10 text-indigo-400",
              badge: "bg-indigo-500/20 text-indigo-300",
            },
            purple: {
              border: "border-purple-500/30",
              activeBorder: "border-purple-400 shadow-purple-500/20",
              bg: "bg-purple-500/10 text-purple-400",
              badge: "bg-purple-500/20 text-purple-300",
            },
            rose: {
              border: "border-rose-500/30",
              activeBorder: "border-rose-400 shadow-rose-500/20",
              bg: "bg-rose-500/10 text-rose-400",
              badge: "bg-rose-500/20 text-rose-300",
            },
            emerald: {
              border: "border-emerald-500/30",
              activeBorder: "border-emerald-400 shadow-emerald-500/20",
              bg: "bg-emerald-500/10 text-emerald-400",
              badge: "bg-emerald-500/20 text-emerald-300",
            },
          }[agent.color];

          const IconComponent = agent.icon;

          return (
            <div
              key={agent.id}
              className={`relative rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                isRunning || isCurrentActive
                  ? `bg-slate-850/90 ${colorTheme.activeBorder} shadow-lg ring-1 ring-white/10`
                  : isCompleted
                  ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  : "bg-slate-900/40 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700"
              }`}
            >
              {/* Step indicator pill */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  {agent.title}
                </span>

                {/* Status Badge */}
                {isRunning ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium">
                    <RotateCw className="w-2.5 h-2.5 animate-spin" />
                    Running
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Ready
                  </span>
                ) : isError ? (
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Failed
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                    Standby
                  </span>
                )}
              </div>

              {/* Agent Title & Description */}
              <div className="flex items-start gap-2.5 my-1">
                <div
                  className={`p-2 rounded-lg shrink-0 ${colorTheme.bg} ${
                    isRunning ? "animate-agent-pulse" : ""
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white leading-tight">
                    {agent.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal line-clamp-2">
                    {agent.desc}
                  </p>
                </div>
              </div>

              {/* Action: Single Agent Run Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Stage {agent.id}/5
                </span>
                <button
                  onClick={() => onRunAgent(agent.key)}
                  disabled={!project || isPipelineRunning}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    !project || isPipelineRunning
                      ? "text-slate-600 cursor-not-allowed"
                      : "text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-750"
                  }`}
                  title={`Run ${agent.name}`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Execute</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Agent Telemetry Console */}
      {consoleOpen && (
        <div className="mt-4 rounded-xl bg-[#060a12] border border-slate-800 p-3 shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-850 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono font-semibold text-slate-300">
                Agent Live Telemetry & Output Stream
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Session Live
            </span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[11px] pr-2">
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">
                Awaiting agent pipeline execution. Run the pipeline or individual agents to inspect live telemetry.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-slate-400 shrink-0">[{log.time}]</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      log.agent.includes("1")
                        ? "text-cyan-400"
                        : log.agent.includes("2")
                        ? "text-indigo-400"
                        : log.agent.includes("4")
                        ? "text-purple-400"
                        : log.agent.includes("5")
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    [{log.agent}]
                  </span>
                  <span className="text-slate-300 break-words">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

