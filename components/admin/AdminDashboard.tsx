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
  TrendingUp,
  Save,
  RotateCcw,
  ExternalLink,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

type TabType =
  | "profile"
  | "experience"
  | "projects"
  | "skills"
  | "stats"
  | "photos"
  | "resume";

interface TabMeta {
  id: TabType;
  label: string;
  category: "content" | "media";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}

const TABS: TabMeta[] = [
  {
    id: "profile",
    label: "Profile & Identity",
    category: "content",
    icon: User,
    title: "Canonical Profile & Bio",
    description: "Manage your name, headline, bio paragraphs, and public social links.",
  },
  {
    id: "experience",
    label: "Career Experience",
    category: "content",
    icon: Briefcase,
    title: "Career & Experience Timeline",
    description: "Manage work history, company milestones, impact highlights, and achievements.",
  },
  {
    id: "projects",
    label: "Featured Projects",
    category: "content",
    icon: FolderGit2,
    title: "Projects & Case Studies",
    description: "Manage featured works, metrics, repository links, tags, and architectures.",
  },
  {
    id: "skills",
    label: "Technical Skills",
    category: "content",
    icon: Cpu,
    title: "Technical Skills & Tech Stack",
    description: "Manage backend systems, AI libraries, cloud infrastructure, and 3D skill spheres.",
  },
  {
    id: "stats",
    label: "Scale & Metrics",
    category: "content",
    icon: TrendingUp,
    title: "Scale, Metrics & Platform Impact",
    description: "Update headline throughput metrics, active user reach, and GitHub stats.",
  },
  {
    id: "photos",
    label: "Photos & Media",
    category: "media",
    icon: ImageIcon,
    title: "Photos & Media Studio",
    description: "Upload and customize distinct images for navbar avatar and about showcase.",
  },
  {
    id: "resume",
    label: "Resume PDF",
    category: "media",
    icon: FileText,
    title: "Resume & Documents",
    description: "Manage and upload your canonical PDF resume for recruiters and visitors.",
  },
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

  // Check dirty state
  const hasUnsavedChanges = JSON.stringify(data) !== initialJson;

  // Retrieve stored admin passcode
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
      setAuthError("Please enter valid admin passcode.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio-admin-key");
    setPasscode("");
    setAuthenticated(false);
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
      setSaveMessage("All changes saved & live!");
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.88 },
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
        "Are you sure you want to reset all portfolio content to default? Any unsaved edits will be discarded."
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
        setSaveMessage("Portfolio reset to defaults successfully!");
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

    setUploadStatus((prev) => ({ ...prev, [target]: "Uploading..." }));

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

  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  // ================= LOGIN SCREEN =================
  if (!authenticated) {
    return (
      <div className="admin-container min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 relative overflow-hidden text-[#E9EEF4]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#35E7C7]/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md p-8 glass-card rounded-2xl border border-white/10 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#35E7C7]/15 border border-[#35E7C7]/30 text-[#35E7C7] flex items-center justify-center mx-auto shadow-lg shadow-[#35E7C7]/15">
              <Lock size={22} />
            </div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#35E7C7] pt-2">
              SECURITY ACCESS // ADMIN
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Portfolio Control Center
            </h1>
            <p className="text-xs text-zinc-400">
              Provide master admin credentials to access and modify portfolio content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (default: admin123)..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle size={15} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#35E7C7] hover:bg-[#35E7C7]/90 text-[#0B0F17] font-semibold text-sm transition-all shadow-[0_0_15px_rgba(53,231,199,0.3)] cursor-pointer"
            >
              Authenticate & Unlock
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs text-zinc-400 hover:text-[#35E7C7] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Return to Public Website</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  const contentTabs = TABS.filter((t) => t.category === "content");
  const mediaTabs = TABS.filter((t) => t.category === "media");

  return (
    <div className="admin-container flex h-screen overflow-hidden bg-[#0B0F17] text-[#E9EEF4] font-sans antialiased">
      {/* ================= LEFT SIDEBAR (JobTracker Style) ================= */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/10 z-20 flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#35E7C7] text-[#0B0F17] flex items-center justify-center font-bold text-base shadow-[0_0_15px_rgba(53,231,199,0.35)]">
              M
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide text-white block leading-tight">
                {data.profile.name || "Mohit Lamba"}
              </span>
              <span className="text-[10px] text-[#35E7C7] font-mono tracking-wider block">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-5">
          {/* Section: Content */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono mb-2">
              Portfolio Content
            </p>
            {contentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left cursor-pointer",
                    isActive
                      ? "bg-[#35E7C7]/15 text-[#35E7C7] border border-[#35E7C7]/30 shadow-sm font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    <Icon size={18} />
                  </span>
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isActive && <ChevronRight size={14} className="text-[#35E7C7]" />}
                </button>
              );
            })}
          </div>

          {/* Section: Media & Documents */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono mb-2">
              Media & Assets
            </p>
            {mediaTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-left cursor-pointer",
                    isActive
                      ? "bg-[#35E7C7]/15 text-[#35E7C7] border border-[#35E7C7]/30 shadow-sm font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">
                    <Icon size={18} />
                  </span>
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isActive && <ChevronRight size={14} className="text-[#35E7C7]" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              View Public Site
            </span>
            <span className="text-[10px] font-mono text-zinc-500">↗</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Lock Admin Panel</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        {/* Header - Glassmorphic sticky top bar */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          {/* Breadcrumb & Section Name */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-[#35E7C7] font-medium capitalize">{activeTab}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              {currentTabInfo.title}
            </h1>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-4">
            {/* Status notification */}
            {saveMessage && (
              <span className="text-xs font-medium text-[#35E7C7] flex items-center gap-1.5 bg-[#35E7C7]/10 px-3 py-1 rounded-full border border-[#35E7C7]/25">
                <CheckCircle2 size={13} />
                {saveMessage}
              </span>
            )}

            {/* Unsaved changes indicator */}
            {hasUnsavedChanges ? (
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Unsaved Changes
              </span>
            ) : (
              <span className="text-xs text-zinc-400 hidden sm:flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Synchronized
              </span>
            )}

            {/* Reset Defaults button */}
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
              title="Reset all content to factory seed defaults"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Primary Save Button */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#35E7C7] text-[#0B0F17] rounded-lg text-sm font-semibold hover:bg-[#35E7C7]/90 transition-all shadow-[0_0_15px_rgba(53,231,199,0.3)] cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Description Banner */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {currentTabInfo.title}
                </h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {currentTabInfo.description}
                </p>
              </div>
            </div>

            {/* Render Tab Component */}
            {activeTab === "profile" && (
              <ProfileTab data={data} onChange={setData} />
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
          </div>
        </main>
      </div>
    </div>
  );
}
