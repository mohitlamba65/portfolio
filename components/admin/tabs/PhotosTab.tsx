"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { PortfolioData } from "@/types/portfolio";
import { Upload, Image as ImageIcon, Link as LinkIcon, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface PhotosTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "navbar_photo" | "profile_photo"
  ) => void;
  uploadStatus: Record<string, string>;
}

export default function PhotosTab({
  data,
  onChange,
  onUpload,
  uploadStatus,
}: PhotosTabProps) {
  const profile = data.profile;
  const navInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            MEDIA ASSET ENGINE
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-sans">
            Navbar Avatar & Profile Showcase Studio
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            Separate assets for the floating dynamic island navigation vs the full-size About section showcase.
          </p>
        </div>
      </div>

      {/* Grid of Two Distinct Photo Studios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= 1. NAVBAR AVATAR STUDIO ================= */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)]">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)] font-sans">
                    Floating Island Navbar Avatar
                  </h3>
                  <p className="text-xs text-[var(--text-dim)] font-mono">
                    Distinct photo for the dynamic island logo
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 uppercase">
                34×34px Round
              </span>
            </div>

            {/* LIVE MOCK OF FLOATING ISLAND WITH AVATAR */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[var(--text-dim)] block">
                Live Navbar Mockup Preview
              </span>
              <div className="p-4 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] flex items-center justify-center">
                {/* Mock island nav capsule */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--line)] shadow-xl">
                  {/* Avatar circle */}
                  <div className="w-[34px] height-[34px] h-[34px] rounded-full overflow-hidden bg-[var(--bg-panel)] border border-[var(--cyan)]/50 relative flex items-center justify-center flex-shrink-0">
                    {profile.navbarAvatarUrl &&
                    profile.navbarAvatarUrl !== "/default-avatar.svg" ? (
                      <Image
                        src={profile.navbarAvatarUrl}
                        alt="Navbar Avatar"
                        fill
                        sizes="34px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--cyan)] font-bold">
                        ML
                      </span>
                    )}
                  </div>
                  {/* Mock tabs */}
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[var(--text-dim)]">
                    <span className="px-2.5 py-1 rounded-full bg-[var(--cyan)] text-[#04120F] font-bold">
                      Home
                    </span>
                    <span className="px-2 py-1">About</span>
                    <span className="px-2 py-1">Stack</span>
                    <span className="px-2 py-1">Work</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div>
              <input
                ref={navInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e, "navbar_photo")}
              />
              <button
                type="button"
                onClick={() => navInputRef.current?.click()}
                className="w-full p-5 rounded-xl border-2 border-dashed border-[var(--line)] hover:border-[var(--cyan)] bg-[var(--bg-panel-2)]/60 hover:bg-[var(--bg-panel-2)] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--text)]">
                  Click to Upload New Navbar Avatar
                </span>
                <span className="text-[11px] font-mono text-[var(--text-dim)]">
                  PNG, JPG, WebP, SVG (Recommended: 128×128 square)
                </span>
              </button>
            </div>

            {/* Upload Status Alert */}
            {uploadStatus.navbar_photo && (
              <div
                className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  uploadStatus.navbar_photo.includes("success") ||
                  uploadStatus.navbar_photo.includes("Uploaded")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : uploadStatus.navbar_photo.includes("failed")
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    : "bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 animate-pulse"
                }`}
              >
                <RefreshCw size={14} className={uploadStatus.navbar_photo.includes("...") ? "animate-spin" : ""} />
                <span>{uploadStatus.navbar_photo}</span>
              </div>
            )}

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <LinkIcon size={12} /> Direct Image URL Override
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.navbarAvatarUrl || ""}
                  onChange={(e) => updateProfile({ navbarAvatarUrl: e.target.value })}
                  placeholder="/uploads/avatar-nav.png or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-xs font-mono focus:outline-none focus:border-[var(--cyan)]"
                />
                <button
                  type="button"
                  onClick={() => updateProfile({ navbarAvatarUrl: "/default-avatar.svg" })}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] hover:bg-[var(--bg-elevated)] border border-[var(--line)] text-xs font-mono text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer"
                  title="Reset to Initials"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] text-[11px] font-mono text-[var(--text-dim)] flex items-center justify-between">
            <span>Status: {profile.navbarAvatarUrl ? "Custom Avatar Configured" : "Default Initials (ML)"}</span>
            <span className="text-[var(--cyan)]">Module Active</span>
          </div>
        </div>

        {/* ================= 2. PROFILE SHOWCASE PHOTO STUDIO ================= */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--violet)]/10 border border-[var(--violet)]/20 flex items-center justify-center text-[var(--violet)]">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text)] font-sans">
                    About Section Showcase Photo
                  </h3>
                  <p className="text-xs text-[var(--text-dim)] font-mono">
                    High-resolution portrait shown in About story
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--violet)]/10 text-[var(--violet)] border border-[var(--violet)]/30 uppercase">
                Showcase Card
              </span>
            </div>

            {/* LIVE MOCK OF ABOUT SHOWCASE CARD */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[var(--text-dim)] block">
                Live About Section Mockup
              </span>
              <div className="p-4 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] flex items-center justify-center">
                <div className="w-40 h-48 rounded-2xl overflow-hidden bg-[var(--bg-elevated)] border-2 border-[var(--cyan)]/30 shadow-2xl relative flex items-center justify-center group">
                  {profile.profilePhotoUrl ? (
                    <Image
                      src={profile.profilePhotoUrl}
                      alt="Profile Showcase"
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center p-3">
                      <ImageIcon size={28} className="text-[var(--text-faint)]" />
                      <span className="text-[11px] font-mono text-[var(--text-dim)]">
                        No Photo Selected
                      </span>
                    </div>
                  )}
                  {/* Subtle corner badge */}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-[var(--bg)]/80 backdrop-blur-md text-[10px] font-mono text-[var(--cyan)] text-center border border-[var(--line)]">
                    {profile.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Dropzone */}
            <div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e, "profile_photo")}
              />
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                className="w-full p-5 rounded-xl border-2 border-dashed border-[var(--line)] hover:border-[var(--violet)] bg-[var(--bg-panel-2)]/60 hover:bg-[var(--bg-panel-2)] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--violet)]/10 text-[var(--violet)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-mono font-medium text-[var(--text)]">
                  Click to Upload New Showcase Portrait
                </span>
                <span className="text-[11px] font-mono text-[var(--text-dim)]">
                  PNG, JPG, WebP (Recommended: Portrait 400×500px or larger)
                </span>
              </button>
            </div>

            {/* Upload Status Alert */}
            {uploadStatus.profile_photo && (
              <div
                className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  uploadStatus.profile_photo.includes("success") ||
                  uploadStatus.profile_photo.includes("Uploaded")
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : uploadStatus.profile_photo.includes("failed")
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    : "bg-[var(--violet)]/10 text-[var(--violet)] border border-[var(--violet)]/30 animate-pulse"
                }`}
              >
                <RefreshCw size={14} className={uploadStatus.profile_photo.includes("...") ? "animate-spin" : ""} />
                <span>{uploadStatus.profile_photo}</span>
              </div>
            )}

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <LinkIcon size={12} /> Direct Image URL Override
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.profilePhotoUrl || ""}
                  onChange={(e) => updateProfile({ profilePhotoUrl: e.target.value })}
                  placeholder="/uploads/avatar-profile.png or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-xs font-mono focus:outline-none focus:border-[var(--violet)]"
                />
                <button
                  type="button"
                  onClick={() => updateProfile({ profilePhotoUrl: "" })}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] hover:bg-[var(--bg-elevated)] border border-[var(--line)] text-xs font-mono text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer"
                  title="Clear photo"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] text-[11px] font-mono text-[var(--text-dim)] flex items-center justify-between">
            <span>Status: {profile.profilePhotoUrl ? "Showcase Photo Configured" : "Placeholder Active"}</span>
            <span className="text-[var(--violet)]">Module Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
