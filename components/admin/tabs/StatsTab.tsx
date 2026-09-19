"use client";

import React from "react";
import { PortfolioData, SystemStats } from "@/types/portfolio";
import { BarChart3, TrendingUp, GitCommit, GitPullRequest, Users, Building, ShieldCheck } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[var(--cyan)] font-mono text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
            SCALE & TELEMETRY MODULE
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-sans">
            Impact, Scale & Activity Metrics
          </h2>
          <p className="text-xs text-[var(--text-dim)] font-mono mt-1">
            These figures power the high-impact stat strip on the Home panel and the About metrics sidebar.
          </p>
        </div>
      </div>

      {/* LIVE .DASH-STRIP PREVIEW */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-[var(--cyan)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-ping" />
          Live Home Stat-Strip Preview (Rendered exactly as on live site)
        </span>

        <div className="flex gap-0 border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--bg-panel)] flex-wrap shadow-xl">
          <div className="flex-1 min-w-[140px] p-5 border-r border-[var(--line)]">
            <div className="text-2xl font-bold font-heading text-[var(--cyan)]">
              {(stats.githubContributions ?? 2770).toLocaleString()}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-dim)] mt-1">
              GitHub Contributions
            </div>
          </div>

          <div className="flex-1 min-w-[140px] p-5 border-r border-[var(--line)]">
            <div className="text-2xl font-bold font-heading text-[var(--cyan)]">
              {(stats.totalCommits ?? 1500).toLocaleString()}+
            </div>
            <div className="text-[11px] font-mono text-[var(--text-dim)] mt-1">
              Total Commits
            </div>
          </div>

          <div className="flex-1 min-w-[140px] p-5 border-r border-[var(--line)]">
            <div className="text-2xl font-bold font-heading text-[var(--cyan)]">
              {stats.usersServed || "1M+"}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-dim)] mt-1">
              Users on Systems Shipped
            </div>
          </div>

          <div className="flex-1 min-w-[140px] p-5">
            <div className="text-2xl font-bold font-heading text-[var(--cyan)]">
              {stats.publicRepos ?? 56}
            </div>
            <div className="text-[11px] font-mono text-[var(--text-dim)] mt-1">
              Public Repositories
            </div>
          </div>
        </div>
      </div>

      {/* Metric Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GitHub Contributions */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--cyan)]/10 text-[var(--cyan)] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                GitHub Contributions
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Annual/Total public activity
              </span>
            </div>
          </div>

          <input
            type="number"
            value={stats.githubContributions ?? 2770}
            onChange={(e) =>
              updateStats({ githubContributions: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-[var(--cyan)] focus:outline-none focus:border-[var(--cyan)]"
          />
        </div>

        {/* Total Commits */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--violet)]/10 text-[var(--violet)] flex items-center justify-center">
              <GitCommit size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                Total Commits
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                e.g. 1500 (displayed as 1,500+)
              </span>
            </div>
          </div>

          <input
            type="number"
            value={stats.totalCommits ?? 1500}
            onChange={(e) =>
              updateStats({ totalCommits: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-[var(--violet)] focus:outline-none focus:border-[var(--violet)]"
          />
        </div>

        {/* Users on Systems Shipped */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--amber)]/10 text-[var(--amber)] flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                Users on Systems Shipped
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Text or formatted string (e.g. 1M+, 500K)
              </span>
            </div>
          </div>

          <input
            type="text"
            value={stats.usersServed || "1M+"}
            onChange={(e) => updateStats({ usersServed: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-[var(--amber)] focus:outline-none focus:border-[var(--amber)]"
          />
        </div>

        {/* Public Repositories */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--pink)]/10 text-[var(--pink)] flex items-center justify-center">
              <GitPullRequest size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                Public Repositories
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Count of open source repos
              </span>
            </div>
          </div>

          <input
            type="number"
            value={stats.publicRepos ?? 56}
            onChange={(e) =>
              updateStats({ publicRepos: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-[var(--pink)] focus:outline-none focus:border-[var(--pink)]"
          />
        </div>

        {/* B2B Clients */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--blue)]/10 text-[var(--blue)] flex items-center justify-center">
              <Building size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                B2B Enterprise Clients
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Clients / Companies powered
              </span>
            </div>
          </div>

          <input
            type="number"
            value={stats.b2bClients ?? 50}
            onChange={(e) =>
              updateStats({ b2bClients: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-[var(--blue)] focus:outline-none focus:border-[var(--blue)]"
          />
        </div>

        {/* Uptime SLA */}
        <div className="p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[var(--text)] font-semibold">
                Production Uptime SLA
              </label>
              <span className="text-[11px] font-mono text-[var(--text-dim)]">
                Service Reliability Target
              </span>
            </div>
          </div>

          <input
            type="text"
            value={stats.uptimeSla || "99.9%"}
            onChange={(e) => updateStats({ uptimeSla: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-panel-2)] border border-[var(--line)] text-lg font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
