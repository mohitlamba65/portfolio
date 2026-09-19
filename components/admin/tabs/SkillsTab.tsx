"use client";

import React, { useState } from "react";
import { PortfolioData, Skill, SkillCategory } from "@/types/portfolio";
import { Cpu, Plus, Trash2, CheckCircle2, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card className="bg-muted/30">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Skills Constellation
            </div>
            <CardTitle className="text-2xl">Technical Stack & Capabilities</CardTitle>
            <CardDescription className="mt-1">
              Click on the rating dots to adjust proficiency levels (1 to 5) directly.
            </CardDescription>
          </div>

          <div className="text-sm font-medium px-4 py-2 rounded-xl bg-background border shadow-sm flex items-center gap-2">
            Total Skills: <span className="text-primary font-bold">{skills.length}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Add Inline Form */}
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleAddSkill}
            className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
          >
            <div className="flex-1 w-full space-y-2">
              <Label>Skill Name</Label>
              <Input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. LangGraph, Rust, Kafka..."
              />
            </div>

            <div className="w-full sm:w-48 space-y-2">
              <Label>Category</Label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="backend">Backend Core</option>
                <option value="ai">AI & Agents</option>
                <option value="data">Data & Streams</option>
                <option value="frontend">Frontend & UI</option>
                <option value="infra">Infra & DevOps</option>
              </select>
            </div>

            <div className="w-full sm:w-auto space-y-2">
              <Label>Proficiency (1-5)</Label>
              <div className="flex items-center gap-2 h-10 px-4 rounded-md border bg-background">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewSkillLevel(lvl)}
                      className={`w-4 h-4 rounded-full transition-all cursor-pointer ${
                        lvl <= newSkillLevel
                          ? "bg-primary scale-110 shadow-sm shadow-primary/50"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto h-10"
              disabled={!newSkillName.trim()}
            >
              <Plus size={16} className="mr-2" />
              Add Skill
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2">
        {CATEGORIES.map((cat) => {
          const active = selectedCat === cat.id;
          const count =
            cat.id === "all"
              ? skills.length
              : skills.filter((s) => s.category === cat.id).length;

          return (
            <Button
              key={cat.id}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCat(cat.id)}
              className={`rounded-full gap-2 transition-all ${
                active ? "shadow-md" : "hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none flex items-center justify-center min-w-[20px] ${
                  active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Skills Grid Matching .stack-card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredSkills.map((skill) => {
          return (
            <Card
              key={skill.id}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all flex flex-col items-center justify-between text-center gap-3 p-5 bg-card/50 hover:bg-card hover:shadow-md"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(skill.id)}
                className="absolute top-1 right-1 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                title="Remove Skill"
              >
                <Trash2 size={14} />
              </Button>

              <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm mt-1">
                {skill.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0 w-full space-y-1">
                <span className="text-sm font-semibold text-foreground truncate block">
                  {skill.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block truncate">
                  {skill.category}
                </span>
              </div>

              {/* Interactive 5-Dot Level Selector */}
              <div className="flex gap-1.5 pt-2 w-full justify-center" title="Click to adjust level (1-5)">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateSkillLevel(skill.id, lvl)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      lvl <= skill.level
                        ? "bg-primary scale-110"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
