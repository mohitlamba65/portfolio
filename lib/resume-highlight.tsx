import React from "react";

/** Wrap matching highlight phrases in accent-italic spans (longest match first). */
export function highlightText(text: string, phrases: string[]): React.ReactNode {
  if (!text || phrases.length === 0) return text;

  const sorted = [...phrases]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const pattern = sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  if (!pattern) return text;

  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const isMatch = sorted.some((p) => p.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <em key={i} className="accent-italic">
          {part}
        </em>
      );
    }
    return part;
  });
}

export function getResumeHighlightPhrases(
  skills: { name: string }[],
  stats: { usersServed?: string; b2bClients?: number }
): string[] {
  const fromSkills = skills.slice(0, 8).map((s) => s.name);
  const extras = [
    "backend systems",
    "AI agents",
    "AI infrastructure",
    "production",
    "distributed systems",
    stats.usersServed ? `${stats.usersServed} users` : "1M+ users",
    stats.b2bClients ? `${stats.b2bClients}+ B2B clients` : "",
  ].filter(Boolean);

  return [...new Set([...fromSkills, ...extras])];
}
