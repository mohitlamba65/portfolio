"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/types/portfolio";
import {
  FolderGit2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  ExternalLink,
  Search,
  Tag,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ProjectsTab({ data, onChange }: ProjectsTabProps) {
  const projects = data.projects;
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const updateProjects = (newProjects: Project[]) => {
    onChange((prev) => ({
      ...prev,
      projects: newProjects,
    }));
  };

  const handleUpdate = (id: string, fields: Partial<Project>) => {
    const next = projects.map((p) => (p.id === id ? { ...p, ...fields } : p));
    updateProjects(next);
  };

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      title: "New Backend Engineering Project",
      tagline: "High-throughput distributed data engine",
      eyebrow: "DISTRIBUTED SYSTEMS // CLOUD",
      provenance: "Built and maintained in production",
      description:
        "Designed and implemented an event-driven system handling asynchronous message streams with fault tolerance and real-time observability.",
      status: "live",
      statusLabel: "PRODUCTION READY",
      heroStat: {
        value: "10K+",
        label: "events / sec",
      },
      techStack: ["TypeScript", "Node.js", "Redis", "Docker"],
      githubUrl: "https://github.com/mohitlamba65",
      liveUrl: "",
      featured: false,
    };
    updateProjects([newProject, ...projects]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    updateProjects(projects.filter((p) => p.id !== id));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateProjects(copy);
  };

  const handleAddTag = (projectId: string, tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    if (project.techStack?.includes(trimmed)) return;
    handleUpdate(projectId, {
      techStack: [...(project.techStack || []), trimmed],
    });
  };

  const handleRemoveTag = (projectId: string, tagIndex: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project || !project.techStack) return;
    handleUpdate(projectId, {
      techStack: project.techStack.filter((_, i) => i !== tagIndex),
    });
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar (JobTracker Style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, stack, or keywords..."
            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 transition-all"
          />
        </div>

        {/* Project Count & Add Button */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400 px-3 py-2 rounded-lg bg-white/5 border border-white/10 shrink-0">
            {projects.length} Total Projects
          </span>
          <button
            type="button"
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-[#35E7C7] text-[#0B0F17] rounded-lg text-sm font-semibold hover:bg-[#35E7C7]/90 transition-all shadow-[0_0_15px_rgba(53,231,199,0.3)] cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project, index) => {
          const isExpanded = expandedId === project.id;

          return (
            <div
              key={project.id}
              className="glass-card rounded-xl border border-white/10 overflow-hidden transition-all duration-200"
            >
              {/* Project Card Header / Accordion Bar */}
              <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] select-none border-b border-white/5"
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#35E7C7]/10 text-[#35E7C7] flex items-center justify-center shrink-0 border border-[#35E7C7]/20">
                    <FolderGit2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white truncate">
                        {project.title || "Untitled Project"}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                          <Star size={10} className="fill-amber-400" />
                          Featured
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-400 border border-white/10">
                        {project.status || "live"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {project.tagline || project.description}
                    </p>
                  </div>
                </div>

                {/* Right Side Control Buttons */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="Move project up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1}
                    onClick={() => handleMove(index, "down")}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="Move project down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors ml-1"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="p-6 space-y-5 bg-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleUpdate(project.id, { title: e.target.value })}
                        placeholder="e.g. Distributed Agent Orchestrator"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Status / Visibility
                      </label>
                      <select
                        value={project.status || "live"}
                        onChange={(e) =>
                          handleUpdate(project.id, {
                            status: e.target.value as "live" | "building" | "private",
                          })
                        }
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      >
                        <option value="live">Live in Production</option>
                        <option value="building">Currently Building</option>
                        <option value="private">Private / Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Tagline / Sub-heading
                      </label>
                      <input
                        type="text"
                        value={project.tagline || ""}
                        onChange={(e) => handleUpdate(project.id, { tagline: e.target.value })}
                        placeholder="e.g. High-throughput distributed message processing"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Provenance / Eyebrow Text
                      </label>
                      <input
                        type="text"
                        value={project.provenance || ""}
                        onChange={(e) =>
                          handleUpdate(project.id, { provenance: e.target.value })
                        }
                        placeholder="e.g. ENTERPRISE MESSAGING INFRASTRUCTURE"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 focus:border-[#35E7C7]/50 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Impact Metric & Starred Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <BarChart2 size={12} className="text-[#35E7C7]" />
                        Key Metric Value
                      </label>
                      <input
                        type="text"
                        value={project.heroStat?.value || ""}
                        onChange={(e) =>
                          handleUpdate(project.id, {
                            heroStat: {
                              value: e.target.value,
                              label: project.heroStat?.label || "",
                            },
                          })
                        }
                        placeholder="e.g. 1M+ or 99.9%"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-[#35E7C7] font-bold focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        Metric Label
                      </label>
                      <input
                        type="text"
                        value={project.heroStat?.label || ""}
                        onChange={(e) =>
                          handleUpdate(project.id, {
                            heroStat: {
                              value: project.heroStat?.value || "",
                              label: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Events / day"
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-center gap-3 pt-4 sm:pt-0">
                      <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={project.featured || false}
                          onChange={(e) =>
                            handleUpdate(project.id, { featured: e.target.checked })
                          }
                          className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#35E7C7] focus:ring-[#35E7C7]"
                        />
                        <span>Featured on Home</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Case Study Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        handleUpdate(project.id, { description: e.target.value })
                      }
                      placeholder="Describe what was built, key technical challenges, architectural decisions, and measurable outcomes..."
                      className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 resize-y leading-relaxed"
                    />
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <GithubIcon size={12} className="text-zinc-500" />
                        GitHub Repository URL
                      </label>
                      <input
                        type="text"
                        value={project.githubUrl || ""}
                        onChange={(e) =>
                          handleUpdate(project.id, { githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                        <ExternalLink size={12} className="text-zinc-500" />
                        Live Demo / Production URL
                      </label>
                      <input
                        type="text"
                        value={project.liveUrl || ""}
                        onChange={(e) =>
                          handleUpdate(project.id, { liveUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg py-2 px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* Stack Tags */}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
                      <Tag size={12} className="text-zinc-500" />
                      Technologies & Tech Stack
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/10">
                      {project.techStack?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/10 text-zinc-300 group/tag"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(project.id, tIdx)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        placeholder="+ Add tech (press Enter)"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleAddTag(project.id, e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="bg-transparent border-none text-xs text-white placeholder:text-zinc-600 focus:outline-none py-1 px-2 font-mono min-w-[150px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center glass-card rounded-xl border border-white/10 space-y-3">
            <FolderGit2 size={32} className="text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400">No projects found matching search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
