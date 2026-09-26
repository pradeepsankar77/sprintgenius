import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  FileText,
  Sparkles,
  FileUp,
  CheckCircle2,
  AlertCircle,
  File,
} from "lucide-react";
import { SAMPLE_PRDS } from "../data/sampleProjects";

export default function UploadModal({
  isOpen,
  onClose,
  onSubmitFile,
  onSubmitText,
  isSubmitting,
}) {
  const [activeTab, setActiveTab] = useState("file"); // "file" | "text" | "samples"
  const [projectName, setProjectName] = useState("");
  const [rawText, setRawText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [autoRunPipeline, setAutoRunPipeline] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!projectName) {
        setProjectName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!projectName) {
        setProjectName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSelectSample = (sample) => {
    setProjectName(sample.name);
    setRawText(sample.text);
    setActiveTab("text");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "file") {
      if (!selectedFile) {
        alert("Please choose a file or switch to Paste PRD");
        return;
      }
      onSubmitFile(selectedFile, projectName || selectedFile.name, autoRunPipeline);
    } else {
      if (!projectName.trim() || !rawText.trim()) {
        alert("Please enter project name and requirement text");
        return;
      }
      onSubmitText(projectName.trim(), rawText.trim(), autoRunPipeline);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1322] border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Ingest Product Requirements
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Feed your PRD to SprintGenius to autonomously extract and estimate tasks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "file"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upload File (PDF / DOCX / TXT)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "text"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Paste Markdown / PRD Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("samples")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "samples"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Instant Demo Templates
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          {activeTab !== "samples" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. NextGen Autonomous Voice Platform"
                required
                className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Tab 1: File Dropzone */}
          {activeTab === "file" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Requirement Document
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : selectedFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-slate-750 hover:border-indigo-500/50 bg-slate-900/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center gap-3 text-emerald-400">
                    <File className="w-8 h-8" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Click to swap file
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <FileUp className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-xs font-medium text-slate-300">
                      Drag & drop your requirement document here, or{" "}
                      <span className="text-indigo-400 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports PDF, DOCX, and plain TXT files
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Paste PRD Text */}
          {activeTab === "text" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  PRD / Specification Text
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {rawText.length} characters
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste user stories, technical specs, or feature requirements..."
                rows={7}
                required
                className="w-full bg-slate-900 border border-slate-750 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
              />
            </div>
          )}

          {/* Tab 3: Demo Templates */}
          {activeTab === "samples" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Choose a pre-constructed enterprise PRD to experience the multi-agent pipeline immediately:
              </p>
              <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {SAMPLE_PRDS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {sample.tagline}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-400 group-hover:underline shrink-0">
                      Use Template →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-run pipeline checkbox */}
          {activeTab !== "samples" && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="autoRun"
                checked={autoRunPipeline}
                onChange={(e) => setAutoRunPipeline(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="autoRun" className="text-xs text-slate-300 cursor-pointer select-none">
                Automatically execute 6-agent autonomous pipeline upon ingestion
              </label>
            </div>
          )}

          {/* Footer Submit */}
          {activeTab !== "samples" && (
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Ingesting Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ingest & Initialize</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

