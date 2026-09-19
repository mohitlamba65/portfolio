"use client";

import React, { useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react";

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
    <div className="space-y-6 pb-12">
      {/* Informational Guidance Banner */}
      <div className="glass-card rounded-xl p-5 border border-white/10 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#35E7C7]/15 border border-[#35E7C7]/30 text-[#35E7C7] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Dual-Asset Media Architecture</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Your portfolio supports two independent photo assets: a compact circular logo avatar for the floating dynamic island navigation, and a high-resolution portrait photograph showcased inside the About bio section.
          </p>
        </div>
      </div>

      {/* Grid: Navbar Avatar & About Profile Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= 1. FLOATING NAVBAR AVATAR ================= */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#35E7C7]" />
                  Floating Island Navbar Avatar
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Small circular avatar displayed in the top floating navigation island.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                1:1 Aspect Ratio
              </span>
            </div>

            {/* Current Preview */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 border border-dashed border-white/10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#35E7C7]/50 shadow-lg shadow-[#35E7C7]/10 bg-black/40 flex items-center justify-center">
                  {profile.navbarAvatarUrl ? (
                    <img
                      src={profile.navbarAvatarUrl}
                      alt="Navbar Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-mono font-bold text-[#35E7C7]">
                      ML
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3 font-mono">
                {profile.navbarAvatarUrl || "Using default monogram 'ML'"}
              </p>
            </div>

            {/* Upload Box */}
            <div className="space-y-3">
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
                disabled={Boolean(uploadStatus.navbar_photo?.includes("Uploading"))}
                className="w-full py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploadStatus.navbar_photo?.includes("Uploading") ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#35E7C7]" />
                    <span>Uploading Avatar...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} className="text-[#35E7C7]" />
                    <span>Upload New Navbar Avatar</span>
                  </>
                )}
              </button>

              {uploadStatus.navbar_photo && (
                <div
                  className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                    uploadStatus.navbar_photo.includes("success")
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-[#35E7C7]/10 text-[#35E7C7] border border-[#35E7C7]/20"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>{uploadStatus.navbar_photo}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <LinkIcon size={12} className="text-zinc-500" />
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={profile.navbarAvatarUrl || ""}
                  onChange={(e) => updateProfile({ navbarAvatarUrl: e.target.value })}
                  placeholder="/uploads/... or https://..."
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-3 border-t border-white/10 flex items-center justify-between">
            <span>Recommended: 64×64px or 128×128px PNG/WEBP</span>
            {profile.navbarAvatarUrl && (
              <a
                href={profile.navbarAvatarUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#35E7C7] hover:underline flex items-center gap-1"
              >
                View Asset <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        {/* ================= 2. ABOUT SECTION SHOWCASE PHOTO ================= */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#35E7C7]" />
                  About Bio Section Showcase Photo
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  High-res portrait or desk photograph displayed in the About section.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                Square or Portrait
              </span>
            </div>

            {/* Current Preview */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-black/30 border border-dashed border-white/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#35E7C7]/50 shadow-xl shadow-[#35E7C7]/15 bg-black/40 flex items-center justify-center">
                  {profile.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      alt="About Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-zinc-600">
                      <ImageIcon size={32} />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3 font-mono">
                {profile.profilePhotoUrl || "No profile photo uploaded yet"}
              </p>
            </div>

            {/* Upload Box */}
            <div className="space-y-3">
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
                disabled={Boolean(uploadStatus.profile_photo?.includes("Uploading"))}
                className="w-full py-3 px-4 rounded-lg bg-[#35E7C7]/15 hover:bg-[#35E7C7]/25 border border-[#35E7C7]/30 text-sm font-semibold text-[#35E7C7] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploadStatus.profile_photo?.includes("Uploading") ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#35E7C7]" />
                    <span>Uploading Photo...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload About Showcase Photo</span>
                  </>
                )}
              </button>

              {uploadStatus.profile_photo && (
                <div
                  className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                    uploadStatus.profile_photo.includes("success")
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-[#35E7C7]/10 text-[#35E7C7] border border-[#35E7C7]/20"
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>{uploadStatus.profile_photo}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <LinkIcon size={12} className="text-zinc-500" />
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={profile.profilePhotoUrl || ""}
                  onChange={(e) => updateProfile({ profilePhotoUrl: e.target.value })}
                  placeholder="/uploads/... or https://..."
                  className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-3 border-t border-white/10 flex items-center justify-between">
            <span>Recommended: 500×500px or larger JPG/PNG/WEBP</span>
            {profile.profilePhotoUrl && (
              <a
                href={profile.profilePhotoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#35E7C7] hover:underline flex items-center gap-1"
              >
                View Asset <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
