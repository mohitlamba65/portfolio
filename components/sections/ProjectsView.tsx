"use client";

import React from "react";
import { Project } from "@/types/portfolio";
import { ExternalLink, Cpu, Activity, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectsViewProps {
  projects: Project[];
}

export default function ProjectsView({ projects }: ProjectsViewProps) {
  return (
    <div className="space-y-8 animate-tab-enter">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-mono tracking-widest uppercase">
          <span>—</span> FEATURED ARCHITECTURES
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Systems Built for Scale & Autonomy
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Deep dives into production-grade systems, agentic state machines, and event routers.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-teal-500/40 hover:-translate-y-1 group"
          >
            <div>
              {/* Card top icons */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  <Cpu size={18} />
                </div>
                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-white/10 transition-colors"
                      title="Live System Link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors mb-2">
                {proj.title}
              </h3>
              <p className="text-xs font-mono text-teal-600 dark:text-teal-400 font-medium mb-3">
                {proj.tagline}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Performance Metrics */}
              {proj.metrics && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs font-mono text-amber-600 dark:text-amber-400 mb-4">
                  <Activity size={14} className="flex-shrink-0" />
                  <span>{proj.metrics}</span>
                </div>
              )}

              {/* Architecture Highlight */}
              {proj.architectureNotes && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200/50 dark:border-white/5">
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">
                    Arch:{" "}
                  </span>
                  {proj.architectureNotes}
                </div>
              )}
            </div>

            {/* Tech stack badges */}
            <div className="pt-4 border-t border-slate-200/70 dark:border-white/5 flex flex-wrap gap-1.5">
              {proj.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
