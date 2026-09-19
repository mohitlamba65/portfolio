"use client";

import React, { useState } from "react";
import { PortfolioData, Skill, SkillCategory } from "@/types/portfolio";
import { Cpu, Plus, Trash2, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

const CATEGORIES: { id: SkillCategory | "all"; label: string; tagColor: string }[] = [
  { id: "all", label: "All Skills", tagColor: "bg-white/10 text-white" },
  { id: "backend", label: "Backend Core", tagColor: "bg-[#35E7C7]/15 text-[#35E7C7] border-[#35E7C7]/30" },
  { id: "ai", label: "AI & Agents", tagColor: "bg-[#A88BFF]/15 text-[#A88BFF] border-[#A88BFF]/30" },
  { id: "data", label: "Data & Streams", tagColor: "bg-[#FFA645]/15 text-[#FFA645] border-[#FFA645]/30" },
  { id: "frontend", label: "Frontend & UI", tagColor: "bg-[#FF7FB0]/15 text-[#FF7FB0] border-[#FF7FB0]/30" },
  { id: "infra", label: "Infra & DevOps", tagColor: "bg-[#6AA8FF]/15 text-[#6AA8FF] border-[#6AA8FF]/30" },
];

export default function SkillsTab({ data, onChange }: SkillsTabProps) {
  const skills = data.skills;
  const [selectedCat, setSelectedCat] = useState<SkillCategory | "all">("all");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("backend");
  const [newSkillLevel, setNewSkillLevel] = useState<number>(4);

  const filteredSkills =
    selectedCat === "all"
      ? skills
      : skills.filter((s) => s.category === selectedCat);

  const updateSkillLevel = (id: string, newLevel: number) => {
    onChange((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, level: newLevel } : s)),
    }));
  };

  const removeSkill = (id: string) => {
    onChange((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) return;

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: trimmed,
      category: newSkillCategory,
      level: newSkillLevel,
    };

    onChange((prev) => ({
      ...prev,
      skills: [newSkill, ...prev.skills],
    }));

    setNewSkillName("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Quick Add Bar */}
      <form
        onSubmit={handleAddSkill}
        className="glass-card rounded-xl p-5 border border-white/10 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus size={16} className="text-[#35E7C7]" />
            Add New Technical Skill
          </h3>
          <span className="text-xs text-zinc-400 font-mono">
            Powers both the 3D Sphere & Stack grid
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Technology / Tool Name
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. LangGraph, Redis, Kubernetes..."
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Domain Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50"
            >
              <option value="backend">Backend Core</option>
              <option value="ai">AI & Agents</option>
              <option value="data">Data & Streams</option>
              <option value="infra">Infra & DevOps</option>
              <option value="frontend">Frontend & UI</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Level (1–5)
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Number(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            >
              <option value={5}>5 — Expert</option>
              <option value={4}>4 — Advanced</option>
              <option value={3}>3 — Proficient</option>
              <option value={2}>2 — Intermediate</option>
              <option value={1}>1 — Familiar</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#35E7C7] text-[#0B0F17] rounded-lg text-sm font-semibold hover:bg-[#35E7C7]/90 transition-all shadow-[0_0_12px_rgba(53,231,199,0.3)] cursor-pointer"
            >
              Add Skill
            </button>
          </div>
        </div>
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter size={14} className="text-zinc-500 shrink-0 ml-1 mr-2" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border cursor-pointer",
              selectedCat === cat.id
                ? "bg-[#35E7C7]/15 text-[#35E7C7] border-[#35E7C7]/30 shadow-sm"
                : "bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/5 hover:text-white"
            )}
          >
            {cat.label} (
            {cat.id === "all"
              ? skills.length
              : skills.filter((s) => s.category === cat.id).length}
            )
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSkills.map((skill) => {
          const categoryMeta = CATEGORIES.find((c) => c.id === skill.category);

          return (
            <div
              key={skill.id}
              className="glass-card rounded-xl p-4 border border-white/10 flex items-center justify-between gap-3 group hover:border-white/20 transition-all"
            >
              <div className="min-w-0">
                <div className="font-semibold text-sm text-white truncate">
                  {skill.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border",
                      categoryMeta?.tagColor || "bg-white/5 text-zinc-400"
                    )}
                  >
                    {skill.category}
                  </span>

                  {/* Level dots */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateSkillLevel(skill.id, lvl)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                          lvl <= (skill.level || 3)
                            ? "bg-[#35E7C7]"
                            : "bg-zinc-700 hover:bg-zinc-500"
                        }`}
                        title={`Set level to ${lvl}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                title="Delete skill"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
