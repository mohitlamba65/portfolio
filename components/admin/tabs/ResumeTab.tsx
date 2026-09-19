"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import {
  FileText,
  Upload,
  ExternalLink,
  Download,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ResumeTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "resume"
  ) => void;
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

  const hasResume = Boolean(profile.resumeUrl);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Information Banner */}
      <div className="glass-card rounded-xl p-5 border border-white/10 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#35E7C7]/15 border border-[#35E7C7]/30 text-[#35E7C7] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Canonical Resume Management</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            This PDF document powers recruiter download actions across your entire site, including the quick header CTA, the command palette resume shortcut, and the footer contact links.
          </p>
        </div>
      </div>

      {/* Main Resume Studio Card */}
      <div className="glass-card rounded-xl p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-[#35E7C7]" />
              Active Resume PDF
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Upload a new PDF to immediately update the live downloadable document.
            </p>
          </div>
          {hasResume && (
            <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live & Active
            </span>
          )}
        </div>

        {/* Current Document Status Card */}
        <div className="p-6 rounded-xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <span>{profile.name || "Mohit Lamba"} — Resume</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                  PDF
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5 break-all">
                {profile.resumeUrl || "No resume currently configured"}
              </p>
            </div>
          </div>

          {hasResume && (
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/10 transition-colors"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
              <a
                href={profile.resumeUrl}
                download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#35E7C7]/15 hover:bg-[#35E7C7]/25 text-xs font-semibold text-[#35E7C7] border border-[#35E7C7]/30 transition-colors"
              >
                <Download size={13} />
                <span>Download</span>
              </a>
            </div>
          )}
        </div>

        {/* Upload Action Area */}
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => onUpload(e, "resume")}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-xl border-2 border-dashed border-white/15 hover:border-[#35E7C7]/50 hover:bg-white/[0.02] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[#35E7C7]/10 text-[#35E7C7] flex items-center justify-center group-hover:scale-110 transition-transform">
              {uploadStatus.resume?.includes("Uploading") ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Upload size={24} />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {uploadStatus.resume?.includes("Uploading")
                  ? "Uploading PDF to storage..."
                  : "Click to browse and upload new Resume PDF"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Standard PDF documents up to 10MB
              </p>
            </div>
          </div>

          {uploadStatus.resume && (
            <div
              className={`text-xs p-3 rounded-lg flex items-center gap-2 ${
                uploadStatus.resume.includes("success")
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#35E7C7]/10 text-[#35E7C7] border border-[#35E7C7]/20"
              }`}
            >
              <CheckCircle2 size={15} />
              <span>{uploadStatus.resume}</span>
            </div>
          )}

          <div className="pt-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <LinkIcon size={12} className="text-zinc-500" />
              Direct File Path or Hosted URL
            </label>
            <input
              type="text"
              value={profile.resumeUrl || ""}
              onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
              placeholder="/resume.pdf or https://..."
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 font-mono transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
