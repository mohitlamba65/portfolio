"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
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
          <AdminField label="Hero tagline">
            <AdminTextarea
              value={profile.heroTag || ""}
              onChange={(e) => updateProfile({ heroTag: e.target.value })}
              placeholder="Paragraph under your name on the home page..."
              className="min-h-[100px] resize-none"
            />
          </AdminField>
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
