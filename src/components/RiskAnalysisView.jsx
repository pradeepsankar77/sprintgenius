import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";

export default function RiskAnalysisView({
  risks,
  isRunning,
  onRerunAgent,
}) {
  const getRiskIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes("bottleneck") || t.includes("dependency")) {
      return <Flame className="w-5 h-5 text-rose-400" />;
    }
    if (t.includes("integration") || t.includes("api") || t.includes("security")) {
      return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
    return <ShieldAlert className="w-5 h-5 text-indigo-400" />;
  };

  const getRiskBadge = (type) => {
    const t = type.toLowerCase();
    if (t.includes("bottleneck") || t.includes("blocker")) {
      return (
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          Critical Blocker
        </span>
      );
    }
    if (t.includes("integration") || t.includes("delay")) {
      return (
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          High Impact
        </span>
      );
    }
    return (
      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
        Quality Risk
      </span>
    );
  };

  const getMitigationAdvice = (type, desc) => {
    const t = (type + desc).toLowerCase();
    if (t.includes("dependency") || t.includes("prerequisite")) {
      return "Parallelize foundation tasks or stub out mock contracts to unblock dependent modules early.";
    }
    if (t.includes("integration") || t.includes("third-party") || t.includes("api")) {
      return "Implement strict sandbox integration tests and add circuit-breaker retry patterns with local caching.";
    }
    if (t.includes("test") || t.includes("coverage") || t.includes("security")) {
      return "Shift automated testing left into Sprint 1 and mandate PR approval gates before feature merges.";
    }
    return "Refine user story acceptance criteria and split large epics into 2-3 smaller deliverables.";
  };

  return (
    <div className="w-full bg-[#0d1322]/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Agent 5: AI Risk Matrix & Forensic Inspection
              {risks.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {risks.length} Risks Flagged
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies schedule bottlenecks, dependency collisions, and missing architectural specs before sprint kickoff.
            </p>
          </div>
        </div>

        <button
          onClick={onRerunAgent}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isRunning ? (
            <RotateCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
          ) : (
            <RotateCw className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span>Re-scan Architecture</span>
        </button>
      </div>

      {/* Risk Cards */}
      {risks.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
          <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">
            No risks detected yet.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Run Agent 5 (Risk Detection) or execute the autonomous pipeline to scan your requirements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {risks.map((risk, index) => (
            <div
              key={index}
              className="bg-[#0b101e] border border-slate-800/90 hover:border-rose-500/40 rounded-xl p-4 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(risk.type)}
                    <span className="text-xs font-bold text-slate-200">
                      {risk.type}
                    </span>
                  </div>
                  {getRiskBadge(risk.type)}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {risk.description}
                </p>
              </div>

              {/* Suggested AI Mitigation */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-900/50 -mx-4 -mb-4 p-3 rounded-b-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Suggested AI Mitigation</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {getMitigationAdvice(risk.type, risk.description)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

