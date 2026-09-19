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

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <Card className="bg-muted/30">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Experience Registry
            </div>
            <CardTitle className="text-2xl">Work Experience Timeline</CardTitle>
            <CardDescription className="mt-1">
              Manage roles, company timelines, key accomplishments, and technologies used.
            </CardDescription>
          </div>

          <Button onClick={addExperience} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={16} />
            Add Position
          </Button>
        </CardHeader>
      </Card>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <Card
              key={exp.id}
              className={`transition-all duration-200 overflow-hidden border-2 ${
                isExpanded ? "border-primary/50 shadow-md" : "border-border hover:border-primary/30"
              }`}
            >
              {/* Card Header Bar */}
              <div
                className="p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none bg-card"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {exp.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-semibold truncate">
                        {exp.company || "Untitled Company"}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {exp.role || "Role"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} /> {exp.period || "Period"}
                      </span>
                      {exp.location && (
                        <span className="hidden sm:flex items-center gap-1.5 font-medium">
                          <MapPin size={14} /> {exp.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div
                  className="flex items-center gap-1.5 sm:gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="hidden sm:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
                      disabled={idx === 0}
                      onClick={() => moveExperience(idx, "up")}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
                      disabled={idx === experiences.length - 1}
                      onClick={() => moveExperience(idx, "down")}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </Button>
                    <div className="w-[1px] h-4 bg-border mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={() => duplicateExperience(exp)}
                      title="Duplicate Position"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeExperience(exp.id)}
                      title="Delete Position"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <div className="w-[1px] h-8 bg-border hidden sm:block mx-2" />
                  <div className="p-2 text-muted-foreground bg-muted/50 rounded-full hover:bg-muted transition-colors">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expandable Form Body */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t space-y-8 bg-muted/10 mt-4">
                  {/* Primary Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Company Name</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="e.g. Acme Corp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Role Title</Label>
                      <Input
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                        placeholder="e.g. Senior Developer"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Period (e.g. 2024 — PRESENT)</Label>
                      <Input
                        value={exp.period}
                        onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                        placeholder="e.g. 2022 — 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Location (e.g. Remote / NYC)</Label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                  </div>

                  {/* Highlight Metric & Description */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Highlight Metric Badge</Label>
                      <Input
                        value={exp.highlightMetric || ""}
                        onChange={(e) => updateExperience(exp.id, { highlightMetric: e.target.value })}
                        placeholder='e.g. "5M+ requests / day"'
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Summary Description</Label>
                      <Input
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder="Brief overview of your responsibilities..."
                      />
                    </div>
                  </div>

                  {/* Bullet Points Manager */}
                  <div className="space-y-4 bg-background p-5 rounded-xl border">
                    <div className="flex items-center justify-between border-b pb-4">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <ListPlus size={16} className="text-primary" /> Accomplishment Bullets
                      </Label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addBullet(exp.id)}
                        className="h-8 gap-1"
                      >
                        <Plus size={14} /> Add Bullet
                      </Button>
                    </div>

                    <div className="space-y-3 pt-2">
                      {(exp.bullets ?? []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-3">
                          <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <Input
                            value={bullet}
                            onChange={(e) => handleBulletChange(exp.id, bIdx, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBullet(exp.id, bIdx)}
                            className="text-muted-foreground hover:text-destructive flex-shrink-0"
                            title="Remove bullet"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      {(exp.bullets ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No accomplishment bullets added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack Pills Manager */}
                  <div className="space-y-4 bg-background p-5 rounded-xl border">
                    <Label className="text-sm font-semibold flex items-center gap-2 border-b pb-4">
                      <Tag size={16} className="text-primary" /> Tech Stack Tags
                    </Label>

                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      {(exp.techStack ?? []).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechTag(exp.id, tech)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Input */}
                      <div className="flex items-center gap-2 ml-1">
                        <Input
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
                          className="h-8 text-xs w-[140px]"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => addTechTag(exp.id)}
                          className="h-8 px-3"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Actions (Visible only on small screens) */}
                  <div className="sm:hidden flex flex-wrap gap-2 pt-4 border-t">
                     <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      disabled={idx === 0}
                      onClick={() => moveExperience(idx, "up")}
                    >
                      <ArrowUp size={14} className="mr-1" /> Move Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      disabled={idx === experiences.length - 1}
                      onClick={() => moveExperience(idx, "down")}
                    >
                      <ArrowDown size={14} className="mr-1" /> Move Down
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      onClick={() => duplicateExperience(exp)}
                    >
                      <Copy size={14} className="mr-1" /> Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs h-9 mt-2"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 size={14} className="mr-1" /> Delete Position
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
