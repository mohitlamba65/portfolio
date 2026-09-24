"use client";

import React, { useState } from "react";
import { PortfolioData, Skill, SkillCategory } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AdminField,
  AdminFormSurface,
  AdminInput,
  AdminSelect,
} from "../admin-ui";

interface SkillsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

const CATEGORIES: { id: SkillCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI" },
  { id: "data", label: "Data" },
  { id: "frontend", label: "Frontend" },
  { id: "infra", label: "Infra" },
];

export default function SkillsTab({ data, onChange }: SkillsTabProps) {
  const skills = data.skills;
  const [selectedCat, setSelectedCat] = useState<SkillCategory | "all">("all");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("backend");
  const [newSkillLevel, setNewSkillLevel] = useState<number>(4);

  const filteredSkills =
    selectedCat === "all" ? skills : skills.filter((s) => s.category === selectedCat);

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

    onChange((prev) => ({
      ...prev,
      skills: [
        {
          id: `skill-${Date.now()}`,
          name: trimmed,
          category: newSkillCategory,
          level: newSkillLevel,
        },
        ...prev.skills,
      ],
    }));

    setNewSkillName("");
  };

  return (
    <div className="space-y-5 pb-8">
      <AdminFormSurface>
        <h3 className="text-sm font-semibold mb-4">Add skill</h3>
        <form onSubmit={handleAddSkill} className="admin-form-grid two-col">
          <AdminField label="Name">
            <AdminInput
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. LangGraph, Redis"
            />
          </AdminField>
          <AdminField label="Category">
            <AdminSelect
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
            >
              <option value="backend">Backend</option>
              <option value="ai">AI</option>
              <option value="data">Data</option>
              <option value="infra">Infra</option>
              <option value="frontend">Frontend</option>
            </AdminSelect>
          </AdminField>
          <AdminField label="Level (1–5)">
            <AdminSelect
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(Number(e.target.value))}
            >
              <option value={5}>5 — Expert</option>
              <option value={4}>4 — Advanced</option>
              <option value={3}>3 — Proficient</option>
              <option value={2}>2 — Intermediate</option>
              <option value={1}>1 — Familiar</option>
            </AdminSelect>
          </AdminField>
          <div className="admin-field flex items-end">
            <button type="submit" className="admin-btn-primary w-full">
              <Plus size={14} />
              Add
            </button>
          </div>
        </form>
      </AdminFormSurface>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              selectedCat === cat.id
                ? "admin-btn-accent-soft"
                : "admin-btn-secondary !border admin-border"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="admin-form-surface !p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{skill.name}</div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="admin-hint capitalize !mt-0">{skill.category}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateSkillLevel(skill.id, lvl)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        lvl <= (skill.level || 3)
                          ? "bg-[var(--cyan)]"
                          : "bg-[var(--line)] hover:bg-[var(--text-faint)]"
                      )}
                      title={`Level ${lvl}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSkill(skill.id)}
              className="admin-btn-secondary hover:!text-red-400 shrink-0"
              aria-label={`Remove ${skill.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filteredSkills.length === 0 ? (
          <div className="admin-form-empty admin-form-surface">No skills in this category.</div>
        ) : null}
      </div>
    </div>
  );
}
