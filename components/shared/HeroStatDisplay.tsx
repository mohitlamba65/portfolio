"use client";

import type { ResolvedHeroStat } from "@/lib/hero-stat-cards";

function StatValue({
  stat,
  className,
}: {
  stat: ResolvedHeroStat;
  className: string;
}) {
  if (stat.staticText) {
    return <span className={className}>{stat.staticText}</span>;
  }
  return (
    <span
      className={className}
      data-count={stat.count}
      data-suffix={stat.suffix}
    >
      0
    </span>
  );
}

export function HeroDashStatStrip({ stats }: { stats: ResolvedHeroStat[] }) {
  return (
    <div className="dash-strip reveal-item">
      {stats.map((stat) => (
        <div key={stat.id} className="dash-stat">
          <StatValue stat={stat} className="num" />
          <div className="lbl">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export function HeroAboutStatPanel({ stats }: { stats: ResolvedHeroStat[] }) {
  return (
    <div className="stat-panel">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-row">
          <span className="stat-label">{stat.label}</span>
          <StatValue stat={stat} className="stat-num" />
        </div>
      ))}
    </div>
  );
}
