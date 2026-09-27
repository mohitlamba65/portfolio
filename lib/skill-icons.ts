import { Skill } from "@/types/portfolio";

export const SKILL_CAT_COLOR: Record<string, string> = {
  backend: "var(--cyan)",
  ai: "var(--amber)",
  data: "var(--blue)",
  frontend: "var(--pink)",
  infra: "var(--violet)",
};

const GLYPH_MAP: Record<string, string> = {
  "rest-apis": "restapi",
  "system-design": "systemdesign",
  langgraph: "langgraph",
  langchain: "langchain",
  rag: "rag",
  mcp: "mcp",
  "llm-apis": "llmapi",
  mongoose: "mongoose",
};

const CUSTOM_GLYPHS: Record<string, string> = {
  restapi: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 7l-4 5 4 5M17 7l4 5-4 5M14 4l-4 16"/></svg>`,
  systemdesign: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="7" height="6" rx="1"/><rect x="14" y="4" width="7" height="6" rx="1"/><rect x="8.5" y="14" width="7" height="6" rx="1"/><path d="M6.5 10v2h11v-2M12 16v-3"/></svg>`,
  langgraph: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="6" r="2.3"/><circle cx="19" cy="6" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M7 7l3 8M17 7l-3 8M7.3 6h9.4"/></svg>`,
  langchain: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="9" width="8" height="6" rx="3"/><rect x="13" y="9" width="8" height="6" rx="3"/><path d="M11 12h2"/></svg>`,
  rag: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="10" height="14" rx="1"/><path d="M7 7h4M7 10h4M7 13h2"/><circle cx="17" cy="16" r="3.2"/><path d="M19.3 18.3L22 21"/></svg>`,
  mcp: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="2" width="6" height="7" rx="1"/><path d="M12 9v3M7 12h10v3a3 3 0 01-3 3h-4a3 3 0 01-3-3v-3z"/><path d="M9 21v-3M15 21v-3"/></svg>`,
  llmapi: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3a4 4 0 00-4 4v1a3 3 0 00-1 5.8V16a4 4 0 004 4 4 4 0 004-4v-2.2A3 3 0 0018 8V7a4 4 0 00-4-4h-2z"/><path d="M9 11h6M9 14h4"/></svg>`,
  mongoose: `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 20V9a6 6 0 0112 0v4"/><path d="M18 13a3 3 0 013 3v1a3 3 0 01-3 3h-1"/><circle cx="6" cy="20" r="1.2" fill="currentColor" stroke="none"/></svg>`,
};

export const FALLBACK_GLYPH_HTML = `<svg class="skill-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>`;

export function getSkillGlyphHtml(skill: Skill): string | null {
  const key = GLYPH_MAP[skill.id];
  if (key && CUSTOM_GLYPHS[key]) return CUSTOM_GLYPHS[key];
  return null;
}

export function getSimpleIconUrl(skill: Skill, theme: "dark" | "light" = "dark"): string | null {
  if (!skill.icon) return null;
  if (theme === "dark") {
    const light = "E8E4F0";
    return `https://cdn.simpleicons.org/${skill.icon}/${light}`;
  }
  const dark = "14121D";
  return `https://cdn.simpleicons.org/${skill.icon}/${dark}`;
}

export function sortSkillsByLevel(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
}
