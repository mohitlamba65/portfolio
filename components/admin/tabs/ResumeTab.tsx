"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import { FileText, Upload, ExternalLink, Link as LinkIcon, CheckCircle2, RefreshCw } from "lucide-react";

interface ResumeTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, target: "resume") => void;
  uploadStatus: Record<string, string>;
}

export default function ResumeTab({
  data,
  onChange,
  onUpload,
  uploadStatus,
}: ResumeTabProps) {
  const profile = data.profile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Document Overview Card */}
      <div className="p-8 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--line)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)] font-sans">
                Curriculum Vitae / Resume PDF
              </h2>
              <p className="text-xs text-[var(--text-dim)] font-mono">
                The official downloadable document linked in the Hero & About sections
              </p>
            </div>
          </div>

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--cyan)]/10 hover:bg-[var(--cyan)]/20 text-[var(--cyan)] border border-[var(--cyan)]/30 text-xs font-mono transition-all"
            >
              <ExternalLink size={14} />
              <span>Test Current Resume</span>
            </a>
          )}
        </div>

        {/* Current Document Status Pill */}
        <div className="p-4 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-mono text-xs font-bold">
              PDF
            </div>
            <div>
              <span className="text-xs font-mono text-[var(--text)] block truncate max-w-md">
                {profile.resumeUrl || "No resume currently configured"}
              </span>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Active download link on live site
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <CheckCircle2 size={14} />
            <span>Ready</span>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => onUpload(e, "resume")}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 rounded-2xl border-2 border-dashed border-[var(--line)] hover:border-rose-400 bg-[var(--bg-panel-2)]/60 hover:bg-[var(--bg-panel-2)] transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={22} />
            </div>
            <div className="text-center space-y-1">
              <span className="text-sm font-mono font-medium text-[var(--text)] block">
                Click to Upload New Resume PDF
              </span>
              <span className="text-xs font-mono text-[var(--text-dim)] block">
                Directly uploads to /uploads/ and points your live portfolio to it
              </span>
            </div>
          </button>
        </div>

        {/* Upload Status */}
        {uploadStatus.resume && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
              uploadStatus.resume.includes("success") ||
              uploadStatus.resume.includes("Uploaded")
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : uploadStatus.resume.includes("failed")
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                : "bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 animate-pulse"
            }`}
          >
            <RefreshCw size={14} className={uploadStatus.resume.includes("...") ? "animate-spin" : ""} />
            <span>{uploadStatus.resume}</span>
          </div>
        )}

        {/* Direct Link Override */}
        <div className="pt-2">
          <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
            <LinkIcon size={12} /> Direct Resume URL / Google Drive / Dropbox Link
          </label>
          <input
            type="text"
            value={profile.resumeUrl}
            onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
            placeholder="/uploads/resume.pdf or https://..."
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-xs font-mono focus:outline-none focus:border-[var(--cyan)]"
          />
        </div>
      </div>
    </div>
  );
}
