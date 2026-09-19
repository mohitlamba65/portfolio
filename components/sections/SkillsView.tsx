"use client";

import React, { useState } from "react";
import { Skill, SkillCategory } from "@/types/portfolio";
import Skills3DSphere from "@/components/3d/Skills3DSphere";
import { Sparkles, Terminal, Cpu, Database, Layout, Shield } from "lucide-react";

interface SkillsViewProps {
  skills: Skill[];
}

const CATEGORY_META: Record<
  SkillCategory,
  { label: string; icon: React.ComponentType<{ size: number; className?: string }>; color: string }
> = {
  backend: { label: "Backend Core & Distributed Systems", icon: Cpu, color: "text-teal-400" },
  ai: { label: "Agentic AI & LLM Systems", icon: Sparkles, color: "text-amber-400" },
  data: { label: "Data Storage, Vector DBs & Caching", icon: Database, color: "text-sky-400" },
  frontend: { label: "Fullstack Interfaces & Frameworks", icon: Layout, color: "text-pink-400" },
  infra: { label: "Infra, Cloud & Observability", icon: Shield, color: "text-purple-400" },
};

export default function SkillsView({ skills }: SkillsViewProps) {
  const [filter, setFilter] = useState<SkillCategory | "all">("all");

  const filteredSkills = skills.filter(
    (s) => filter === "all" || s.category === filter
  );

  const categories = Object.keys(CATEGORY_META) as SkillCategory[];

  return (
    <div className="space-y-10 animate-tab-enter">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-mono tracking-widest uppercase">
          <span>—</span> TECHNICAL ARSENAL
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Systems &amp; Agentic Intelligence Stack
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Drag the 3D constellation below to inspect technologies in 3D space, or view proficiency breakdowns by architectural layer.
        </p>
      </div>

      {/* 3D Interactive Three.js Constellation */}
      <Skills3DSphere
        skills={skills}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Detailed Category Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {categories
          .filter((cat) => filter === "all" || filter === cat)
          .map((cat) => {
            const meta = CATEGORY_META[cat];
            const Icon = meta.icon;
            const categorySkills = skills.filter((s) => s.category === cat);

            return (
              <div
                key={cat}
                className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${meta.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {meta.label}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 uppercase">
                      {categorySkills.length} Technologies
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold">
                          {skill.level}/10
                        </span>
                      </div>
                      {/* Proficiency bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
