"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Download, Terminal, Sparkles } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import Hero3DNetwork from "@/components/3d/Hero3DNetwork";

interface AboutViewProps {
  data: PortfolioData;
}

export default function AboutView({ data }: AboutViewProps) {
  const { profile, stats } = data;

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center py-6">
      {/* Interactive 3D Three.js Background */}
      <Hero3DNetwork />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Headline & Story Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-mono tracking-widest uppercase">
            <span>—</span> ABOUT & ARCHITECTURE
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
            {profile.headline}
          </h1>

          {/* Bio Paragraphs */}
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            {profile.bioParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-semibold shadow-lg shadow-teal-500/25 transition-all duration-200"
            >
              <span>Explore Scale & Experience</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/skills"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-medium backdrop-blur-lg transition-all"
            >
              <Sparkles size={16} className="text-teal-500 dark:text-teal-400" />
              <span>3D Tech Constellation</span>
            </Link>

            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-sm transition-all"
            >
              <Download size={15} />
              <span>Resume PDF</span>
            </a>
          </div>
        </div>

        {/* Right Cards Column (Profile Showcase + Metrics) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Profile Showcase Card */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-teal-500/40">
            <div className="flex items-center gap-4">
              {/* Profile Card Photo (Distinct from Navbar avatar!) */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-teal-500/50 bg-slate-950 flex-shrink-0 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profilePhotoUrl || "/default-avatar.svg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono tracking-wider text-teal-600 dark:text-teal-400 font-bold uppercase">
                  {profile.roleTitle}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile.subTitle}
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 font-mono">
              Status: <span className="text-teal-600 dark:text-teal-300 font-medium">{profile.availabilityStatus}</span>
            </div>
          </div>

          {/* Metric Cards Grid (Matching screenshot numbers!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-md transition-all hover:border-teal-500/30">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                USERS ON SYSTEMS I&apos;VE SHIPPED
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                {stats.usersServed}
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-md transition-all hover:border-teal-500/30">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                PUBLIC ACTIVITY SIGNAL
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                {stats.publicActivitySignal}
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-md transition-all hover:border-teal-500/30">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                SYSTEMS & PIPELINES
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-500 dark:text-amber-400">
                {stats.systemsShipped}
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-md transition-all hover:border-teal-500/30">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                PRODUCTION RELIABILITY
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-500 dark:text-cyan-400">
                {stats.uptimeSla}
              </div>
            </div>
          </div>

          {/* Quick Terminal Launcher */}
          <Link
            href="/contact"
            className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono text-xs transition-all group"
          >
            <span className="flex items-center gap-2">
              <Terminal size={15} />
              <span>&gt; launch_interactive_contact_terminal()</span>
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
