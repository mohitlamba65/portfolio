export type SkillCategory = "backend" | "ai" | "data" | "frontend" | "infra";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 10
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlightMetric: string; // e.g., "5M+ users"
  description: string;
  bullets: string[];
  techStack: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  metrics?: string; // e.g. "99.99% uptime · 40ms p95"
  architectureNotes?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface SystemStats {
  usersServed: string;       // e.g. "5M+"
  publicActivitySignal: number; // e.g. 2770
  uptimeSla: string;         // e.g. "99.99%"
  systemsShipped: number;    // e.g. 56
}

export interface Profile {
  name: string;
  roleTitle: string;         // e.g. "ENGINEER / BUILDER"
  subTitle: string;          // e.g. "Backend + AI systems"
  headline: string;          // "The interesting work starts after the request leaves the browser."
  location: string;          // "Delhi, India · available"
  availabilityStatus: string;// "Available for high-scale backend & AI architecture roles"
  bioParagraphs: string[];
  navbarAvatarUrl: string;   // Specific photo for navbar/sidebar avatar
  profilePhotoUrl: string;   // Specific photo for profile showcase card
  resumeUrl: string;         // Path to PDF resume
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
