"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/types/portfolio";
import {
  FolderGit2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  GitBranch,
  Tag,
  Star,
  X,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProjectsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ProjectsTab({ data, onChange }: ProjectsTabProps) {
  const projects = data.projects;
  const [expandedId, setExpandedId] = useState<string | null>(
    projects[0]?.id || null
  );
  const [newTagInput, setNewTagInput] = useState<Record<string, string>>({});

  const updateProject = (id: string, fields: Partial<Project>) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...fields } : proj
      ),
    }));
  };

  const addProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: Project = {
      id: newId,
      title: "New Flagship System",
      tagline: "High-performance distributed system engineered for scale.",
      eyebrow: "BACKEND → DATA STREAM → AI ENGINE",
      provenance: "Built and maintained solo",
      description: "Production-ready backend handling real-time data ingestion and multi-agent coordination.",
      status: "live",
      statusLabel: "LIVE IN PRODUCTION",
      heroStat: {
        value: "99.99%",
        label: "uptime SLA",
      },
      metrics: "Sub-50ms latency across global clusters",
      architectureNotes: "Event-driven asynchronous message queuing with partitioned data stores.",
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/repo",
      featured: true,
    };

    onChange((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
    setExpandedId(newId);
  };

  const removeProject = (id: string) => {
    if (projects.length <= 1) return;
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const duplicateProject = (proj: Project) => {
    const dupId = `proj-${Date.now()}`;
    const duplicate: Project = {
      ...proj,
      id: dupId,
      title: `${proj.title} (Copy)`,
    };
    onChange((prev) => ({
      ...prev,
      projects: [...prev.projects, duplicate],
    }));
    setExpandedId(dupId);
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onChange((prev) => ({
      ...prev,
      projects: list,
    }));
  };

  // Tech stack handlers
  const addTechTag = (projId: string) => {
    const tag = (newTagInput[projId] || "").trim();
    if (!tag) return;
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const stack = proj.techStack ?? [];
    if (!stack.includes(tag)) {
      updateProject(projId, { techStack: [...stack, tag] });
    }
    setNewTagInput((prev) => ({ ...prev, [projId]: "" }));
  };

  const removeTechTag = (projId: string, tagToRemove: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, {
      techStack: (proj.techStack ?? []).filter((t) => t !== tagToRemove),
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
              Project Registry
            </div>
            <CardTitle className="text-2xl">Systems & Projects Showcase</CardTitle>
            <CardDescription className="mt-1">
              Manage your flagship systems, architecture cards, live deployments, and metrics.
            </CardDescription>
          </div>

          <Button onClick={addProject} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={16} />
            Add Project
          </Button>
        </CardHeader>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const isExpanded = expandedId === proj.id;

          return (
            <Card
              key={proj.id}
              className={`transition-all duration-200 overflow-hidden border-2 ${
                isExpanded ? "border-primary/50 shadow-md" : "border-border hover:border-primary/30"
              }`}
            >
              {/* Card Header Bar */}
              <div
                className="p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none bg-card"
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    <FolderGit2 size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-semibold truncate">
                        {proj.title || "Untitled Project"}
                      </h3>
                      {proj.statusLabel && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {proj.statusLabel}
                        </span>
                      )}
                      {proj.featured && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
                          <Star size={10} className="fill-amber-500" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {proj.eyebrow || proj.tagline || "System Architecture"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
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
                      onClick={() => moveProject(idx, "up")}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
                      disabled={idx === projects.length - 1}
                      onClick={() => moveProject(idx, "down")}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </Button>
                    <div className="w-[1px] h-4 bg-border mx-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background"
                      onClick={() => duplicateProject(proj)}
                      title="Duplicate Project"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeProject(proj.id)}
                      title="Delete Project"
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

              {/* Form Body */}
              {isExpanded && (
                <div className="p-6 pt-0 border-t space-y-8 bg-muted/10 mt-4">
                  {/* Primary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Project Title</Label>
                      <Input
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder="e.g. Acme Corp System"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Architecture Flow / Eyebrow Tag</Label>
                      <Input
                        value={proj.eyebrow || ""}
                        onChange={(e) => updateProject(proj.id, { eyebrow: e.target.value })}
                        placeholder="e.g. WHATSAPP → LLM AGENT → TOOLS"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Provenance / Authorship</Label>
                      <Input
                        value={proj.provenance || ""}
                        onChange={(e) => updateProject(proj.id, { provenance: e.target.value })}
                        placeholder="e.g. Built and maintained solo"
                      />
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Quick Tagline</Label>
                      <Input
                        value={proj.tagline || ""}
                        onChange={(e) => updateProject(proj.id, { tagline: e.target.value })}
                        placeholder="One-line elevator pitch for this system"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Full Technical Description</Label>
                      <Textarea
                        rows={4}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        placeholder="Detailed technical description..."
                        className="resize-y"
                      />
                    </div>
                  </div>

                  {/* Status, Metric, and Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Status Label</Label>
                      <Input
                        value={proj.statusLabel || ""}
                        onChange={(e) => updateProject(proj.id, { statusLabel: e.target.value })}
                        placeholder="e.g. LIVE ON GITHUB"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Hero Metric Value</Label>
                      <Input
                        value={proj.heroStat?.value || ""}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            heroStat: {
                              value: e.target.value,
                              label: proj.heroStat?.label || "metric",
                            },
                          })
                        }
                        placeholder="e.g. 100%"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Hero Metric Label</Label>
                      <Input
                        value={proj.heroStat?.label || ""}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            heroStat: {
                              value: proj.heroStat?.value || "100%",
                              label: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. uptime SLA"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Featured Showcase</Label>
                      <Button
                        variant={proj.featured ? "outline" : "secondary"}
                        className={`w-full justify-center gap-2 h-10 ${
                          proj.featured
                            ? "bg-amber-500/10 text-amber-500 hover:text-amber-600 hover:bg-amber-500/20 border-amber-500/30"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                      >
                        <Star size={16} className={proj.featured ? "fill-amber-500 text-amber-500" : ""} />
                        <span>{proj.featured ? "Featured on Home" : "Standard Project"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background p-5 rounded-xl border">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                        <ExternalLink size={14} className="text-primary" /> Live Deployment URL
                      </Label>
                      <Input
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                        <GitBranch size={14} className="text-primary" /> GitHub Repository URL
                      </Label>
                      <Input
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="space-y-4 bg-background p-5 rounded-xl border">
                    <Label className="text-sm font-semibold flex items-center gap-2 border-b pb-4">
                      <Tag size={16} className="text-primary" /> Technologies Used
                    </Label>

                    <div className="flex flex-wrap gap-2 items-center pt-2">
                      {(proj.techStack ?? []).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechTag(proj.id, tech)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}

                      {/* Add Tag Input */}
                      <div className="flex items-center gap-2 ml-1">
                        <Input
                          value={newTagInput[proj.id] || ""}
                          onChange={(e) =>
                            setNewTagInput((prev) => ({ ...prev, [proj.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTechTag(proj.id);
                            }
                          }}
                          placeholder="+ Add tech tag..."
                          className="h-8 text-xs w-[140px]"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => addTechTag(proj.id)}
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
                      onClick={() => moveProject(idx, "up")}
                    >
                      <ArrowUp size={14} className="mr-1" /> Move Up
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      disabled={idx === projects.length - 1}
                      onClick={() => moveProject(idx, "down")}
                    >
                      <ArrowDown size={14} className="mr-1" /> Move Down
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-9"
                      onClick={() => duplicateProject(proj)}
                    >
                      <Copy size={14} className="mr-1" /> Duplicate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs h-9 mt-2"
                      onClick={() => removeProject(proj.id)}
                    >
                      <Trash2 size={14} className="mr-1" /> Delete Project
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
