"use client";

import React, { useState } from "react";
import { PortfolioData, WorkExperience } from "@/types/portfolio";
import {
  Briefcase,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  MapPin,
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

  const updateExperiences = (next: WorkExperience[]) => {
    onChange((prev) => ({
      ...prev,
      experiences: next,
    }));
  };

  const handleUpdate = (id: string, fields: Partial<WorkExperience>) => {
    const next = experiences.map((exp) => (exp.id === id ? { ...exp, ...fields } : exp));
    updateExperiences(next);
  };

  const handleAddRole = () => {
    const newId = `exp-${Date.now()}`;
    const newRole: WorkExperience = {
      id: newId,
      company: "Organization / Company",
      role: "Backend & Systems Engineer",
      period: "2024 — Present",
      location: "Remote / Hybrid",
      description:
        "Engineered scalable server-side systems, implemented resilient messaging architectures, and ensured high throughput reliability.",
      highlightMetric: "Key engineering impact highlight",
      bullets: [
        "Architected and deployed distributed backend services with end-to-end type safety.",
        "Optimized database query patterns and Redis caching, slashing p99 latency.",
      ],
      techStack: ["TypeScript", "Node.js", "Redis"],
    };
    updateExperiences([newRole, ...experiences]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this career experience entry?"))
      return;
    updateExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;
    const copy = [...experiences];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateExperiences(copy);
  };

  const handleAddBullet = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const current = exp.bullets || [];
    handleUpdate(expId, {
      bullets: [...current, "Describe a measurable engineering outcome or architecture win."],
    });
  };

  const handleUpdateBullet = (expId: string, bIndex: number, val: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp || !exp.bullets) return;
    const copy = [...exp.bullets];
    copy[bIndex] = val;
    handleUpdate(expId, { bullets: copy });
  };

  const handleRemoveBullet = (expId: string, bIndex: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp || !exp.bullets) return;
    handleUpdate(expId, {
      bullets: exp.bullets.filter((_, i: number) => i !== bIndex),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {experiences.length} Career Milestones
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddRole}
          className="flex items-center gap-2 px-4 py-2 bg-[#35E7C7] text-[#0B0F17] rounded-lg text-sm font-semibold hover:bg-[#35E7C7]/90 transition-all shadow-[0_0_15px_rgba(53,231,199,0.3)] cursor-pointer"
        >
          <Plus size={16} />
          <span>New Experience</span>
        </button>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {experiences.map((exp, index) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div
              key={exp.id}
              className="glass-card rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
            >
              {/* Card Header Bar */}
              <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] select-none border-b border-white/5"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#35E7C7]/10 text-[#35E7C7] flex items-center justify-center shrink-0 border border-[#35E7C7]/20">
                    <Briefcase size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white truncate">
                        {exp.role || "Untitled Role"}
                      </h3>
                      <span className="text-zinc-400 text-sm">at</span>
                      <span className="text-[#35E7C7] font-semibold text-sm">
                        {exp.company}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10">
                        {exp.period}
                      </span>
                    </div>
                    {exp.highlightMetric && (
                      <p className="text-xs text-amber-400/90 truncate mt-0.5 font-medium">
                        ★ {exp.highlightMetric}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Controls */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={index === experiences.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete role"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors ml-1"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              {isExpanded && (
                <div className="p-6 space-y-5 bg-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Role Title
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdate(exp.id, { role: e.target.value })}
                        placeholder="e.g. AI & Backend Systems"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <Building size={12} className="text-zinc-500" />
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdate(exp.id, { company: e.target.value })}
                        placeholder="e.g. Mednex or EY"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <Calendar size={12} className="text-zinc-500" />
                        Employment Period
                      </label>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => handleUpdate(exp.id, { period: e.target.value })}
                        placeholder="e.g. MEDNEX — CURRENT or 2023 — 2024"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <Award size={12} className="text-[#35E7C7]" />
                        Highlight Achievement Pill
                      </label>
                      <input
                        type="text"
                        value={exp.highlightMetric || ""}
                        onChange={(e) =>
                          handleUpdate(exp.id, { highlightMetric: e.target.value })
                        }
                        placeholder="e.g. 50+ B2B Clients or 1M+ Active Users"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-[#35E7C7] font-semibold focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <MapPin size={12} className="text-zinc-500" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location || ""}
                        onChange={(e) =>
                          handleUpdate(exp.id, { location: e.target.value })
                        }
                        placeholder="e.g. Delhi, India or Remote"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>
                  </div>

                  {/* Summary Description */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Role Overview Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleUpdate(exp.id, { description: e.target.value })
                      }
                      placeholder="Brief overview of responsibilities and systemic scope..."
                      className="w-full h-20 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 resize-y leading-relaxed"
                    />
                  </div>

                  {/* Measurable Achievements / Bullet Points */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                        Detailed Engineering Bullets (Evidence)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(exp.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#35E7C7]/15 hover:bg-[#35E7C7]/25 text-[#35E7C7] border border-[#35E7C7]/30 transition-colors"
                      >
                        <Plus size={12} />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets?.map((bullet: string, bIdx: number) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-[#35E7C7] text-xs shrink-0">•</span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) =>
                              handleUpdateBullet(exp.id, bIdx, e.target.value)
                            }
                            placeholder="Engineering achievement with metrics..."
                            className="flex-1 bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet(exp.id, bIdx)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
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
