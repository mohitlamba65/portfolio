import type { HeroStatCard, SystemStats } from "@/types/portfolio";

export type ResolvedHeroStat = {
  id: string;
  label: string;
  count: number;
  suffix: string;
  /** When set, skip count animation and show this text */
  staticText?: string;
};

function parseNumericDisplay(value: string): { count: number; suffix: string } | null {
  const m = value.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { count: parseFloat(m[1]), suffix: m[2] ?? "" };
}

export function resolveHeroStatDisplay(card: HeroStatCard, stats: SystemStats): ResolvedHeroStat {
  const base = { id: card.id, label: card.label, count: 0, suffix: "" };

  switch (card.bindTo) {
    case "usersServed": {
      const raw = stats.usersServed || card.displayValue || "1M+";
      const parsed = parseNumericDisplay(raw);
      if (parsed) return { ...base, count: parsed.count, suffix: parsed.suffix };
      return { ...base, staticText: raw };
    }
    case "productionProducts":
      return {
        ...base,
        count: stats.productionProducts ?? card.count ?? 0,
        suffix: card.suffix ?? "",
      };
    case "githubContributions":
      return {
        ...base,
        count: stats.githubContributions ?? card.count ?? 0,
        suffix: card.suffix ?? "",
      };
    case "publicRepos":
      return {
        ...base,
        count: stats.publicRepos ?? card.count ?? 0,
        suffix: card.suffix ?? "",
      };
    case "totalCommits":
      return {
        ...base,
        count: stats.totalCommits ?? card.count ?? 0,
        suffix: card.suffix ?? "+",
      };
    case "b2bClients":
      return {
        ...base,
        count: stats.b2bClients ?? card.count ?? 0,
        suffix: card.suffix ?? "+",
      };
    default:
      break;
  }

  if (card.displayValue) {
    const parsed = parseNumericDisplay(card.displayValue);
    if (parsed) {
      return { ...base, count: parsed.count, suffix: parsed.suffix || card.suffix || "" };
    }
    return { ...base, staticText: card.displayValue };
  }

  return {
    ...base,
    count: card.count ?? 0,
    suffix: card.suffix ?? "",
  };
}

export function resolveHeroStatCards(stats: SystemStats): ResolvedHeroStat[] {
  const cards = stats.heroCards?.length ? stats.heroCards : defaultHeroStatCards();
  return cards.map((c) => resolveHeroStatDisplay(c, stats));
}

export function defaultHeroStatCards(): HeroStatCard[] {
  return [
    {
      id: "users-reached",
      label: "USERS REACHED",
      bindTo: "usersServed",
      displayValue: "1M+",
    },
    {
      id: "production-products",
      label: "PRODUCTION PRODUCTS",
      bindTo: "productionProducts",
      count: 2,
    },
    {
      id: "github-contributions",
      label: "GITHUB CONTRIBUTIONS",
      bindTo: "githubContributions",
      suffix: "+",
    },
    {
      id: "public-repos",
      label: "PUBLIC REPOS",
      bindTo: "publicRepos",
    },
  ];
}

export const DEFAULT_HERO_ROLES = [
  "Backend Engineer",
  "AI Systems Builder",
  "Full Stack Developer",
];
