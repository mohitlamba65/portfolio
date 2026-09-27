import type { Skill, SkillCategory } from "@/types/portfolio";

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "");
}

function inferCategory(name: string): SkillCategory {
  const l = name.toLowerCase();
  if (/react|next|tailwind|shadcn|frontend|vue|css/.test(l)) return "frontend";
  if (/lang|llm|rag|agent|mcp|openai|gpt/.test(l)) return "ai";
  if (/postgres|mongo|redis|prisma|sql|socket|data/.test(l)) return "data";
  if (/docker|aws|k8s|ci\/cd|grafana|prometheus|infra|vercel/.test(l)) return "infra";
  return "backend";
}

/** Map project techStack strings to portfolio skills for icons, category colors, and dot levels. */
export function resolveProjectTech(name: string, skills: Skill[]): Skill {
  const trimmed = name.trim();
  const key = normalizeKey(trimmed);

  const exact = skills.find(
    (s) => s.name.toLowerCase() === trimmed.toLowerCase() || normalizeKey(s.name) === key || s.id === key
  );
  if (exact) return { ...exact, name: trimmed };

  const fuzzy = skills.find((s) => {
    const sk = normalizeKey(s.name);
    return sk.includes(key) || key.includes(sk);
  });
  if (fuzzy) return { ...fuzzy, name: trimmed };

  return {
    id: `proj-tech-${key || "unknown"}`,
    name: trimmed,
    category: inferCategory(trimmed),
    level: 3,
    icon: null,
  };
}
