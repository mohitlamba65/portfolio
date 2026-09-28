"use client";

import React, { useMemo, useState } from "react";
import {
  PortfolioData,
  SystemStats,
  GithubStatsConfig,
  GithubStatsOverrides,
  HeroStatCard,
  HeroStatBindKey,
} from "@/types/portfolio";
import { defaultGithubStatsConfig } from "@/lib/github-config";
import { defaultHeroStatCards, resolveHeroStatCards } from "@/lib/hero-stat-cards";
import { Plus, Trash2 } from "lucide-react";
import {
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
  AdminSelect,
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

  const heroCards = stats.heroCards?.length ? stats.heroCards : defaultHeroStatCards();

  const previewStats = useMemo(
    () => ({
      ...stats,
      githubContributions: displayedContributions,
      publicRepos: displayedRepos,
      totalCommits: displayedCommits,
    }),
    [stats, displayedContributions, displayedRepos, displayedCommits]
  );

  const previewCards = useMemo(() => resolveHeroStatCards(previewStats), [previewStats]);

  const updateHeroCards = (cards: HeroStatCard[]) => {
    updateStats({ heroCards: cards });
  };

  const updateHeroCard = (index: number, fields: Partial<HeroStatCard>) => {
    updateHeroCards(heroCards.map((c, i) => (i === index ? { ...c, ...fields } : c)));
  };

  const addHeroCard = () => {
    updateHeroCards([
      ...heroCards,
      {
        id: `stat-${Date.now()}`,
        label: "NEW METRIC",
        bindTo: "none",
        displayValue: "0",
      },
    ]);
  };

  const removeHeroCard = (index: number) => {
    if (heroCards.length <= 1) return;
    updateHeroCards(heroCards.filter((_, i) => i !== index));
  };

  const BIND_OPTIONS: { value: HeroStatBindKey; label: string }[] = [
    { value: "none", label: "Custom (manual value)" },
    { value: "usersServed", label: "Users reached (usersServed)" },
    { value: "productionProducts", label: "Production products" },
    { value: "githubContributions", label: "GitHub contributions" },
    { value: "publicRepos", label: "Public repos" },
    { value: "totalCommits", label: "Commits (last year)" },
    { value: "b2bClients", label: "B2B clients" },
  ];

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg border admin-border bg-[var(--bg-panel-2)] mb-6">
          {previewCards.map((card) => (
            <div key={card.id}>
              <div className="text-2xl font-semibold font-[family-name:var(--mono)] admin-accent">
                {card.staticText ?? `${card.count}${card.suffix}`}
              </div>
              <div className="admin-hint !mt-1 text-xs leading-snug">{card.label}</div>
            </div>
          ))}
        </div>

        <AdminFormSection title="Hero stat cards">
          <p className="admin-hint mb-4">
            Values and labels for the home hero strip and about stat panel. Bind each card to a data
            field or use a custom display value.
          </p>
          <div className="space-y-4">
            {heroCards.map((card, index) => (
              <div
                key={card.id}
                className="p-4 rounded-lg border admin-border bg-[var(--bg-panel-2)] space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-[family-name:var(--mono)] admin-faint">
                    Card {index + 1}
                  </span>
                  {heroCards.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeHeroCard(index)}
                      className="admin-faint hover:text-red-400 p-1"
                      aria-label="Remove stat card"
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
                <div className="admin-form-grid two-col">
                  <AdminField label="Label (heading)">
                    <AdminInput
                      value={card.label}
                      onChange={(e) => updateHeroCard(index, { label: e.target.value })}
                      placeholder="USERS REACHED"
                    />
                  </AdminField>
                  <AdminField label="Data source">
                    <AdminSelect
                      value={card.bindTo ?? "none"}
                      onChange={(e) =>
                        updateHeroCard(index, { bindTo: e.target.value as HeroStatBindKey })
                      }
                    >
                      {BIND_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </AdminSelect>
                  </AdminField>
                  <AdminField label="Suffix" hint="e.g. + or M+ (animated numbers)">
                    <AdminInput
                      value={card.suffix ?? ""}
                      onChange={(e) => updateHeroCard(index, { suffix: e.target.value })}
                      placeholder="+"
                      mono
                    />
                  </AdminField>
                  <AdminField
                    label="Custom display"
                    hint="When source is Custom, e.g. 1M+"
                  >
                    <AdminInput
                      value={card.displayValue ?? ""}
                      onChange={(e) => updateHeroCard(index, { displayValue: e.target.value })}
                      placeholder="1M+"
                      mono
                    />
                  </AdminField>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addHeroCard}
            className="admin-btn-accent-soft mt-3"
          >
            <Plus size={14} />
            Add stat card
          </button>
        </AdminFormSection>

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
              hint="Pinned/manual total; card suffix controls + display"
            >
              <AdminInput
                type="number"
                value={stats.githubContributions ?? 800}
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
            <AdminField label="Production products">
              <AdminInput
                type="number"
                value={stats.productionProducts ?? 2}
                onChange={(e) =>
                  updateStats({ productionProducts: Number(e.target.value) })
                }
                mono
              />
            </AdminField>
            <AdminField label="B2B clients" hint="Optional — bind a stat card if needed">
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
