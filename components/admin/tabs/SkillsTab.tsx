"use client";

import React, { useState } from "react";
import { PortfolioData, Skill, SkillCategory } from "@/types/portfolio";
import { Cpu, Plus, Trash2, CheckCircle2, Sparkles } from "lucide-react";

interface SkillsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

const CATEGORIES: { id: SkillCategory | "all"; label: string; color: string }[] = [
  { id: "all", label: "All Technologies", color: "var(--cyan)" },
  { id: "backend", label: "Backend Core", color: "var(--cyan)" },
  { id: "ai", label: "AI & Agents", color: "var(--violet)" },
  { id: "data", label: "Data & Streams", color: "var(--amber)" },
  { id: "frontend", label: "Frontend & UI", color: "var(--pink)" },
  { id: "infra", label: "Infra & DevOps", color: "var(--blue)" },
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
    if (!window.confirm("Remove this skill from your tech stack?")) return;
    onChange((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      icon: null,
    };

    onChange((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));

    setNewSkillName("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            SKILLS CONSTELLATION
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-sans">
            Technical Stack & Capabilities
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            Click on the rating dots to adjust proficiency levels (1 to 5) directly.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] text-[var(--text)]">
          Total Skills: <span className="text-[var(--cyan)] font-bold">{skills.length}</span>
        </div>
      </div>

      {/* Quick Add Inline Form */}
      <form
        onSubmit={handleAddSkill}
        className="p-4 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] flex flex-wrap items-center gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill or framework name (e.g. LangGraph, Rust, Kafka)..."
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--cyan)]"
          />
        </div>

        <select
          value={newSkillCategory}
          onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
          className="px-3.5 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--cyan)]"
        >
          <option value="backend">Backend Core</option>
          <option value="ai">AI & Agents</option>
          <option value="data">Data & Streams</option>
          <option value="frontend">Frontend & UI</option>
          <option value="infra">Infra & DevOps</option>
        </select>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)]">
          <span className="text-xs font-mono text-[var(--text-dim)]">Level:</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setNewSkillLevel(lvl)}
                className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                  lvl <= newSkillLevel
                    ? "bg-[var(--cyan)] scale-110 shadow-sm shadow-[var(--cyan)]"
                    : "bg-[var(--line)] hover:bg-[var(--text-faint)]"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--cyan)] text-[#04120F] text-xs font-mono font-bold hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Skill</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selectedCat === cat.id;
          const count =
            cat.id === "all"
              ? skills.length
              : skills.filter((s) => s.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                active
                  ? "bg-[var(--cyan)] text-[#04120F] font-bold border-[var(--cyan)]"
                  : "bg-[var(--bg-panel)] text-[var(--text-dim)] border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--text)]"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  active ? "bg-[#04120F]/20 text-[#04120F]" : "bg-[var(--bg-elevated)] text-[var(--text-dim)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid Matching .stack-card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSkills.map((skill) => {
          return (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--line)] hover:border-[var(--cyan)]/60 transition-all flex flex-col items-center justify-between text-center gap-2.5 group relative"
            >
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="absolute top-2 right-2 p-1 text-[var(--text-faint)] hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Remove Skill"
              >
                <Trash2 size={12} />
              </button>

              <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] font-mono text-xs font-bold mt-1">
                {skill.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0 w-full">
                <span className="text-xs font-medium text-[var(--text)] truncate block font-sans">
                  {skill.name}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase block truncate mt-0.5">
                  {skill.category}
                </span>
              </div>

              {/* Interactive 5-Dot Level Selector */}
              <div className="flex gap-1.5 pt-1" title="Click to adjust level (1-5)">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSkillLevel(skill.id, lvl)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      lvl <= skill.level
                        ? "bg-[var(--cyan)] scale-110"
                        : "bg-[var(--line)] hover:bg-[var(--text-faint)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
