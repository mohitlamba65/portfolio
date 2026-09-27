"use client";

import React, { useState } from "react";
import {
  PortfolioData,
  SystemStats,
  GithubStatsConfig,
  GithubStatsOverrides,
} from "@/types/portfolio";
import { defaultGithubStatsConfig } from "@/lib/github-config";
import {
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
} from "../admin-ui";

interface StatsTabProps {
  data: PortfolioData;
  onChange: (updater: (prev: PortfolioData) => PortfolioData) => void;
  adminKey: string;
  onDataReplace?: (data: PortfolioData) => void;
}

function githubConfig(stats: SystemStats): GithubStatsConfig {
  return { ...defaultGithubStatsConfig(), ...stats.github };
}

export default function StatsTab({
  data,
  onChange,
  adminKey,
  onDataReplace,
}: StatsTabProps) {
  const stats = data.stats;
  const gh = githubConfig(stats);
  const live = gh.liveSnapshot;
  const [syncMessage, setSyncMessage] = useState("");
  const [syncing, setSyncing] = useState(false);

  const updateStats = (fields: Partial<SystemStats>) => {
    onChange((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...fields },
    }));
  };

  const updateGithub = (fields: Partial<GithubStatsConfig>) => {
    onChange((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        github: {
          ...githubConfig(prev.stats),
          ...fields,
          overrides: {
            ...githubConfig(prev.stats).overrides,
            ...(fields.overrides ?? {}),
          },
        },
      },
    }));
  };

  const setOverride = (key: keyof GithubStatsOverrides, value: boolean) => {
    updateGithub({
      overrides: { ...gh.overrides, [key]: value },
    });
  };

  const handleRefreshGithub = async () => {
    if (!adminKey) return;
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ action: "github_sync_refresh" }),
      });
      const json = (await res.json()) as { data?: PortfolioData; error?: string };
      if (!res.ok) {
        if (json.data) {
          onDataReplace?.(json.data);
        }
        throw new Error(json.error || "GitHub sync failed");
      }
      if (json.data) {
        onDataReplace?.(json.data);
      }
      setSyncMessage("GitHub stats refreshed.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      setSyncMessage(`Error: ${msg}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(""), 5000);
    }
  };

  const displayedContributions = gh.overrides?.githubContributions
    ? stats.githubContributions
    : live?.githubContributions ?? stats.githubContributions;
  const displayedRepos = gh.overrides?.publicRepos
    ? stats.publicRepos
    : live?.publicRepos ?? stats.publicRepos;
  const displayedCommits = gh.overrides?.totalCommits
    ? stats.totalCommits
    : live?.totalCommitsLastYear ?? stats.totalCommits;

  return (
    <div className="pb-8 max-w-3xl">
      <AdminFormSurface>
        <div className="mb-5 pb-4 border-b admin-border">
          <h3 className="text-base font-semibold">Scale & metrics</h3>
          <p className="admin-hint mt-0.5">
            Numbers shown in the hero stats strip and about panel. GitHub fields can sync from the
            API every 6 hours (cached).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border admin-border bg-[var(--bg-panel-2)] mb-6">
          <div>
            <div className="text-2xl font-semibold font-[family-name:var(--mono)] admin-accent">
              {(displayedContributions ?? 806).toLocaleString()}
            </div>
            <div className="admin-hint !mt-1">Total GitHub contributions</div>
          </div>
          <div>
            <div className="text-2xl font-semibold font-[family-name:var(--mono)] text-[var(--amber)]">
              {stats.usersServed ?? "1M+"}
            </div>
            <div className="admin-hint !mt-1">Users served</div>
          </div>
          <div>
            <div className="text-2xl font-semibold font-[family-name:var(--mono)] text-[var(--blue)]">
              {stats.b2bClients ?? 50}+
            </div>
            <div className="admin-hint !mt-1">B2B clients</div>
          </div>
          <div>
            <div className="text-2xl font-semibold font-[family-name:var(--mono)] text-[var(--pink)]">
              {(displayedRepos ?? 22).toLocaleString()}
            </div>
            <div className="admin-hint !mt-1">Public repos</div>
          </div>
        </div>

        <AdminFormSection title="GitHub sync">
          <div className="space-y-4 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={gh.syncEnabled === true}
                onChange={(e) => updateGithub({ syncEnabled: e.target.checked })}
                className="rounded border admin-border"
              />
              Sync contributions, commits (last year), and public repos from GitHub
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={gh.excludeForks !== false}
                onChange={(e) => updateGithub({ excludeForks: e.target.checked })}
                className="rounded border admin-border"
                disabled={!gh.syncEnabled}
              />
              Exclude forked repositories from public repo count
            </label>
            <AdminField
              label="GitHub username override"
              hint="Optional — defaults to profile GitHub URL"
            >
              <AdminInput
                value={gh.username ?? ""}
                onChange={(e) => updateGithub({ username: e.target.value || undefined })}
                placeholder="mohitlamba65"
                mono
              />
            </AdminField>
            {live ? (
              <p className="admin-hint text-xs">
                Last live snapshot: {new Date(live.fetchedAt).toLocaleString()} —{" "}
                {live.githubContributions.toLocaleString()} contributions,{" "}
                {live.totalCommitsLastYear.toLocaleString()} commits (1y),{" "}
                {live.publicRepos} repos
              </p>
            ) : null}
            {gh.lastSyncError ? (
              <p className="text-xs text-[var(--pink)]">Last error: {gh.lastSyncError}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRefreshGithub}
                disabled={syncing || !gh.syncEnabled}
                className="admin-btn admin-btn-secondary text-sm px-3 py-1.5 disabled:opacity-50"
              >
                {syncing ? "Refreshing…" : "Refresh from GitHub now"}
              </button>
              {syncMessage ? (
                <span className="text-xs admin-hint">{syncMessage}</span>
              ) : null}
            </div>
          </div>

          <p className="admin-hint text-xs mb-3">
            Pin a field to the manual value below (useful if your profile infographic differs from
            the API).
          </p>
          <div className="flex flex-wrap gap-4 mb-2">
            {(
              [
                ["githubContributions", "Pin contributions"],
                ["publicRepos", "Pin public repos"],
                ["totalCommits", "Pin commits (1y)"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={gh.overrides?.[key] === true}
                  onChange={(e) => setOverride(key, e.target.checked)}
                  disabled={!gh.syncEnabled}
                  className="rounded border admin-border"
                />
                {label}
              </label>
            ))}
          </div>
        </AdminFormSection>

        <AdminFormSection title="Edit values">
          <div className="admin-form-grid two-col">
            <AdminField
              label="GitHub contributions (fallback / pinned)"
              hint="All-time total; matches profile infographic when pinned at 806"
            >
              <AdminInput
                type="number"
                value={stats.githubContributions ?? 806}
                onChange={(e) =>
                  updateStats({ githubContributions: Number(e.target.value) })
                }
                mono
              />
            </AdminField>
            <AdminField label="Commits (last year)" hint="Shown with + suffix on site">
              <AdminInput
                type="number"
                value={stats.totalCommits ?? 150}
                onChange={(e) => updateStats({ totalCommits: Number(e.target.value) })}
                mono
              />
            </AdminField>
            <AdminField label="Public repositories">
              <AdminInput
                type="number"
                value={stats.publicRepos ?? 22}
                onChange={(e) => updateStats({ publicRepos: Number(e.target.value) })}
                mono
              />
            </AdminField>
            <AdminField label="Users served" hint="e.g. 1M+">
              <AdminInput
                value={stats.usersServed || "1M+"}
                onChange={(e) => updateStats({ usersServed: e.target.value })}
                mono
              />
            </AdminField>
            <AdminField label="B2B clients">
              <AdminInput
                type="number"
                value={stats.b2bClients ?? 50}
                onChange={(e) => updateStats({ b2bClients: Number(e.target.value) })}
                mono
              />
            </AdminField>
          </div>
          {gh.syncEnabled ? (
            <p className="admin-hint text-xs mt-3">
              On site: showing{" "}
              {(displayedContributions ?? 0).toLocaleString()} contributions,{" "}
              {(displayedCommits ?? 0).toLocaleString()}+ commits,{" "}
              {(displayedRepos ?? 0).toLocaleString()} repos (after sync / overrides).
            </p>
          ) : null}
        </AdminFormSection>
      </AdminFormSurface>
    </div>
  );
}
