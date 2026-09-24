"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import { FileText, Upload, ExternalLink, Download, Loader2 } from "lucide-react";
import {
  AdminField,
  AdminFormSurface,
  AdminInput,
  AdminUploadStatus,
} from "../admin-ui";

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
  const status = uploadStatus.resume;
  const isUploading = status?.includes("Uploading");
  const hasResume = Boolean(profile.resumeUrl);

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  return (
    <div className="pb-8 max-w-2xl">
      <AdminFormSurface>
        <div className="mb-5 pb-4 border-b admin-border">
          <h3 className="text-base font-semibold">Resume PDF</h3>
          <p className="admin-hint mt-0.5">
            Used for download links across your portfolio. Upload a PDF or set a URL.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-lg border admin-border bg-[var(--bg-panel-2)] mb-5">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 admin-icon-box !w-11 !h-11">
            <FileText size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">
              {profile.name || "Your name"} — Resume.pdf
            </div>
            <p className="admin-hint truncate !mt-0.5">
              {hasResume ? profile.resumeUrl : "No resume configured"}
            </p>
          </div>
          {hasResume ? (
            <div className="flex gap-2 shrink-0">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="admin-btn-secondary !py-1.5"
              >
                <ExternalLink size={14} />
              </a>
              <a href={profile.resumeUrl} download className="admin-btn-accent-soft !py-1.5">
                <Download size={14} />
              </a>
            </div>
          ) : null}
        </div>

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
          disabled={isUploading}
          className="admin-upload-zone w-full mb-4 disabled:opacity-50"
        >
          {isUploading ? (
            <span className="inline-flex items-center gap-2 text-sm admin-muted">
              <Loader2 size={18} className="animate-spin admin-accent" />
              Uploading PDF...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm">
              <Upload size={18} className="admin-accent" />
              Click to upload PDF (max ~10MB)
            </span>
          )}
        </button>

        {status ? <AdminUploadStatus message={status} /> : null}

        <AdminField label="Resume URL" hint="Or paste a path / hosted link" className="mt-4">
          <AdminInput
            value={profile.resumeUrl || ""}
            onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
            placeholder="/resume.pdf"
            mono
          />
        </AdminField>
      </AdminFormSurface>
    </div>
  );
}
