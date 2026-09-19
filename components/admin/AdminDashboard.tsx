"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  PortfolioData,
  WorkExperience,
  Project,
  Skill,
  SkillCategory,
} from "@/types/portfolio";
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
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  AlertCircle,
  Eye,
} from "lucide-react";

interface AdminDashboardProps {
  initialData: PortfolioData;
}

export default function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<
    "profile" | "photos" | "resume" | "experience" | "projects" | "skills" | "stats"
  >("profile");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<Record<string, string>>({});

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

  const handleSaveAll = async () => {
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

      setSaveMessage("Portfolio updated successfully!");
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setSaveMessage(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      setSaveMessage(`Error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all portfolio content to default?"
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

      const result = await res.json();
      if (result.success && result.url) {
        if (target === "navbar_photo") {
          setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, navbarAvatarUrl: result.url },
          }));
        } else if (target === "profile_photo") {
          setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, profilePhotoUrl: result.url },
          }));
        } else if (target === "resume") {
          setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, resumeUrl: result.url },
          }));
        }
        setUploadStatus((prev) => ({ ...prev, [target]: "Uploaded successfully!" }));
        confetti({ particleCount: 30, spread: 45 });
      } else {
        setUploadStatus((prev) => ({ ...prev, [target]: "Upload failed" }));
      }
    } catch (err) {
      console.error(err);
      setUploadStatus((prev) => ({ ...prev, [target]: "Upload failed" }));
    } finally {
      setTimeout(() => {
        setUploadStatus((prev) => ({ ...prev, [target]: "" }));
      }, 3500);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white font-mono">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-teal-400">
            <Lock size={24} />
            <h1 className="text-xl font-bold">Admin Portal Authorization</h1>
          </div>
          <p className="text-xs text-slate-400">
            Enter admin passcode to configure and update your portfolio without editing code. (Default: <code className="text-teal-300">admin123</code>)
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            {authError && (
              <div className="flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle size={14} />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold tracking-wide transition-all shadow-lg shadow-teal-500/20"
            >
              Unlock Control Center
            </button>
            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">
                ← Return to Public Portfolio
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>View Live Site</span>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Portfolio Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs font-mono text-teal-400 animate-pulse">
              {saveMessage}
            </span>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono transition-all"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-teal-500/20"
          >
            <Save size={15} />
            <span>{saving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {[
            { id: "profile", label: "General Profile", icon: User },
            { id: "photos", label: "Navbar & Profile Photos", icon: ImageIcon },
            { id: "resume", label: "Resume PDF", icon: FileText },
            { id: "experience", label: "Work Experience", icon: Briefcase },
            { id: "projects", label: "Projects & Systems", icon: FolderGit2 },
            { id: "skills", label: "Skills Constellation", icon: Cpu },
            { id: "stats", label: "Impact & Scale Stats", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  active
                    ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {/* ================= PROFILE TAB ================= */}
        {activeTab === "profile" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white">General Profile & Story</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.profile.name}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Role Title (e.g. &quot;ENGINEER / BUILDER&quot;)
                </label>
                <input
                  type="text"
                  value={data.profile.roleTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, roleTitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data.profile.subTitle}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, subTitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Location &amp; Availability
                </label>
                <input
                  type="text"
                  value={data.profile.location}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, location: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Main Hero Headline (SEO / metadata)
              </label>
              <textarea
                rows={2}
                value={data.profile.headline || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, headline: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Home Page Tagline (Hero Tag paragraph)
              </label>
              <textarea
                rows={3}
                value={data.profile.heroTag || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, heroTag: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                placeholder="I build the parts of a product most people never see..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Availability Badge (eyebrow on Home page)
              </label>
              <input
                type="text"
                value={data.profile.availabilityBadge || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, availabilityBadge: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                placeholder="AVAILABLE FOR BACKEND · AI ENGINEERING ROLES"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Availability Status Message
              </label>
              <input
                type="text"
                value={data.profile.availabilityStatus || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    profile: { ...data.profile, availabilityStatus: e.target.value },
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>


            {/* Bio Paragraphs */}
            <div className="space-y-3">
              <label className="block text-xs font-mono uppercase text-slate-400">
                Bio Paragraphs
              </label>
              {data.profile.bioParagraphs.map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => {
                      const updated = [...data.profile.bioParagraphs];
                      updated[i] = e.target.value;
                      setData({
                        ...data,
                        profile: { ...data.profile, bioParagraphs: updated },
                      });
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-teal-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = data.profile.bioParagraphs.filter(
                        (_, idx) => idx !== i
                      );
                      setData({
                        ...data,
                        profile: { ...data.profile, bioParagraphs: updated },
                      });
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl"
                    title="Delete paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    profile: {
                      ...data.profile,
                      bioParagraphs: [...data.profile.bioParagraphs, ""],
                    },
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-mono"
              >
                <Plus size={14} />
                <span>Add Bio Paragraph</span>
              </button>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-mono text-teal-400 uppercase">
                Social &amp; Contact Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.profile.socialLinks.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socialLinks: {
                            ...data.profile.socialLinks,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={data.profile.socialLinks.github}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socialLinks: {
                            ...data.profile.socialLinks,
                            github: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={data.profile.socialLinks.linkedin}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socialLinks: {
                            ...data.profile.socialLinks,
                            linkedin: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PHOTOS TAB ================= */}
        {activeTab === "photos" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white">
                Photos &amp; Visual Assets
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload different photos for the sidebar navbar avatar vs. the featured profile showcase card.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Target 1: Navbar / Sidebar Compact Avatar */}
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-400 font-bold font-mono text-sm">
                    <User size={18} />
                    <span>Navbar / Sidebar Avatar</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400">
                    Compact Icon
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  This photo is shown in the left vertical navbar as the circular brand icon.
                </p>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-400 p-0.5 shadow-xl bg-slate-950 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.profile.navbarAvatarUrl || "/default-avatar.svg"}
                      alt="Navbar Avatar Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer transition-all">
                      <Upload size={14} />
                      <span>Upload Navbar Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "navbar_photo")}
                        className="hidden"
                      />
                    </label>
                    <div className="text-[11px] font-mono text-slate-400 break-all">
                      Current: {data.profile.navbarAvatarUrl}
                    </div>
                    {uploadStatus["navbar_photo"] && (
                      <div className="text-xs font-mono text-teal-400 font-semibold">
                        {uploadStatus["navbar_photo"]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Target 2: Profile Showcase Photo */}
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-sm">
                    <ImageIcon size={18} />
                    <span>Profile Showcase Photo</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                    Hero Card Photo
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  This photo is featured on the main About page inside the &quot;ENGINEER / BUILDER&quot; highlight card.
                </p>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-slate-950 flex-shrink-0 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={data.profile.profilePhotoUrl || "/default-avatar.svg"}
                      alt="Profile Photo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-all">
                      <Upload size={14} />
                      <span>Upload Profile Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "profile_photo")}
                        className="hidden"
                      />
                    </label>
                    <div className="text-[11px] font-mono text-slate-400 break-all">
                      Current: {data.profile.profilePhotoUrl}
                    </div>
                    {uploadStatus["profile_photo"] && (
                      <div className="text-xs font-mono text-amber-400 font-semibold">
                        {uploadStatus["profile_photo"]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= RESUME TAB ================= */}
        {activeTab === "resume" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white">Official Resume PDF</h2>
            <p className="text-xs text-slate-400">
              Upload your updated PDF resume. Recruiters across all tabs and the Command Palette can download this directly.
            </p>

            <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
                <FileText size={40} />
              </div>

              <div>
                <div className="text-base font-bold text-white">
                  Current Resume Link
                </div>
                <div className="text-xs font-mono text-teal-400 mt-1">
                  {data.profile.resumeUrl}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-md shadow-teal-500/20">
                  <Upload size={15} />
                  <span>Upload New Resume PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, "resume")}
                    className="hidden"
                  />
                </label>

                <a
                  href={data.profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-mono text-xs transition-all"
                >
                  <Eye size={14} />
                  <span>Preview Resume</span>
                </a>
              </div>

              {uploadStatus["resume"] && (
                <div className="text-xs font-mono text-teal-400 font-bold">
                  {uploadStatus["resume"]}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= EXPERIENCE TAB ================= */}
        {activeTab === "experience" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Work Experience</h2>
                <p className="text-xs text-slate-400">
                  Manage career milestones, high-scale achievements, and architectural highlights.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newExp: WorkExperience = {
                    id: `exp-${Date.now()}`,
                    company: "Company Name",
                    role: "Senior Backend / AI Engineer",
                    period: "2024 — Present",
                    location: "Delhi / Remote",
                    highlightMetric: "Scale Metric",
                    description: "Overview of responsibilities and achievements.",
                    bullets: ["Architected key microservice", "Reduced latency"],
                    techStack: ["Node.js", "TypeScript", "PostgreSQL"],
                  };
                  setData({
                    ...data,
                    experiences: [newExp, ...data.experiences],
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 text-xs font-mono font-bold"
              >
                <Plus size={14} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-teal-400 font-bold">
                      #{idx + 1} - {exp.company}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.experiences.filter(
                          (e) => e.id !== exp.id
                        );
                        setData({ ...data, experiences: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Delete experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].company = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].role = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Period
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].period = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Highlight Metric (e.g. 5M+ users)
                      </label>
                      <input
                        type="text"
                        value={exp.highlightMetric}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].highlightMetric = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Summary Description
                    </label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[idx].description = e.target.value;
                        setData({ ...data, experiences: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                    />
                  </div>

                  {/* Bullet points */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Key Impact Bullets (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(exp.bullets ?? []).join("\n")}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[idx].bullets = e.target.value
                          .split("\n")
                          .filter((b) => b.trim().length > 0);
                        setData({ ...data, experiences: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono"
                    />
                  </div>

                  {/* Tech stack */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(exp.techStack ?? []).join(", ")}
                      onChange={(e) => {
                        const updated = [...data.experiences];
                        updated[idx].techStack = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t.length > 0);
                        setData({ ...data, experiences: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-teal-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PROJECTS TAB ================= */}
        {activeTab === "projects" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Projects &amp; Systems</h2>
                <p className="text-xs text-slate-400">
                  Update your featured systems, architecture notes, and live repository links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newProj: Project = {
                    id: `proj-${Date.now()}`,
                    title: "New Distributed System",
                    tagline: "Short architectural tagline",
                    description: "High-level overview of system design and scale.",
                    metrics: "Sub-50ms p99 · 10k RPS",
                    architectureNotes: "Event-driven microservices architecture",
                    techStack: ["Node.js", "Redis", "Docker"],
                    liveUrl: "https://github.com/mohitlamba65",
                    githubUrl: "https://github.com/mohitlamba65",
                    featured: true,
                  };
                  setData({ ...data, projects: [newProj, ...data.projects] });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 text-xs font-mono font-bold"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {data.projects.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-teal-400 font-bold">
                      #{idx + 1} - {proj.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.projects.filter(
                          (p) => p.id !== proj.id
                        );
                        setData({ ...data, projects: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        System Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].title = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={proj.tagline}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].tagline = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].description = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Performance Metrics (e.g. Sub-80ms routing)
                      </label>
                      <input
                        type="text"
                        value={proj.metrics || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].metrics = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Architecture Notes
                      </label>
                      <input
                        type="text"
                        value={proj.architectureNotes || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].architectureNotes = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={proj.githubUrl || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].githubUrl = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Live System URL
                      </label>
                      <input
                        type="url"
                        value={proj.liveUrl || ""}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].liveUrl = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Tech Stack (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={proj.techStack.join(", ")}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].techStack = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t.length > 0);
                        setData({ ...data, projects: updated });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-teal-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SKILLS TAB ================= */}
        {activeTab === "skills" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Skills &amp; 3D Constellation Nodes
                </h2>
                <p className="text-xs text-slate-400">
                  Each skill renders as a dynamic 3D node on the constellation sphere.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSkill: Skill = {
                    id: `skill-${Date.now()}`,
                    name: "New Technology",
                    category: "backend",
                    level: 8,
                  };
                  setData({ ...data, skills: [...data.skills, newSkill] });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 text-xs font-mono font-bold"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.skills.map((skill, idx) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[idx].name = e.target.value;
                        setData({ ...data, skills: updated });
                      }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-sm font-bold text-white w-2/3"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.skills.filter(
                          (s) => s.id !== skill.id
                        );
                        setData({ ...data, skills: updated });
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs font-mono">
                    <select
                      value={skill.category}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[idx].category = e.target.value as SkillCategory;
                        setData({ ...data, skills: updated });
                      }}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-teal-300"
                    >
                      <option value="backend">backend</option>
                      <option value="ai">ai</option>
                      <option value="data">data</option>
                      <option value="frontend">frontend</option>
                      <option value="infra">infra</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <span>Level:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={skill.level}
                        onChange={(e) => {
                          const updated = [...data.skills];
                          updated[idx].level = parseInt(e.target.value) || 1;
                          setData({ ...data, skills: updated });
                        }}
                        className="w-12 px-1.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-400 text-center"
                      />
                      <span>/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STATS TAB ================= */}
        {activeTab === "stats" && (
          <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-white">
              Dashboard Strip Stats
            </h2>
            <p className="text-xs text-slate-400">
              These 4 numbers appear in the Home page dashboard strip and the About stat panel.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Users on Systems Shipped (e.g. &quot;1M+&quot;)
                </label>
                <input
                  type="text"
                  value={data.stats.usersServed}
                  onChange={(e) =>
                    setData({ ...data, stats: { ...data.stats, usersServed: e.target.value } })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg text-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  GitHub Contributions (e.g. 2770)
                </label>
                <input
                  type="number"
                  value={data.stats.githubContributions || 0}
                  onChange={(e) =>
                    setData({ ...data, stats: { ...data.stats, githubContributions: parseInt(e.target.value) || 0 } })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg text-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Total Commits (e.g. 1500)
                </label>
                <input
                  type="number"
                  value={data.stats.totalCommits || 0}
                  onChange={(e) =>
                    setData({ ...data, stats: { ...data.stats, totalCommits: parseInt(e.target.value) || 0 } })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg text-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Public Repos (e.g. 56)
                </label>
                <input
                  type="number"
                  value={data.stats.publicRepos || 0}
                  onChange={(e) =>
                    setData({ ...data, stats: { ...data.stats, publicRepos: parseInt(e.target.value) || 0 } })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg text-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  B2B Clients on GTM Platform (e.g. 50)
                </label>
                <input
                  type="number"
                  value={data.stats.b2bClients || 0}
                  onChange={(e) =>
                    setData({ ...data, stats: { ...data.stats, b2bClients: parseInt(e.target.value) || 0 } })
                  }
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-lg text-cyan-400"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
