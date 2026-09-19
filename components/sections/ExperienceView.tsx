"use client";

import React from "react";
import { WorkExperience } from "@/types/portfolio";
import { Briefcase, Calendar, MapPin, Award, CheckCircle2 } from "lucide-react";

interface ExperienceViewProps {
  experiences: WorkExperience[];
}

export default function ExperienceView({ experiences }: ExperienceViewProps) {
  return (
    <div className="space-y-8 animate-tab-enter">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-mono tracking-widest uppercase">
          <span>—</span> ENGINEERING TIMELINE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Where I&apos;ve Shipped High-Throughput Systems
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Architecting resilient distributed backends, LLM agent graphs, and event-driven data pipelines that perform seamlessly under production loads.
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="relative border-l-2 border-teal-500/30 dark:border-teal-400/20 ml-4 pl-6 sm:pl-8 space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center shadow-md shadow-teal-400/20">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            </div>

            {/* Experience Card */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-teal-500/40">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <div className="text-base font-semibold text-teal-600 dark:text-teal-400">
                    {exp.company}
                  </div>
                </div>

                {/* Highlight badge */}
                {exp.highlightMetric && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                    <Award size={13} />
                    <span>{exp.highlightMetric}</span>
                  </div>
                )}
              </div>

              {/* Sub metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {exp.location}
                </span>
              </div>

              {/* Summary */}
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {exp.description}
              </p>

              {/* Bullets */}
              <ul className="space-y-2.5 mb-6 text-sm text-slate-600 dark:text-slate-300">
                {(exp.bullets ?? []).map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="text-teal-500 flex-shrink-0 mt-0.5"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-200/70 dark:border-white/5">
                <span className="text-[11px] font-mono uppercase text-slate-400 mr-2">
                  Stack:
                </span>
                {(exp.techStack ?? []).map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
