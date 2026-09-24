"use client";

import React from "react";
import { PortfolioData, SystemStats } from "@/types/portfolio";
import {
  AdminField,
  AdminFormSection,
  AdminFormSurface,
  AdminInput,
} from "../admin-ui";

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
    <div className="pb-8 max-w-3xl">
      <AdminFormSurface>
        <div className="mb-5 pb-4 border-b admin-border">
          <h3 className="text-base font-semibold">Scale & metrics</h3>
          <p className="admin-hint mt-0.5">Numbers shown in the hero stats strip and about panel.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border admin-border bg-[var(--bg-panel-2)] mb-6">
          <div>
            <div className="text-2xl font-semibold font-[family-name:var(--mono)] admin-accent">
              {(stats.githubContributions ?? 2770).toLocaleString()}
            </div>
            <div className="admin-hint !mt-1">GitHub contributions</div>
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
              {(stats.publicRepos ?? 56).toLocaleString()}
            </div>
            <div className="admin-hint !mt-1">Public repos</div>
          </div>
        </div>

        <AdminFormSection title="Edit values">
          <div className="admin-form-grid two-col">
            <AdminField label="GitHub contributions">
              <AdminInput
                type="number"
                value={stats.githubContributions ?? 2770}
                onChange={(e) =>
                  updateStats({ githubContributions: Number(e.target.value) })
                }
                mono
              />
            </AdminField>
            <AdminField label="Total commits">
              <AdminInput
                type="number"
                value={stats.totalCommits ?? 1500}
                onChange={(e) => updateStats({ totalCommits: Number(e.target.value) })}
                mono
              />
            </AdminField>
            <AdminField label="Public repositories">
              <AdminInput
                type="number"
                value={stats.publicRepos ?? 56}
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
        </AdminFormSection>
      </AdminFormSurface>
    </div>
  );
}
