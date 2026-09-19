"use client";

import React from "react";
import { PortfolioData, SystemStats } from "@/types/portfolio";
import {
  BarChart3,
  TrendingUp,
  GitCommit,
  GitPullRequest,
  Users,
  Building,
  ShieldCheck,
  Activity,
} from "lucide-react";

interface StatsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export default function StatsTab({ data, onChange }: StatsTabProps) {
  const stats = data.stats;

  const updateStats = (fields: Partial<SystemStats>) => {
    onChange((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...fields },
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Live Stat Banner Preview */}
      <div className="glass-card rounded-xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#35E7C7]">
            <span className="w-2 h-2 rounded-full bg-[#35E7C7] animate-pulse" />
            Live Home Page Stat Strip Preview
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Rendered directly beneath Hero section
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-black/30 border border-white/5">
          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#35E7C7]">
              {(stats.githubContributions ?? 2770).toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
              GitHub Contributions
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#A88BFF]">
              {stats.usersServed ?? "1M+"}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
              EPFO Platform Users (EY)
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#FFA645]">
              {stats.b2bClients ?? 50}+
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
              B2B Clients (Mednex)
            </div>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#FF7FB0]">
              {(stats.totalCommits ?? 1500).toLocaleString()}+
            </div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mt-1">
              Production Commits
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Editor Inputs */}
      <div className="glass-card rounded-xl p-6 border border-white/10 space-y-6">
        <div className="border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-[#35E7C7]" />
            Configure Impact Figures
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Update verifiable metrics for scale, users, and open-source volume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Users size={12} className="text-zinc-500" />
              EPFO / Users Served Metric
            </label>
            <input
              type="text"
              value={stats.usersServed || "1M+"}
              onChange={(e) => updateStats({ usersServed: e.target.value })}
              placeholder="e.g. 1M+"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Displayed as EY platform throughput highlight
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Building size={12} className="text-zinc-500" />
              B2B Client Workflows (Mednex)
            </label>
            <input
              type="number"
              value={stats.b2bClients ?? 50}
              onChange={(e) => updateStats({ b2bClients: Number(e.target.value) })}
              placeholder="e.g. 50"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Autonomous GTM AI clients count
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-zinc-500" />
              GitHub Contributions
            </label>
            <input
              type="number"
              value={stats.githubContributions ?? 2770}
              onChange={(e) =>
                updateStats({ githubContributions: Number(e.target.value) })
              }
              placeholder="e.g. 2770"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Annual GitHub contribution count
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <GitCommit size={12} className="text-zinc-500" />
              Total Lifetime Commits
            </label>
            <input
              type="number"
              value={stats.totalCommits ?? 1500}
              onChange={(e) => updateStats({ totalCommits: Number(e.target.value) })}
              placeholder="e.g. 1500"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Calculated across private and public repositories
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <GitPullRequest size={12} className="text-zinc-500" />
              Public Repositories
            </label>
            <input
              type="number"
              value={stats.publicRepos ?? 56}
              onChange={(e) => updateStats({ publicRepos: Number(e.target.value) })}
              placeholder="e.g. 56"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#35E7C7]/50 font-mono"
            />
            <p className="text-[11px] text-zinc-500">
              Count of public GitHub open-source repositories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
