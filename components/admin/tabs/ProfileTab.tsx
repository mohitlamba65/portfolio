"use client";

import React from "react";
import { PortfolioData, AboutPhotoCardConfig, AboutPrincipleItem } from "@/types/portfolio";
import { defaultAboutPhotoCard } from "@/lib/about-sidebar-defaults";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminDetails,
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
  AdminTextarea,
} from "../admin-ui";

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
      bioParagraphs: [...profile.bioParagraphs, ""],
    });
  };

  const heroRoles = profile.heroRoles?.length
    ? profile.heroRoles
    : ["Backend Engineer", "AI Systems Builder", "Full Stack Developer"];

  const heroTagLines: string[] =
    profile.heroTagLines && profile.heroTagLines.length > 0
      ? profile.heroTagLines
      : profile.heroTag
        ? [profile.heroTag]
        : [""];

  const updateHeroRole = (index: number, value: string) => {
    const next = [...heroRoles];
    next[index] = value;
    updateProfile({ heroRoles: next });
  };

  const addHeroRole = () => updateProfile({ heroRoles: [...heroRoles, ""] });

  const removeHeroRole = (index: number) => {
    if (heroRoles.length <= 1) return;
    updateProfile({ heroRoles: heroRoles.filter((_, i) => i !== index) });
  };

  const updateHeroTagLine = (index: number, value: string) => {
    const next = [...heroTagLines];
    next[index] = value;
    updateProfile({ heroTagLines: next, heroTag: next.filter(Boolean).join("\n\n") });
  };

  const addHeroTagLine = () => {
    const next = [...heroTagLines, ""];
    updateProfile({ heroTagLines: next });
  };

  const removeHeroTagLine = (index: number) => {
    if (heroTagLines.length <= 1) return;
    const next = heroTagLines.filter((_, i) => i !== index);
    updateProfile({ heroTagLines: next, heroTag: next.filter(Boolean).join("\n\n") });
  };

  const aboutPhoto: AboutPhotoCardConfig = {
    ...defaultAboutPhotoCard(profile.name),
    ...profile.aboutPhotoCard,
    traits:
      profile.aboutPhotoCard?.traits?.filter((t) => t.trim()).length
        ? profile.aboutPhotoCard!.traits!
        : defaultAboutPhotoCard(profile.name).traits,
  };

  const updateAboutPhoto = (fields: Partial<AboutPhotoCardConfig>) => {
    updateProfile({
      aboutPhotoCard: {
        ...aboutPhoto,
        ...fields,
        traits: fields.traits ?? aboutPhoto.traits,
      },
    });
  };

  const updateTrait = (index: number, value: string) => {
    const next = [...(aboutPhoto.traits ?? [])];
    next[index] = value;
    updateAboutPhoto({ traits: next });
  };

  const addTrait = () => updateAboutPhoto({ traits: [...(aboutPhoto.traits ?? []), ""] });

  const removeTrait = (index: number) => {
    const next = (aboutPhoto.traits ?? []).filter((_, i) => i !== index);
    if (!next.length) return;
    updateAboutPhoto({ traits: next });
  };

  const aboutPrinciples: AboutPrincipleItem[] =
    profile.aboutPrinciples?.length ? profile.aboutPrinciples : [];

  const updatePrinciple = (index: number, fields: Partial<AboutPrincipleItem>) => {
    const base =
      aboutPrinciples.length > 0
        ? aboutPrinciples
        : [
            { code: "01", title: "", desc: "" },
            { code: "02", title: "", desc: "" },
            { code: "03", title: "", desc: "" },
            { code: "04", title: "", desc: "" },
          ];
    const next = base.map((p, i) => (i === index ? { ...p, ...fields } : p));
    updateProfile({ aboutPrinciples: next });
  };

  const addPrinciple = () => {
    updateProfile({
      aboutPrinciples: [
        ...aboutPrinciples,
        { code: String(aboutPrinciples.length + 1).padStart(2, "0"), title: "", desc: "" },
      ],
    });
  };

  const removePrinciple = (index: number) => {
    updateProfile({ aboutPrinciples: aboutPrinciples.filter((_, i) => i !== index) });
  };

  const removeBioParagraph = (index: number) => {
    if (profile.bioParagraphs.length <= 1) return;
    updateProfile({ bioParagraphs: profile.bioParagraphs.filter((_, i) => i !== index) });
  };

  return (
    <div className="pb-8">
      <AdminFormSurface>
        <div className="mb-5 pb-4 border-b admin-border">
          <h3 className="text-base font-semibold">Profile & identity</h3>
          <p className="admin-hint mt-0.5">Your name, hero copy, social links, and about bio.</p>
        </div>

        <AdminFormSection title="Basics">
          <div className="admin-form-grid two-col">
            <AdminField label="Full name">
              <AdminInput
                value={profile.name || ""}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Mohit Lamba"
              />
            </AdminField>
            <AdminField label="Location">
              <AdminInput
                value={profile.location || ""}
                onChange={(e) => updateProfile({ location: e.target.value })}
                placeholder="Delhi, India"
              />
            </AdminField>
            <AdminField label="Role title">
              <AdminInput
                value={profile.roleTitle || ""}
                onChange={(e) => updateProfile({ roleTitle: e.target.value })}
                placeholder="ENGINEER / BUILDER"
              />
            </AdminField>
            <AdminField label="Availability badge">
              <AdminInput
                value={profile.availabilityBadge || ""}
                onChange={(e) => updateProfile({ availabilityBadge: e.target.value })}
                placeholder="AVAILABLE FOR BACKEND · AI ROLES"
              />
            </AdminField>
          </div>
        </AdminFormSection>

        <AdminFormSection title="Hero section">
          <AdminField label="Headline" hint="Used in page metadata and about views">
            <AdminTextarea
              value={profile.headline || ""}
              onChange={(e) => updateProfile({ headline: e.target.value })}
              placeholder="One-line summary of what you build..."
              className="min-h-[80px] resize-none"
            />
          </AdminField>

          <div className="admin-field">
            <div className="flex items-center justify-between mb-2">
              <span className="admin-label !mb-0">Rotating role lines</span>
              <button type="button" onClick={addHeroRole} className="admin-btn-accent-soft !py-1 !px-2 text-xs">
                <Plus size={12} />
                Add role
              </button>
            </div>
            <p className="admin-hint mb-3">Typed under your name on the home hero (cycles automatically).</p>
            <div className="space-y-2">
              {heroRoles.map((role, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AdminInput
                    value={role}
                    onChange={(e) => updateHeroRole(index, e.target.value)}
                    placeholder="e.g. AI Systems Builder"
                    className="flex-1"
                  />
                  {heroRoles.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeHeroRole(index)}
                      className="admin-faint hover:text-red-400 p-2"
                      aria-label="Remove role"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-field mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="admin-label !mb-0">Hero taglines</span>
              <button type="button" onClick={addHeroTagLine} className="admin-btn-accent-soft !py-1 !px-2 text-xs">
                <Plus size={12} />
                Add paragraph
              </button>
            </div>
            <p className="admin-hint mb-3">Supporting lines below the rotating role — each block is its own paragraph.</p>
            <div className="space-y-3">
              {heroTagLines.map((line, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="admin-hint !mt-0 text-xs">Paragraph {index + 1}</span>
                    {heroTagLines.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeHeroTagLine(index)}
                        className="admin-faint hover:text-red-400 p-1"
                        aria-label="Remove tagline paragraph"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                  <AdminTextarea
                    value={line}
                    onChange={(e) => updateHeroTagLine(index, e.target.value)}
                    placeholder="Supporting tagline..."
                    className="min-h-[72px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection title="Social links">
          <div className="admin-form-grid two-col">
            <AdminField label="Email">
              <AdminInput
                type="email"
                value={profile.socialLinks?.email || ""}
                onChange={(e) => updateSocial({ email: e.target.value })}
                placeholder="you@email.com"
                mono
              />
            </AdminField>
            <AdminField label="GitHub">
              <AdminInput
                value={profile.socialLinks?.github || ""}
                onChange={(e) => updateSocial({ github: e.target.value })}
                placeholder="https://github.com/..."
                mono
              />
            </AdminField>
            <AdminField label="LinkedIn">
              <AdminInput
                value={profile.socialLinks?.linkedin || ""}
                onChange={(e) => updateSocial({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                mono
              />
            </AdminField>
            <AdminField label="Twitter / X" hint="Optional">
              <AdminInput
                value={profile.socialLinks?.twitter || ""}
                onChange={(e) => updateSocial({ twitter: e.target.value })}
                placeholder="https://x.com/..."
                mono
              />
            </AdminField>
            <AdminField label="LeetCode">
              <AdminInput
                value={profile.socialLinks?.leetcode || ""}
                onChange={(e) => updateSocial({ leetcode: e.target.value })}
                placeholder="https://leetcode.com/u/..."
                mono
              />
            </AdminField>
          </div>
        </AdminFormSection>

        <AdminFormSection title="About photo card">
          <p className="admin-hint mb-4">
            Text under your profile photo on the home About column — meta lines and colored tag
            pills.
          </p>
          <AdminField label="Meta line 1" hint="Use {name} for uppercase full name">
            <AdminInput
              value={aboutPhoto.metaLine1 ?? ""}
              onChange={(e) => updateAboutPhoto({ metaLine1: e.target.value })}
              placeholder="ENGINEER: {name}"
              mono
            />
          </AdminField>
          <AdminField label="Meta line 2">
            <AdminInput
              value={aboutPhoto.metaLine2 ?? ""}
              onChange={(e) => updateAboutPhoto({ metaLine2: e.target.value })}
              placeholder="FOCUS: SCALE · PERFORMANCE · RELIABILITY"
              mono
            />
          </AdminField>
          <div className="admin-field mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="admin-label !mb-0">Tag pills</span>
              <button type="button" onClick={addTrait} className="admin-btn-accent-soft !py-1 !px-2 text-xs">
                <Plus size={12} />
                Add tag
              </button>
            </div>
            <div className="space-y-2">
              {(aboutPhoto.traits ?? []).map((trait, index) => (
                <div key={index} className="flex items-center gap-2">
                  <AdminInput
                    value={trait}
                    onChange={(e) => updateTrait(index, e.target.value)}
                    placeholder="I Build Products"
                    className="flex-1"
                  />
                  {(aboutPhoto.traits?.length ?? 0) > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeTrait(index)}
                      className="admin-faint hover:text-red-400 p-2"
                      aria-label="Remove tag"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </AdminFormSection>

        <AdminFormSection title="About principles grid">
          <p className="admin-hint mb-3">
            Optional row of cards below the About grid. Leave empty to use default architecture
            principles.
          </p>
          <button type="button" onClick={addPrinciple} className="admin-btn-accent-soft mb-3">
            <Plus size={14} />
            Add principle card
          </button>
          {aboutPrinciples.length > 0 ? (
            <div className="space-y-4">
              {aboutPrinciples.map((p, index) => (
                <div key={index} className="p-4 rounded-lg border admin-border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="admin-hint !mt-0">Card {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePrinciple(index)}
                      className="admin-faint hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <AdminInput
                    value={p.code ?? ""}
                    onChange={(e) => updatePrinciple(index, { code: e.target.value })}
                    placeholder="01"
                    mono
                  />
                  <AdminInput
                    value={p.title}
                    onChange={(e) => updatePrinciple(index, { title: e.target.value })}
                    placeholder="Title"
                  />
                  <AdminTextarea
                    value={p.desc ?? ""}
                    onChange={(e) => updatePrinciple(index, { desc: e.target.value })}
                    placeholder="Description (optional)"
                    className="min-h-[72px]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-hint">Using default SOLID / architecture cards on site.</p>
          )}
        </AdminFormSection>

        <AdminFormSection title="About bio">
          <div className="flex items-center justify-between mb-3">
            <p className="admin-hint !mt-0">Paragraphs shown in the About section.</p>
            <button type="button" onClick={addBioParagraph} className="admin-btn-accent-soft">
              <Plus size={14} />
              Add paragraph
            </button>
          </div>
          <div className="space-y-4">
            {profile.bioParagraphs?.map((paragraph, index) => (
              <div key={index} className="admin-field !mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="admin-label !mb-0">Paragraph {index + 1}</span>
                  {profile.bioParagraphs.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeBioParagraph(index)}
                      className="admin-faint hover:text-red-400 p-1"
                      aria-label="Remove paragraph"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
                <AdminTextarea
                  value={paragraph}
                  onChange={(e) => handleBioChange(index, e.target.value)}
                  placeholder="Write a bio paragraph..."
                  className="min-h-[100px]"
                />
              </div>
            ))}
          </div>
        </AdminFormSection>

        <AdminDetails summary="Optional fields">
          <AdminField label="Subtitle">
            <AdminInput
              value={profile.subTitle || ""}
              onChange={(e) => updateProfile({ subTitle: e.target.value })}
              placeholder="Backend + AI systems"
            />
          </AdminField>
        </AdminDetails>
      </AdminFormSurface>
    </div>
  );
}
