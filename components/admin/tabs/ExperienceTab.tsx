"use client";

import React, { useState } from "react";
import { PortfolioData, WorkExperience } from "@/types/portfolio";
import {
  Briefcase,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Copy,
  Calendar,
  MapPin,
  Tag,
  ListPlus,
  X,
} from "lucide-react";

interface ExperienceTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ExperienceTab({ data, onChange }: ExperienceTabProps) {
  const experiences = data.experiences;
  const [expandedId, setExpandedId] = useState<string | null>(
    experiences[0]?.id || null
  );
  const [newTagInput, setNewTagInput] = useState<Record<string, string>>({});

  const updateExperience = (id: string, fields: Partial<WorkExperience>) => {
    onChange((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...fields } : exp
      ),
    }));
  };

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: WorkExperience = {
      id: newId,
      company: "New Company / Organization",
      role: "Senior Software Engineer",
      period: "2024 — PRESENT",
      location: "Remote / Hybrid",
      highlightMetric: "Shipped v1.0 to production",
      description: "Architected and engineered core backend infrastructure and scalable AI workflows.",
      bullets: [
        "Engineered scalable microservices processing high-throughput event streams.",
        "Integrated LLM agents with automated verification loops and strict evaluation guardrails.",
      ],
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis"],
    };

    onChange((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
    setExpandedId(newId);
  };

  const removeExperience = (id: string) => {
    if (experiences.length <= 1) return;
    if (!window.confirm("Are you sure you want to delete this position?")) return;
    onChange((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const duplicateExperience = (exp: WorkExperience) => {
    const dupId = `exp-${Date.now()}`;
    const duplicate: WorkExperience = {
      ...exp,
      id: dupId,
      company: `${exp.company} (Copy)`,
    };
    onChange((prev) => ({
      ...prev,
      experiences: [...prev.experiences, duplicate],
    }));
    setExpandedId(dupId);
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const list = [...experiences];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onChange((prev) => ({
      ...prev,
      experiences: list,
    }));
  };

  // Bullet points handlers
  const handleBulletChange = (expId: string, bIdx: number, val: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const bullets = [...(exp.bullets ?? [])];
    bullets[bIdx] = val;
    updateExperience(expId, { bullets });
  };

  const addBullet = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      bullets: [...(exp.bullets ?? []), "New achievement or responsibility impact metric."],
    });
  };

  const removeBullet = (expId: string, bIdx: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      bullets: (exp.bullets ?? []).filter((_, i) => i !== bIdx),
    });
  };

  // Tech stack handlers
  const addTechTag = (expId: string) => {
    const tag = (newTagInput[expId] || "").trim();
    if (!tag) return;
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const stack = exp.techStack ?? [];
    if (!stack.includes(tag)) {
      updateExperience(expId, { techStack: [...stack, tag] });
    }
    setNewTagInput((prev) => ({ ...prev, [expId]: "" }));
  };

  const removeTechTag = (expId: string, tagToRemove: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      techStack: (exp.techStack ?? []).filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            EXPERIENCE REGISTRY
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-sans">
            Work Experience Timeline
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            Manage roles, company timelines, key accomplishments, and technologies used.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--cyan)] hover:brightness-110 text-[#04120F] font-mono text-xs font-bold transition-all shadow-lg shadow-[var(--cyan)]/20 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Position</span>
        </button>
      </div>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div
              key={exp.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "bg-[var(--bg-panel)] border-[var(--cyan)]/50 shadow-xl"
                  : "bg-[var(--bg-panel)]/70 border-[var(--line)] hover:border-[var(--line)]"
              }`}
            >
              {/* Card Header Bar */}
              <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] font-mono text-xs font-bold flex-shrink-0">
                    {exp.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-[var(--text)] font-sans truncate">
                        {exp.company || "Untitled Company"}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--line)] text-[var(--cyan)]">
                        {exp.role || "Role"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-dim)] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {exp.period || "Period"}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveExperience(idx, "up")}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === experiences.length - 1}
                    onClick={() => moveExperience(idx, "down")}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateExperience(exp)}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer"
                    title="Duplicate Position"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-rose-400 cursor-pointer"
                    title="Delete Position"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="w-[1px] h-4 bg-[var(--line)] mx-1" />
                  <div className="p-1 text-[var(--text-dim)]">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Expandable Form Body */}
              {isExpanded && (
                <div className="p-6 pt-2 border-t border-[var(--line)] space-y-6">
                  {/* Primary Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Period (e.g. 2024 — PRESENT)
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Location (e.g. Remote / NYC)
                      </label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>

                  {/* Highlight Metric & Description */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Highlight Metric Badge (e.g. &quot;5M+ requests / day&quot;)
                      </label>
                      <input
                        type="text"
                        value={exp.highlightMetric || ""}
                        onChange={(e) => updateExperience(exp.id, { highlightMetric: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Summary Description
                      </label>
                      <input
                        type="text"
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>

                  {/* Bullet Points Manager */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] flex items-center gap-1.5">
                        <ListPlus size={14} /> Accomplishment Bullets
                      </label>
                      <button
                        type="button"
                        onClick={() => addBullet(exp.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 text-xs font-mono hover:bg-[var(--cyan)]/20 cursor-pointer"
                      >
                        <Plus size={12} /> Add Bullet
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(exp.bullets ?? []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--cyan)] w-5 text-center">
                            •
                          </span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet(exp.id, bIdx)}
                            className="p-2 text-[var(--text-dim)] hover:text-rose-400 cursor-pointer"
                            title="Remove bullet"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Pills Manager */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase text-[var(--text-dim)] flex items-center gap-1.5">
                      <Tag size={14} /> Tech Stack Tags
                    </label>

                    <div className="flex flex-wrap gap-2 items-center">
                      {(exp.techStack ?? []).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--line)] text-xs font-mono text-[var(--text)]"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(exp.id, tech)}
                            className="text-[var(--text-dim)] hover:text-rose-400 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Input */}
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newTagInput[exp.id] || ""}
                          onChange={(e) =>
                            setNewTagInput((prev) => ({ ...prev, [exp.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTechTag(exp.id);
                            }
                          }}
                          placeholder="+ Add tech tag..."
                          className="px-3 py-1 rounded-full bg-[var(--bg-panel-2)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--cyan)] w-32"
                        />
                        <button
                          type="button"
                          onClick={() => addTechTag(exp.id)}
                          className="p-1 rounded-full bg-[var(--cyan)]/20 text-[var(--cyan)] hover:bg-[var(--cyan)]/30 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
