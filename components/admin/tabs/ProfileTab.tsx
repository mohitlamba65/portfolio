"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { User, Sparkles, MapPin, Mail, Plus, Trash2, Globe, Link2 } from "lucide-react";

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
      bioParagraphs: [...profile.bioParagraphs, "New paragraph about your engineering philosophy or background."],
    });
  };

  const removeBioParagraph = (index: number) => {
    if (profile.bioParagraphs.length <= 1) return;
    const next = profile.bioParagraphs.filter((_, i) => i !== index);
    updateProfile({ bioParagraphs: next });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT COLUMN: Structured Form Cards */}
      <div className="lg:col-span-7 space-y-6">
        {/* Core Identity */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-[var(--cyan)]">
                <User size={16} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text)] font-sans">Core Identity</h3>
                <p className="text-xs text-[var(--text-dim)] font-mono">Primary branding & availability status</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 uppercase">
              Identity Module
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="e.g. Mohit Lamba"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Role Title (Hero Sub-label)
              </label>
              <input
                type="text"
                value={profile.roleTitle || ""}
                onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                placeholder="e.g. Full Stack / Systems Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)]">
                Availability Badge (Pill with Pulsing Beacon)
              </label>
              <span className="text-[11px] font-mono text-[var(--cyan)] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
                Live Indicator
              </span>
            </div>
            <input
              type="text"
              value={profile.availabilityBadge || ""}
              onChange={(e) => updateProfile({ availabilityBadge: e.target.value })}
              placeholder="e.g. AVAILABLE FOR BACKEND · AI SYSTEMS ROLES"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Secondary Subtitle
              </label>
              <input
                type="text"
                value={profile.subTitle || ""}
                onChange={(e) => updateProfile({ subTitle: e.target.value })}
                placeholder="e.g. Engineer / Builder"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
                Physical Location
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-3 text-[var(--text-dim)]" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Tagline & Narrative */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--amber)]/10 border border-[var(--amber)]/20 flex items-center justify-center text-[var(--amber)]">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text)] font-sans">Hero Tagline & Narrative</h3>
                <p className="text-xs text-[var(--text-dim)] font-mono">The elevator pitch displayed prominently on Home</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)]">
                Home Hero Tagline (Paragraph below title)
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                {(profile.heroTag || "").length} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={profile.heroTag || ""}
              onChange={(e) => updateProfile({ heroTag: e.target.value })}
              placeholder="e.g. Focused on distributed backends, AI agents with tool use, and data pipelines that process millions of events without dropping packets."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] focus:ring-1 focus:ring-[var(--cyan)] transition-all leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5">
              SEO Headline / Meta Description
            </label>
            <input
              type="text"
              value={profile.headline || ""}
              onChange={(e) => updateProfile({ headline: e.target.value })}
              placeholder="e.g. Mohit Lamba builds distributed backends, AI agents, and resilient data systems."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] transition-all"
            />
          </div>
        </div>

        {/* Bio Paragraphs */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <h3 className="text-base font-semibold text-[var(--text)] font-sans">About Section Story</h3>
              <p className="text-xs text-[var(--text-dim)] font-mono">Paragraphs rendered in the About tab narrative</p>
            </div>
            <button
              type="button"
              onClick={addBioParagraph}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--cyan)]/10 hover:bg-[var(--cyan)]/20 text-[var(--cyan)] border border-[var(--cyan)]/30 text-xs font-mono transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.bioParagraphs.map((para, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-dim)]">
                  <span>Paragraph #{idx + 1}</span>
                  {profile.bioParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBioParagraph(idx)}
                      className="p-1 text-[var(--text-dim)] hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove paragraph"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={para}
                  onChange={(e) => handleBioChange(idx, e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social & Contact Connections */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <h3 className="text-base font-semibold text-[var(--text)] font-sans">Contact & Social Channels</h3>
            <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase">Public Links</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Globe size={13} /> GitHub Profile URL
              </label>
              <input
                type="text"
                value={profile.socialLinks.github}
                onChange={(e) => updateSocial({ github: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Link2 size={13} /> LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profile.socialLinks.linkedin}
                onChange={(e) => updateSocial({ linkedin: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Mail size={13} /> Contact Email Address
              </label>
              <input
                type="email"
                value={profile.socialLinks.email}
                onChange={(e) => updateSocial({ email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1.5 flex items-center gap-1.5">
                <Globe size={13} /> Twitter / X (Optional)
              </label>
              <input
                type="text"
                value={profile.socialLinks.twitter || ""}
                onChange={(e) => updateSocial({ twitter: e.target.value })}
                placeholder="https://x.com/username"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Real-Time Live Preview Mockup */}
      <div className="lg:col-span-5 space-y-6">
        <div className="sticky top-28 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--cyan)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-ping" />
              Real-Time Hero Preview
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-panel)] border border-[var(--line)] text-[var(--text-dim)]">
              Viewport Mock
            </span>
          </div>

          {/* Hero Mockup Card */}
          <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--cyan)]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[var(--violet)]/10 blur-3xl pointer-events-none" />

            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--line)] mb-5">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                {profile.availabilityBadge || "AVAILABLE FOR ROLES"}
              </span>
            </div>

            {/* Name & Title */}
            <div className="space-y-1 mb-4">
              <h2 className="text-3xl font-bold font-heading text-[var(--text)] tracking-tight">
                {profile.name || "Your Name"}
              </h2>
              <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-sm">
                <span>{profile.roleTitle || "Full Stack Engineer"}</span>
                <span className="w-2 h-3.5 bg-[var(--cyan)] animate-pulse inline-block" />
              </div>
            </div>

            {/* Hero Tagline */}
            <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-6">
              {profile.heroTag || "Add your hero tagline in the form on the left to preview it here live."}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--line)]">
              <div className="px-4 py-2 rounded-full bg-[var(--cyan)] text-[#04120F] text-xs font-mono font-semibold">
                Explore Work →
              </div>
              <div className="px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--line)] text-[var(--text)] text-xs font-mono">
                Get in Touch
              </div>
            </div>

            {/* Location & Social Icons */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--line)] text-xs text-[var(--text-dim)] font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--cyan)]" />
                {profile.location || "Earth"}
              </span>
              <div className="flex items-center gap-2">
                {profile.socialLinks.github && <Globe size={14} className="hover:text-[var(--text)]" />}
                {profile.socialLinks.linkedin && <Link2 size={14} className="hover:text-[var(--text)]" />}
                {profile.socialLinks.email && <Mail size={14} className="hover:text-[var(--text)]" />}
              </div>
            </div>
          </div>

          {/* About Bio Snippet Preview */}
          <div className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] text-xs text-[var(--text-dim)] space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text)]">
              <span className="text-[var(--amber)]">// About Narrative Snippet</span>
              <span>{profile.bioParagraphs.length} paragraphs</span>
            </div>
            <p className="line-clamp-3 italic text-[var(--text-dim)]">
              &quot;{profile.bioParagraphs[0] || "No bio entered."}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
