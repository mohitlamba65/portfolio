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
  featured?: boolean;
}

export interface SystemStats {
  usersServed: string;            // e.g. "1M+"
  githubContributions: number;    // e.g. 2770
  totalCommits: number;           // e.g. 1500
  publicRepos: number;            // e.g. 56
  b2bClients?: number;            // e.g. 50
  // Legacy fields kept for backwards compat
  publicActivitySignal?: number;
  uptimeSla?: string;
  systemsShipped?: number;
}

export interface Profile {
  name: string;
  roleTitle?: string;
  subTitle?: string;
  headline?: string;
  heroTag?: string;              // tagline paragraph shown on home panel
  availabilityBadge?: string;    // eyebrow text e.g. "AVAILABLE FOR BACKEND · AI ENGINEERING ROLES"
  location: string;
  availabilityStatus?: string;
  bioParagraphs: string[];
  navbarAvatarUrl: string;       // photo used in nav logo area
  profilePhotoUrl?: string;      // photo used in about section
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
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
