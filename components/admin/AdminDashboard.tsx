"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { PortfolioData } from "@/types/portfolio";
import {
  User,
  Image as ImageIcon,
  FileText,
  Briefcase,
  FolderGit2,
  Cpu,
  BarChart3,
  Save,
  RotateCcw,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Command,
} from "lucide-react";

import ProfileTab from "./tabs/ProfileTab";
import PhotosTab from "./tabs/PhotosTab";
import ResumeTab from "./tabs/ResumeTab";
import ExperienceTab from "./tabs/ExperienceTab";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import StatsTab from "./tabs/StatsTab";

interface AdminDashboardProps {
  initialData: PortfolioData;
}

type TabType = "profile" | "photos" | "resume" | "experience" | "projects" | "skills" | "stats";

const TABS: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "photos", label: "Photos & Media", icon: ImageIcon },
  { id: "resume", label: "Resume PDF", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "stats", label: "Stats & Scale", icon: BarChart3 },
];

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [initialJson, setInitialJson] = useState<string>(JSON.stringify(initialData));
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  // Has unsaved changes
  const hasUnsavedChanges = JSON.stringify(data) !== initialJson;

  // Check persisted passcode
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-admin-key");
    if (saved) {
      setPasscode(saved);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "admin123" || passcode.trim().length > 0) {
      localStorage.setItem("portfolio-admin-key", passcode.trim());
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Please enter valid admin credentials.");
    }
  };

  const handleSaveAll = useCallback(async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": passcode,
        },
        body: JSON.stringify({
          action: "save_all",
          payload: data,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes.");
      }

      setInitialJson(JSON.stringify(data));
      setSaveMessage("Portfolio synchronized & live!");
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.85 },
        colors: ["#35E7C7", "#FFA645", "#FF7FB0", "#A88BFF"],
      });
      setTimeout(() => setSaveMessage(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      setSaveMessage(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [data, passcode]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (authenticated && !saving) {
          handleSaveAll();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authenticated, saving, handleSaveAll]);

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all portfolio content to default? Unsaved changes will be lost."
      )
    )
      return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": passcode,
        },
        body: JSON.stringify({ action: "reset_defaults" }),
      });
      const json = await res.json();
      if (json.data) {
        setData(json.data);
        setInitialJson(JSON.stringify(json.data));
        setSaveMessage("Reset to defaults complete!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Upload handler for photos & resume
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar_photo" | "profile_photo" | "resume"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus((prev) => ({ ...prev, [target]: "Uploading file..." }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-key": passcode,
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Upload failed");
      }

      setUploadStatus((prev) => ({ ...prev, [target]: "Uploaded successfully!" }));
      setTimeout(() => setUploadStatus((prev) => ({ ...prev, [target]: "" })), 3000);

      // Update in state
      if (target === "navbar_photo") {
        setData((prev) => ({
          ...prev,
          profile: { ...prev.profile, navbarAvatarUrl: json.url },
        }));
      } else if (target === "profile_photo") {
        setData((prev) => ({
          ...prev,
          profile: { ...prev.profile, profilePhotoUrl: json.url },
        }));
      } else if (target === "resume") {
        setData((prev) => ({
          ...prev,
          profile: { ...prev.profile, resumeUrl: json.url },
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      setUploadStatus((prev) => ({ ...prev, [target]: `Upload failed: ${msg}` }));
    }
  };

  // ================= LOGIN SCREEN =================
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow beams */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[var(--cyan)]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-[var(--violet)]/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-2xl relative z-10 space-y-6 backdrop-blur-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 text-[var(--cyan)] flex items-center justify-center mx-auto shadow-lg shadow-[var(--cyan)]/10">
              <Lock size={22} />
            </div>
            <div className="kicker justify-center mb-0 mt-3">
              SECURITY ACCESS // LEVEL 1
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] font-sans">
              Portfolio Control Center
            </h1>
            <p className="text-xs text-[var(--text-dim)] font-mono">
              Provide master admin credentials to manage content & media
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Admin Security Key
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (default: admin123)..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-3.5 text-[var(--text-dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--cyan)] hover:brightness-110 text-[#04120F] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[var(--cyan)]/20 cursor-pointer"
            >
              Authenticate & Unlock
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-mono text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={13} />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-36 pt-24 relative">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[var(--cyan)]/5 blur-[160px] pointer-events-none" />

      {/* TOP FLOATING ISLAND BAR */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-2 rounded-full bg-[var(--bg-panel)]/80 backdrop-blur-xl border border-[var(--line)] shadow-2xl">
          {/* Left: View Live Site */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--bg-panel-2)] text-xs font-mono text-[var(--text-dim)] hover:text-[var(--text)] transition-all border border-[var(--line)]"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Live Site</span>
          </Link>

          {/* Center: Dynamic Island Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 px-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--cyan)] text-[#04120F] font-bold shadow-md shadow-[var(--cyan)]/20"
                      : "text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--bg-panel-2)]"
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={saving}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
              title="Reset all fields to portfolio defaults"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--cyan)] hover:brightness-110 text-[#04120F] font-mono font-bold text-xs transition-all shadow-md shadow-[var(--cyan)]/20 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? "Syncing..." : "Save"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeTab === "profile" && (
          <ProfileTab data={data} onChange={setData} />
        )}

        {activeTab === "photos" && (
          <PhotosTab
            data={data}
            onChange={setData}
            onUpload={handleFileUpload}
            uploadStatus={uploadStatus}
          />
        )}

        {activeTab === "resume" && (
          <ResumeTab
            data={data}
            onChange={setData}
            onUpload={handleFileUpload}
            uploadStatus={uploadStatus}
          />
        )}

        {activeTab === "experience" && (
          <ExperienceTab data={data} onChange={setData} />
        )}

        {activeTab === "projects" && (
          <ProjectsTab data={data} onChange={setData} />
        )}

        {activeTab === "skills" && (
          <SkillsTab data={data} onChange={setData} />
        )}

        {activeTab === "stats" && (
          <StatsTab data={data} onChange={setData} />
        )}
      </main>

      {/* FLOATING BOTTOM ACTION ISLAND */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-xl">
        <div className="p-3 rounded-full bg-[var(--bg-panel)]/90 backdrop-blur-2xl border border-[var(--line)] shadow-2xl flex items-center justify-between gap-4">
          {/* Status badge */}
          <div className="flex items-center gap-3 pl-3 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                hasUnsavedChanges
                  ? "bg-[var(--amber)] animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
            <div className="truncate">
              <span className="text-xs font-mono font-semibold text-[var(--text)] block truncate">
                {saveMessage ||
                  (hasUnsavedChanges
                    ? "Modifications pending commit"
                    : "All systems synchronized")}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-dim)] hidden sm:block">
                Press Ctrl+S / ⌘S to save anytime
              </span>
            </div>
          </div>

          {/* Quick Commit Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-bold transition-all shadow-lg cursor-pointer ${
                hasUnsavedChanges
                  ? "bg-[var(--cyan)] hover:brightness-110 text-[#04120F] shadow-[var(--cyan)]/20 animate-pulse"
                  : "bg-[var(--bg-elevated)] hover:bg-[var(--bg-panel-2)] text-[var(--text)] border border-[var(--line)]"
              }`}
            >
              <Save size={14} />
              <span>{saving ? "Saving..." : "Commit Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
