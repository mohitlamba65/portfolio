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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminInput } from "./admin-ui";

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
    title: "Profile & Bio",
    description: "Name, headline, bio paragraphs, and public social links.",
  },
  {
    id: "experience",
    label: "Career Experience",
    category: "content",
    icon: Briefcase,
    title: "Experience Timeline",
    description: "Work history, milestones, impact highlights, and achievements.",
  },
  {
    id: "projects",
    label: "Featured Projects",
    category: "content",
    icon: FolderGit2,
    title: "Projects & Case Studies",
    description: "Featured works, metrics, repository links, tags, and architecture.",
  },
  {
    id: "skills",
    label: "Technical Skills",
    category: "content",
    icon: Cpu,
    title: "Technical Skills",
    description: "Backend, AI, data, frontend, and infrastructure stack tiles.",
  },
  {
    id: "stats",
    label: "Scale & Metrics",
    category: "content",
    icon: TrendingUp,
    title: "Scale & Metrics",
    description: "GitHub stats, user reach, and headline throughput figures.",
  },
  {
    id: "photos",
    label: "Photos & Media",
    category: "media",
    icon: ImageIcon,
    title: "Photos & Media",
    description: "Navbar avatar and about-section portrait uploads.",
  },
  {
    id: "resume",
    label: "Resume PDF",
    category: "media",
    icon: FileText,
    title: "Resume PDF",
    description: "Canonical PDF resume for recruiters and visitors.",
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

  const hasUnsavedChanges = JSON.stringify(data) !== initialJson;

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-admin-key");
    if (saved) {
      setPasscode(saved);
      setAuthenticated(true);
    }
    if (localStorage.getItem("portfolio-admin-sidebar-collapsed") === "1") {
      setSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio-admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

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
        colors: ["#FF8F4D", "#9A82E0", "#C9A24B", "#E5748C"],
      });
      setTimeout(() => setSaveMessage(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      setSaveMessage(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [data, passcode]);

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

  const renderNavItems = (tabs: TabMeta[]) =>
    tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          title={sidebarCollapsed ? tab.label : undefined}
          className={cn("admin-nav-item group", isActive && "active")}
        >
          <Icon size={18} className="shrink-0" />
          <span className="admin-nav-item-label flex-1 truncate text-left">{tab.label}</span>
          {isActive ? (
            <ChevronRight size={14} className="admin-accent shrink-0 admin-nav-item-chevron" />
          ) : null}
        </button>
      );
    });

  if (!authenticated) {
    return (
      <div className="admin-container min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
          style={{ background: "color-mix(in srgb, var(--cyan) 8%, transparent)" }}
        />

        <div className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="admin-icon-box mx-auto w-12 h-12">
              <Lock size={22} />
            </div>
            <div className="admin-kicker pt-2">Security Access // Admin</div>
            <h1 className="text-2xl font-semibold tracking-tight">Portfolio Control Center</h1>
            <p className="admin-hint normal-case tracking-normal">
              Enter your admin passcode to manage portfolio content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="admin-label">Admin Passcode</label>
              <div className="relative">
                <AdminInput
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  mono
                  className="pr-10 py-2.5"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-2.5 admin-faint hover:text-[var(--text)] transition-colors"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError ? (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle size={15} className="shrink-0" />
                <span>{authError}</span>
              </div>
            ) : null}

            <button type="submit" className="admin-btn-primary w-full py-2.5">
              Authenticate & Unlock
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="admin-hint inline-flex items-center gap-1.5 hover:text-[var(--cyan)] transition-colors normal-case"
              >
                <span>Return to public website</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const contentTabs = TABS.filter((t) => t.category === "content");
  const mediaTabs = TABS.filter((t) => t.category === "media");

  return (
    <div className="admin-container flex h-screen overflow-hidden antialiased">
      <aside
        className={cn(
          "admin-sidebar glass border-r admin-border z-20 flex flex-col",
          sidebarCollapsed && "is-collapsed"
        )}
      >
        <div className="h-16 flex items-center justify-between gap-2 px-3 border-b admin-border shrink-0 admin-sidebar-brand">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base admin-btn-primary !p-0 shrink-0"
            style={{ boxShadow: "0 0 16px color-mix(in srgb, var(--cyan) 35%, transparent)" }}
          >
            M
          </div>
          <div className="flex items-center gap-2 min-w-0 flex-1 admin-sidebar-text">
            <div className="min-w-0">
              <span className="font-semibold text-sm tracking-wide block leading-tight truncate">
                {data.profile.name || "Mohit Lamba"}
              </span>
              <span className="admin-kicker text-[10px] block">Admin</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className="admin-btn-secondary !p-2 shrink-0"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          <div className="space-y-1">
            <p className="px-2 admin-kicker mb-2 admin-sidebar-section-title">Content</p>
            {renderNavItems(contentTabs)}
          </div>
          <div className="space-y-1">
            <p className="px-2 admin-kicker mb-2 admin-sidebar-section-title">Media</p>
            {renderNavItems(mediaTabs)}
          </div>
        </nav>

        <div className="p-2 border-t admin-border space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            title="View public site"
            className="admin-btn-secondary w-full admin-sidebar-footer-btn"
          >
            <ExternalLink size={14} className="shrink-0" />
            <span className="admin-sidebar-footer-label">View site</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Lock admin panel"
            className="admin-btn-secondary w-full admin-sidebar-footer-btn hover:!text-red-400 hover:!border-red-500/30 hover:!bg-red-500/10"
          >
            <LogOut size={14} className="shrink-0" />
            <span className="admin-sidebar-footer-label">Lock panel</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="min-h-16 glass border-b admin-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shrink-0 py-3 gap-4">
          <div className="min-w-0 flex items-center gap-3">
            {sidebarCollapsed ? (
              <button
                type="button"
                onClick={toggleSidebar}
                className="admin-btn-secondary !p-2 lg:hidden"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={16} />
              </button>
            ) : null}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs admin-muted font-[family-name:var(--mono)]">
                <span>Admin</span>
                <span>/</span>
                <span className="admin-accent capitalize">{activeTab}</span>
              </div>
              <h1 className="text-base font-semibold tracking-tight leading-tight truncate">
                {currentTabInfo.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {saveMessage ? (
              <span className="admin-badge hidden md:inline-flex">
                <CheckCircle2 size={13} />
                {saveMessage}
              </span>
            ) : null}

            {hasUnsavedChanges ? (
              <span className="admin-status-unsaved hidden sm:inline-flex">
                <span className="w-2 h-2 rounded-full bg-[var(--blue)] animate-pulse" />
                Unsaved
              </span>
            ) : (
              <span className="admin-status-sync hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
                Synced
              </span>
            )}

            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={saving}
              className="admin-btn-secondary"
              title="Reset all content to factory defaults"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={saving}
              className="admin-btn-primary"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === "profile" && <ProfileTab data={data} onChange={setData} />}
            {activeTab === "experience" && <ExperienceTab data={data} onChange={setData} />}
            {activeTab === "projects" && <ProjectsTab data={data} onChange={setData} />}
            {activeTab === "skills" && <SkillsTab data={data} onChange={setData} />}
            {activeTab === "stats" && <StatsTab data={data} onChange={setData} />}
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
