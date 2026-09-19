"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import {
  User,
  Sparkles,
  MapPin,
  Mail,
  Plus,
  Trash2,
  Globe,
  Share2,
  Link2,
  UserCheck,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface ProfileTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ProfileTab({ data, onChange }: ProfileTabProps) {
  const profile = data.profile;

  const updateProfile = (fields: Partial<typeof profile>) => {
    onChange((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...fields },
    }));
  };

  const updateSocial = (fields: Partial<typeof profile.socialLinks>) => {
    onChange((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: { ...prev.profile.socialLinks, ...fields },
      },
    }));
  };

  const handleBioChange = (index: number, text: string) => {
    const next = [...profile.bioParagraphs];
    next[index] = text;
    updateProfile({ bioParagraphs: next });
  };

  const addBioParagraph = () => {
    updateProfile({
      bioParagraphs: [
        ...profile.bioParagraphs,
        "New paragraph describing your technical experience, architecture philosophy, or systems background.",
      ],
    });
  };

  const removeBioParagraph = (index: number) => {
    if (profile.bioParagraphs.length <= 1) return;
    const next = profile.bioParagraphs.filter((_, i) => i !== index);
    updateProfile({ bioParagraphs: next });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
      {/* ================= LEFT COLUMN: Summary Card & Social Links ================= */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profile Card Preview */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#35E7C7]/60 shadow-lg shadow-[#35E7C7]/15 bg-black/40 flex items-center justify-center">
              {profile.profilePhotoUrl || profile.navbarAvatarUrl ? (
                <img
                  src={profile.profilePhotoUrl || profile.navbarAvatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-zinc-500" />
              )}
            </div>
            <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-[#35E7C7] border-2 border-[#0B0F17]" />
          </div>

          <h3 className="text-lg font-bold text-white">{profile.name || "Mohit Lamba"}</h3>
          <p className="text-sm text-[#35E7C7] font-medium mt-0.5">
            {profile.roleTitle || "Backend + AI Systems Engineer"}
          </p>
          <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
            <MapPin size={13} className="text-zinc-500" />
            {profile.location || "Delhi, India"}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#35E7C7]/10 text-[#35E7C7] border border-[#35E7C7]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35E7C7] animate-pulse" />
              {profile.availabilityBadge || "Available for Engineering Roles"}
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="glass-card rounded-xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe size={16} className="text-[#35E7C7]" />
              Public Social Links
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <Mail size={12} className="text-zinc-500" />
                Contact Email
              </label>
              <input
                type="email"
                value={profile.socialLinks?.email || ""}
                onChange={(e) => updateSocial({ email: e.target.value })}
                placeholder="e.g. mohit@example.com"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <GithubIcon size={12} className="text-zinc-500" />
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={profile.socialLinks?.github || ""}
                onChange={(e) => updateSocial({ github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <LinkedinIcon size={12} className="text-zinc-500" />
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profile.socialLinks?.linkedin || ""}
                onChange={(e) => updateSocial({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <Share2 size={12} className="text-zinc-500" />
                Twitter / X Profile URL
              </label>
              <input
                type="text"
                value={profile.socialLinks?.twitter || ""}
                onChange={(e) => updateSocial({ twitter: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-zinc-500" />
                Base Location
              </label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => updateProfile({ location: e.target.value })}
                placeholder="e.g. Delhi, India"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: Identity & Bio Statements ================= */}
      <div className="lg:col-span-2 space-y-6">
        {/* Core Identity & Headlines */}
        <div className="glass-card rounded-xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck size={18} className="text-[#35E7C7]" />
                Identity & Hero Taglines
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Core name, headlines, and status indicators rendered across the site.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="e.g. Mohit Lamba"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Role Title
              </label>
              <input
                type="text"
                value={profile.roleTitle || ""}
                onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                placeholder="e.g. ENGINEER / BUILDER"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Secondary Subtitle
              </label>
              <input
                type="text"
                value={profile.subTitle || ""}
                onChange={(e) => updateProfile({ subTitle: e.target.value })}
                placeholder="e.g. Backend + AI systems"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={profile.availabilityBadge || ""}
                onChange={(e) => updateProfile({ availabilityBadge: e.target.value })}
                placeholder="e.g. AVAILABLE FOR BACKEND · AI SYSTEMS ROLES"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Hero Impact Headline
            </label>
            <textarea
              value={profile.headline || ""}
              onChange={(e) => updateProfile({ headline: e.target.value })}
              placeholder="e.g. Mohit Lamba builds backend systems, AI agents, and data pipelines that hold up in production."
              className="w-full h-20 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Hero Narrative / Tagline
            </label>
            <textarea
              value={profile.heroTag || ""}
              onChange={(e) => updateProfile({ heroTag: e.target.value })}
              placeholder="e.g. I build the parts of a product most people never see..."
              className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Canonical Bio Paragraphs */}
        <div className="glass-card rounded-xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#35E7C7]" />
                About Section Bio Paragraphs
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Narrative paragraphs displayed in the About section of your portfolio.
              </p>
            </div>
            <button
              type="button"
              onClick={addBioParagraph}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#35E7C7]/15 hover:bg-[#35E7C7]/25 text-[#35E7C7] border border-[#35E7C7]/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.bioParagraphs?.map((paragraph, index) => (
              <div
                key={index}
                className="p-4 bg-white/[0.02] rounded-lg border border-white/5 space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                    Paragraph 0{index + 1}
                  </span>
                  {profile.bioParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBioParagraph(index)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      title="Remove paragraph"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea
                  value={paragraph}
                  onChange={(e) => handleBioChange(index, e.target.value)}
                  className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all resize-y leading-relaxed"
                  placeholder="Enter paragraph text..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
