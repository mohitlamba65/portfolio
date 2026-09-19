"use client";

import React from "react";
import { PortfolioData, SystemStats } from "@/types/portfolio";
import { BarChart3, TrendingUp, GitCommit, GitPullRequest, Users, Building, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <Card className="bg-muted/30">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Scale & Telemetry Module
          </div>
          <CardTitle className="text-2xl">Impact, Scale & Activity Metrics</CardTitle>
          <CardDescription className="mt-1">
            These figures power the high-impact stat strip on the Home panel and the About metrics sidebar.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* LIVE .DASH-STRIP PREVIEW */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          Live Home Stat-Strip Preview
        </span>

        <Card className="overflow-hidden border-2 shadow-sm">
          <div className="flex flex-wrap divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex-1 min-w-[140px] p-5 sm:p-6 bg-card text-center sm:text-left">
              <div className="text-3xl font-bold font-mono text-primary mb-1">
                {(stats.githubContributions ?? 2770).toLocaleString()}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                GitHub Contributions
              </div>
            </div>

            <div className="flex-1 min-w-[140px] p-5 sm:p-6 bg-card text-center sm:text-left">
              <div className="text-3xl font-bold font-mono text-primary mb-1">
                {(stats.totalCommits ?? 1500).toLocaleString()}+
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Commits
              </div>
            </div>

            <div className="flex-1 min-w-[140px] p-5 sm:p-6 bg-card text-center sm:text-left">
              <div className="text-3xl font-bold font-mono text-primary mb-1">
                {stats.usersServed || "1M+"}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Users on Systems
              </div>
            </div>

            <div className="flex-1 min-w-[140px] p-5 sm:p-6 bg-card text-center sm:text-left">
              <div className="text-3xl font-bold font-mono text-primary mb-1">
                {stats.publicRepos ?? 56}
              </div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Public Repositories
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Metric Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GitHub Contributions */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  GitHub Contributions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Annual/Total public activity
                </p>
              </div>
            </div>

            <Input
              type="number"
              value={stats.githubContributions ?? 2770}
              onChange={(e) =>
                updateStats({ githubContributions: parseInt(e.target.value) || 0 })
              }
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>

        {/* Total Commits */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <GitCommit size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Total Commits
                </Label>
                <p className="text-xs text-muted-foreground">
                  e.g. 1500 (displayed as 1,500+)
                </p>
              </div>
            </div>

            <Input
              type="number"
              value={stats.totalCommits ?? 1500}
              onChange={(e) =>
                updateStats({ totalCommits: parseInt(e.target.value) || 0 })
              }
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>

        {/* Users on Systems Shipped */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Users on Systems Shipped
                </Label>
                <p className="text-xs text-muted-foreground">
                  Text or formatted string (e.g. 1M+)
                </p>
              </div>
            </div>

            <Input
              type="text"
              value={stats.usersServed || "1M+"}
              onChange={(e) => updateStats({ usersServed: e.target.value })}
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>

        {/* Public Repositories */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <GitPullRequest size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Public Repositories
                </Label>
                <p className="text-xs text-muted-foreground">
                  Count of open source repos
                </p>
              </div>
            </div>

            <Input
              type="number"
              value={stats.publicRepos ?? 56}
              onChange={(e) =>
                updateStats({ publicRepos: parseInt(e.target.value) || 0 })
              }
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>

        {/* B2B Clients */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Building size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  B2B Enterprise Clients
                </Label>
                <p className="text-xs text-muted-foreground">
                  Clients / Companies powered
                </p>
              </div>
            </div>

            <Input
              type="number"
              value={stats.b2bClients ?? 50}
              onChange={(e) =>
                updateStats({ b2bClients: parseInt(e.target.value) || 0 })
              }
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>

        {/* Uptime SLA */}
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <Label className="text-sm font-semibold text-foreground">
                  Production Uptime SLA
                </Label>
                <p className="text-xs text-muted-foreground">
                  Service Reliability Target
                </p>
              </div>
            </div>

            <Input
              type="text"
              value={stats.uptimeSla || "99.9%"}
              onChange={(e) => updateStats({ uptimeSla: e.target.value })}
              className="h-12 text-lg font-mono font-bold text-primary"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
