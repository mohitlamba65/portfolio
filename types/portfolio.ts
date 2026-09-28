export type SkillCategory = "backend" | "ai" | "data" | "frontend" | "infra";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 5 (shown as dots)
  icon?: string | null; // simple-icons slug, null = use fallback glyph
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  highlightMetric?: string;
  description: string;
  bullets?: string[];
  techStack?: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline?: string;
  eyebrow?: string;         // e.g. "WHATSAPP → LLM AGENT → TOOLS → WHATSAPP"
  provenance?: string;      // e.g. "Built and maintained solo"
  description: string;
  status?: "live" | "building" | "private"; // controls badge colour
  statusLabel?: string;     // e.g. "LIVE ON GITHUB", "PRODUCTION · PROPRIETARY"
  heroStat?: {
    value: string;          // e.g. "100%"
    label: string;          // e.g. "async, webhook-driven"
  };
  metrics?: string;
  architectureNotes?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  coverImageUrl?: string;
  featured?: boolean;
}

export interface GithubStatsOverrides {
  githubContributions?: boolean;
  publicRepos?: boolean;
  totalCommits?: boolean;
}

export interface GithubLiveSnapshot {
  githubContributions: number;
  totalCommitsLastYear: number;
  publicRepos: number;
  fetchedAt: string;
}

export interface GithubStatsConfig {
  syncEnabled?: boolean;
  username?: string;
  excludeForks?: boolean;
  lastSyncedAt?: string;
  lastSyncError?: string;
  liveSnapshot?: GithubLiveSnapshot;
  overrides?: GithubStatsOverrides;
}

export type HeroStatBindKey =
  | "none"
  | "usersServed"
  | "productionProducts"
  | "githubContributions"
  | "publicRepos"
  | "totalCommits"
  | "b2bClients";

export interface HeroStatCard {
  id: string;
  label: string;
  bindTo?: HeroStatBindKey;
  /** Fallback or custom static display (e.g. 1M+) */
  displayValue?: string;
  count?: number;
  suffix?: string;
}

export interface SystemStats {
  usersServed: string;
  githubContributions: number;
  totalCommits: number;
  publicRepos: number;
  productionProducts?: number;
  b2bClients?: number;
  heroCards?: HeroStatCard[];
  github?: GithubStatsConfig;
  publicActivitySignal?: number;
  uptimeSla?: string;
  systemsShipped?: number;
}

export interface AboutPhotoCardConfig {
  /** Supports `{name}` for uppercase full name */
  metaLine1?: string;
  metaLine2?: string;
  traits?: string[];
}

export interface AboutPrincipleItem {
  code?: string;
  title: string;
  desc?: string;
}

export interface Profile {
  name: string;
  roleTitle?: string;
  subTitle?: string;
  headline?: string;
  heroTag?: string;
  heroTagLines?: string[];
  heroRoles?: string[];
  availabilityBadge?: string;
  location: string;
  availabilityStatus?: string;
  bioParagraphs: string[];
  aboutPhotoCard?: AboutPhotoCardConfig;
  aboutPrinciples?: AboutPrincipleItem[];
  navbarAvatarUrl: string;       // photo used in nav logo area
  profilePhotoUrl?: string;      // photo used in about section
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
    leetcode?: string;
  };
}

export interface PortfolioData {
  profile: Profile;
  stats: SystemStats;
  experiences: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  lastUpdated: string;
}
