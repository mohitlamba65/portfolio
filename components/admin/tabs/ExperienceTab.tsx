"use client";

import React, { useState } from "react";
import { PortfolioData, WorkExperience } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminDetails,
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
  AdminListItem,
  AdminListLayout,
  AdminListPanel,
  AdminTextarea,
} from "../admin-ui";

interface ExperienceTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ExperienceTab({ data, onChange }: ExperienceTabProps) {
  const experiences = data.experiences;
  const [selectedId, setSelectedId] = useState<string | null>(experiences[0]?.id ?? null);

  const selected = experiences.find((e) => e.id === selectedId) ?? null;

  const updateExperiences = (next: WorkExperience[]) => {
    onChange((prev) => ({ ...prev, experiences: next }));
  };

  const handleUpdate = (id: string, fields: Partial<WorkExperience>) => {
    updateExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, ...fields } : exp)));
  };

  const handleAddRole = () => {
    const newId = `exp-${Date.now()}`;
    const newRole: WorkExperience = {
      id: newId,
      company: "Company name",
      role: "Role title",
      period: "2024 — Present",
      description: "",
      bullets: [],
      techStack: [],
    };
    updateExperiences([...experiences, newRole]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this experience entry?")) return;
    const next = experiences.filter((exp) => exp.id !== id);
    updateExperiences(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }
  };

  const handleAddBullet = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    handleUpdate(expId, { bullets: [...(exp.bullets || []), ""] });
  };

  const handleUpdateBullet = (expId: string, bIndex: number, val: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp?.bullets) return;
    const copy = [...exp.bullets];
    copy[bIndex] = val;
    handleUpdate(expId, { bullets: copy });
  };

  const handleRemoveBullet = (expId: string, bIndex: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp?.bullets) return;
    handleUpdate(expId, { bullets: exp.bullets.filter((_, i) => i !== bIndex) });
  };

  const handleTechStackChange = (expId: string, value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    handleUpdate(expId, { techStack: tags });
  };

  return (
    <div className="pb-8">
      <AdminListLayout
        list={
          <AdminListPanel
            title="Experience"
            action={
              <button type="button" onClick={handleAddRole} className="admin-btn-accent-soft !px-2 !py-1">
                <Plus size={14} />
              </button>
            }
          >
            {experiences.length === 0 ? (
              <p className="admin-hint px-2 py-4 text-center">No entries yet.</p>
            ) : (
              experiences.map((exp) => (
                <AdminListItem
                  key={exp.id}
                  active={exp.id === selectedId}
                  title={exp.company}
                  meta={exp.role}
                  onClick={() => setSelectedId(exp.id)}
                />
              ))
            )}
          </AdminListPanel>
        }
        form={
          selected ? (
            <AdminFormSurface>
              <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b admin-border">
                <div>
                  <h3 className="text-base font-semibold">Edit experience</h3>
                  <p className="admin-hint mt-0.5">Shown on the Experience timeline after you save.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  className="admin-btn-secondary hover:!text-red-400 hover:!border-red-500/30"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>

              <AdminFormSection title="Basics">
                <div className="admin-form-grid two-col">
                  <AdminField label="Company">
                    <AdminInput
                      value={selected.company}
                      onChange={(e) => handleUpdate(selected.id, { company: e.target.value })}
                      placeholder="e.g. Mednex"
                    />
                  </AdminField>
                  <AdminField label="Role">
                    <AdminInput
                      value={selected.role}
                      onChange={(e) => handleUpdate(selected.id, { role: e.target.value })}
                      placeholder="e.g. AI & Backend Systems"
                    />
                  </AdminField>
                  <AdminField label="Period">
                    <AdminInput
                      value={selected.period}
                      onChange={(e) => handleUpdate(selected.id, { period: e.target.value })}
                      placeholder="e.g. 2024 — Present"
                    />
                  </AdminField>
                  <AdminField label="Location" hint="Optional">
                    <AdminInput
                      value={selected.location || ""}
                      onChange={(e) => handleUpdate(selected.id, { location: e.target.value })}
                      placeholder="e.g. Delhi, India"
                    />
                  </AdminField>
                </div>
                <AdminField label="Summary">
                  <AdminTextarea
                    value={selected.description}
                    onChange={(e) => handleUpdate(selected.id, { description: e.target.value })}
                    placeholder="Brief overview of what you did..."
                    className="min-h-[100px]"
                  />
                </AdminField>
              </AdminFormSection>

              <AdminDetails summary="Extra details (bullets, tech, highlight)">
                <AdminField label="Highlight metric" hint="Optional short achievement">
                  <AdminInput
                    value={selected.highlightMetric || ""}
                    onChange={(e) => handleUpdate(selected.id, { highlightMetric: e.target.value })}
                    placeholder="e.g. 50+ B2B clients"
                  />
                </AdminField>

                <AdminField label="Technologies" hint="Comma-separated">
                  <AdminInput
                    value={(selected.techStack || []).join(", ")}
                    onChange={(e) => handleTechStackChange(selected.id, e.target.value)}
                    placeholder="Node.js, TypeScript, Redis"
                  />
                </AdminField>

                <div className="admin-field">
                  <div className="flex items-center justify-between mb-2">
                    <span className="admin-label !mb-0">Bullet points</span>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(selected.id)}
                      className="admin-btn-accent-soft !py-1 !px-2 text-xs"
                    >
                      <Plus size={12} />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(selected.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <AdminInput
                          value={bullet}
                          onChange={(e) => handleUpdateBullet(selected.id, bIdx, e.target.value)}
                          placeholder="Achievement or responsibility..."
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(selected.id, bIdx)}
                          className="admin-faint hover:text-red-400 p-2"
                          aria-label="Remove bullet"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(selected.bullets || []).length === 0 ? (
                      <p className="admin-hint">No bullets yet. These expand on the timeline.</p>
                    ) : null}
                  </div>
                </div>
              </AdminDetails>
            </AdminFormSurface>
          ) : (
            <div className="admin-form-surface admin-form-empty">
              {experiences.length === 0
                ? "Add an experience entry to get started."
                : "Select an entry from the list."}
            </div>
          )
        }
      />
    </div>
  );
}
