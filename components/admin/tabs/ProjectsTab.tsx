"use client";

import React, { useState } from "react";
import { PortfolioData, Project } from "@/types/portfolio";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminDetails,
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
  AdminListItem,
  AdminListLayout,
  AdminListPanel,
  AdminSelect,
  AdminTextarea,
} from "../admin-ui";

interface ProjectsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function ProjectsTab({ data, onChange }: ProjectsTabProps) {
  const projects = data.projects;
  const [selectedId, setSelectedId] = useState<string | null>(projects[0]?.id ?? null);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  const updateProjects = (next: Project[]) => {
    onChange((prev) => ({ ...prev, projects: next }));
  };

  const handleUpdate = (id: string, fields: Partial<Project>) => {
    updateProjects(projects.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  };

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      title: "New Project",
      description: "",
      status: "live",
      techStack: [],
      featured: false,
    };
    updateProjects([...projects, newProject]);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    const next = projects.filter((p) => p.id !== id);
    updateProjects(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }
  };

  const handleAddTag = (projectId: string, tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.techStack?.includes(trimmed)) return;
    handleUpdate(projectId, { techStack: [...(project.techStack || []), trimmed] });
  };

  const handleRemoveTag = (projectId: string, tagIndex: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project?.techStack) return;
    handleUpdate(projectId, {
      techStack: project.techStack.filter((_, i) => i !== tagIndex),
    });
  };

  return (
    <div className="pb-8">
      <AdminListLayout
        list={
          <AdminListPanel
            title="Projects"
            action={
              <button type="button" onClick={handleAddProject} className="admin-btn-accent-soft !px-2 !py-1">
                <Plus size={14} />
              </button>
            }
          >
            {projects.length === 0 ? (
              <p className="admin-hint px-2 py-4 text-center">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <AdminListItem
                  key={project.id}
                  active={project.id === selectedId}
                  title={project.title}
                  meta={project.status || "live"}
                  onClick={() => setSelectedId(project.id)}
                />
              ))
            )}
          </AdminListPanel>
        }
        form={
          selected ? (
            <AdminFormSurface>
              <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b admin-border">
                <div>
                  <h3 className="text-base font-semibold">Edit project</h3>
                  <p className="admin-hint mt-0.5">Changes appear on the Work section after you save.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id)}
                  className="admin-btn-secondary hover:!text-red-400 hover:!border-red-500/30"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>

              <AdminFormSection title="Basics">
                <div className="admin-form-grid two-col">
                  <AdminField label="Title">
                    <AdminInput
                      value={selected.title}
                      onChange={(e) => handleUpdate(selected.id, { title: e.target.value })}
                      placeholder="Project name"
                    />
                  </AdminField>
                  <AdminField label="Status">
                    <AdminSelect
                      value={selected.status || "live"}
                      onChange={(e) =>
                        handleUpdate(selected.id, {
                          status: e.target.value as "live" | "building" | "private",
                        })
                      }
                    >
                      <option value="live">Live</option>
                      <option value="building">Building</option>
                      <option value="private">Private</option>
                    </AdminSelect>
                  </AdminField>
                </div>
                <AdminField label="Description">
                  <AdminTextarea
                    value={selected.description}
                    onChange={(e) => handleUpdate(selected.id, { description: e.target.value })}
                    placeholder="What you built and why it matters..."
                    className="min-h-[120px]"
                  />
                </AdminField>
              </AdminFormSection>

              <AdminFormSection title="Links">
                <div className="admin-form-grid two-col">
                  <AdminField label="GitHub URL">
                    <AdminInput
                      value={selected.githubUrl || ""}
                      onChange={(e) => handleUpdate(selected.id, { githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      mono
                    />
                  </AdminField>
                  <AdminField label="Live demo URL" hint="Optional">
                    <AdminInput
                      value={selected.liveUrl || ""}
                      onChange={(e) => handleUpdate(selected.id, { liveUrl: e.target.value })}
                      placeholder="https://..."
                      mono
                    />
                  </AdminField>
                </div>
              </AdminFormSection>

              <AdminFormSection title="Tech stack">
                <AdminField label="Technologies" hint="Type a name and press Enter">
                  <div className="admin-tag-box">
                    {selected.techStack?.map((tag, tIdx) => (
                      <span key={tIdx} className="admin-tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(selected.id, tIdx)}
                          className="admin-faint hover:text-red-400"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add technology..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddTag(selected.id, e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="admin-input !border-none !bg-transparent !shadow-none !p-1 flex-1 min-w-[120px]"
                    />
                  </div>
                </AdminField>
              </AdminFormSection>

              <AdminDetails summary="Optional display fields">
                <div className="admin-form-grid two-col">
                  <AdminField label="Card label" hint="Small text above the title">
                    <AdminInput
                      value={selected.eyebrow || ""}
                      onChange={(e) => handleUpdate(selected.id, { eyebrow: e.target.value })}
                      placeholder="e.g. WHATSAPP → LLM → TOOLS"
                    />
                  </AdminField>
                  <AdminField label="Subtitle" hint="Shown under the title">
                    <AdminInput
                      value={selected.provenance || selected.tagline || ""}
                      onChange={(e) =>
                        handleUpdate(selected.id, {
                          provenance: e.target.value,
                          tagline: e.target.value,
                        })
                      }
                      placeholder="e.g. Built and maintained solo"
                    />
                  </AdminField>
                  <AdminField label="Highlight number">
                    <AdminInput
                      value={selected.heroStat?.value || ""}
                      onChange={(e) =>
                        handleUpdate(selected.id, {
                          heroStat: {
                            value: e.target.value,
                            label: selected.heroStat?.label || "",
                          },
                        })
                      }
                      placeholder="e.g. 100%"
                    />
                  </AdminField>
                  <AdminField label="Highlight label">
                    <AdminInput
                      value={selected.heroStat?.label || ""}
                      onChange={(e) =>
                        handleUpdate(selected.id, {
                          heroStat: {
                            value: selected.heroStat?.value || "",
                            label: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. async, webhook-driven"
                    />
                  </AdminField>
                </div>
                <AdminField label="Status badge text">
                  <AdminInput
                    value={selected.statusLabel || ""}
                    onChange={(e) => handleUpdate(selected.id, { statusLabel: e.target.value })}
                    placeholder="e.g. LIVE ON GITHUB"
                  />
                </AdminField>
                <label className="flex items-center gap-2 text-sm admin-muted cursor-pointer select-none mt-2">
                  <input
                    type="checkbox"
                    checked={selected.featured || false}
                    onChange={(e) => handleUpdate(selected.id, { featured: e.target.checked })}
                    className="w-4 h-4 rounded border admin-border accent-[var(--cyan)]"
                  />
                  Mark as featured
                </label>
              </AdminDetails>
            </AdminFormSurface>
          ) : (
            <div className="admin-form-surface admin-form-empty">
              {projects.length === 0
                ? "Add a project to get started."
                : "Select a project from the list."}
            </div>
          )
        }
      />
    </div>
  );
}
