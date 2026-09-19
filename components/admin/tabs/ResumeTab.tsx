"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import { FileText, Upload, ExternalLink, Link as LinkIcon, CheckCircle2, RefreshCw } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Document Overview Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
              <FileText size={24} />
            </div>
            <div>
              <CardTitle className="text-xl">Curriculum Vitae / Resume PDF</CardTitle>
              <CardDescription className="mt-1">
                The official downloadable document linked in the Hero & About sections
              </CardDescription>
            </div>
          </div>

          {profile.resumeUrl && (
            <Button variant="outline" asChild className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
                Test Current Resume
              </a>
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Current Document Status Pill */}
          <div className="p-4 rounded-xl bg-muted/40 border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                PDF
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium block truncate max-w-[200px] sm:max-w-md">
                  {profile.resumeUrl || "No resume currently configured"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Active download link on live site
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
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
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-10 rounded-2xl border-2 border-dashed border-border hover:border-rose-400 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group"
            >
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <div className="text-center space-y-1.5">
                <span className="text-base font-medium block">
                  Click to Upload New Resume PDF
                </span>
                <span className="text-sm text-muted-foreground block">
                  Directly uploads to /uploads/ and points your live portfolio to it
                </span>
              </div>
            </div>
          </div>

          {/* Upload Status */}
          {uploadStatus.resume && (
            <Alert variant={uploadStatus.resume.includes("failed") ? "destructive" : "default"}
              className={uploadStatus.resume.includes("success") || uploadStatus.resume.includes("Uploaded") ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/10" : "border-primary/50 text-primary bg-primary/10"}>
              <RefreshCw size={16} className={`mr-2 h-4 w-4 ${uploadStatus.resume.includes("...") ? "animate-spin" : ""}`} />
              <AlertDescription>{uploadStatus.resume}</AlertDescription>
            </Alert>
          )}

          {/* Direct Link Override */}
          <div className="space-y-3 pt-2">
            <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
              <LinkIcon size={14} /> Direct Resume URL / Google Drive / Dropbox Link
            </Label>
            <Input
              value={profile.resumeUrl}
              onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
              placeholder="/uploads/resume.pdf or https://..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
