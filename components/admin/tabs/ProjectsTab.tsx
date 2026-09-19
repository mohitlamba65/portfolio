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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            PROJECT REGISTRY
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-sans">
            Systems & Projects Showcase
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            Manage your flagship systems, architecture cards, live deployments, and metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--cyan)] hover:brightness-110 text-[#04120F] font-mono text-xs font-bold transition-all shadow-lg shadow-[var(--cyan)]/20 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const isExpanded = expandedId === proj.id;

          return (
            <div
              key={proj.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "bg-[var(--bg-panel)] border-[var(--cyan)]/50 shadow-xl"
                  : "bg-[var(--bg-panel)]/70 border-[var(--line)] hover:border-[var(--line)]"
              }`}
            >
              {/* Card Header Bar */}
              <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] font-mono text-xs font-bold flex-shrink-0">
                    <FolderGit2 size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-[var(--text)] font-sans truncate">
                        {proj.title || "Untitled Project"}
                      </h3>
                      {proj.statusLabel && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {proj.statusLabel}
                        </span>
                      )}
                      {proj.featured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--amber)]/10 text-[var(--amber)] border border-[var(--amber)]/30 flex items-center gap-1">
                          <Star size={10} className="fill-[var(--amber)]" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-[var(--text-dim)] truncate mt-0.5">
                      {proj.eyebrow || proj.tagline || "System Architecture"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveProject(idx, "up")}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => moveProject(idx, "down")}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateProject(proj)}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer"
                    title="Duplicate Project"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-rose-400 cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="w-[1px] h-4 bg-[var(--line)] mx-1" />
                  <div className="p-1 text-[var(--text-dim)]">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Form Body */}
              {isExpanded && (
                <div className="p-6 pt-2 border-t border-[var(--line)] space-y-6">
                  {/* Primary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Architecture Flow / Eyebrow Tag
                      </label>
                      <input
                        type="text"
                        value={proj.eyebrow || ""}
                        onChange={(e) => updateProject(proj.id, { eyebrow: e.target.value })}
                        placeholder="e.g. WHATSAPP → LLM AGENT → TOOLS"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Provenance / Authorship
                      </label>
                      <input
                        type="text"
                        value={proj.provenance || ""}
                        onChange={(e) => updateProject(proj.id, { provenance: e.target.value })}
                        placeholder="e.g. Built and maintained solo"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Quick Tagline
                      </label>
                      <input
                        type="text"
                        value={proj.tagline || ""}
                        onChange={(e) => updateProject(proj.id, { tagline: e.target.value })}
                        placeholder="One-line elevator pitch for this system"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Full Technical Description
                      </label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--cyan)] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Status, Metric, and Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Status Label
                      </label>
                      <input
                        type="text"
                        value={proj.statusLabel || ""}
                        onChange={(e) => updateProject(proj.id, { statusLabel: e.target.value })}
                        placeholder="e.g. LIVE ON GITHUB"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Hero Metric Value
                      </label>
                      <input
                        type="text"
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
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Hero Metric Label
                      </label>
                      <input
                        type="text"
                        value={proj.heroStat?.label || ""}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            heroStat: {
                              value: proj.heroStat?.value || "100%",
                              label: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. async, webhook-driven"
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-sm font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1">
                        Featured Showcase
                      </label>
                      <button
                        type="button"
                        onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                        className={`w-full py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          proj.featured
                            ? "bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/30"
                            : "bg-[var(--bg-panel-2)] text-[var(--text-dim)] border-[var(--line)]"
                        }`}
                      >
                        <Star size={14} className={proj.featured ? "fill-[var(--amber)]" : ""} />
                        <span>{proj.featured ? "Featured on Home" : "Standard Project"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1 flex items-center gap-1.5">
                        <ExternalLink size={12} /> Live Deployment URL
                      </label>
                      <input
                        type="text"
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-xs font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[var(--text-dim)] mb-1 flex items-center gap-1.5">
                        <GitBranch size={12} /> GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-[var(--text)] text-xs font-mono focus:outline-none focus:border-[var(--cyan)]"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase text-[var(--text-dim)] flex items-center gap-1.5">
                      <Tag size={14} /> Technologies Used
                    </label>

                    <div className="flex flex-wrap gap-2 items-center">
                      {(proj.techStack ?? []).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--line)] text-xs font-mono text-[var(--text)]"
                        >
                          <span>{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechTag(proj.id, tech)}
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
                          className="px-3 py-1 rounded-full bg-[var(--bg-panel-2)] border border-[var(--line)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--cyan)] w-32"
                        />
                        <button
                          type="button"
                          onClick={() => addTechTag(proj.id)}
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
