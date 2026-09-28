"use client";

import { Skill } from "@/types/portfolio";
import { resolveProjectTech } from "@/lib/resolve-project-tech";
import { SKILL_CAT_COLOR } from "@/lib/skill-icons";
import { usePortfolioTheme } from "@/lib/use-portfolio-theme";
import TechChipIcon from "@/components/shared/TechChipIcon";

export type TechChipGridVariant = "project" | "experience" | "compact";

interface TechChipGridProps {
  labels: string[];
  skills: Skill[];
  variant?: TechChipGridVariant;
  /** Defaults from variant */
  showDots?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function TechChipGrid({
  labels,
  skills,
  variant = "project",
  showDots = variant !== "compact",
  className = "",
  ariaLabel = "Technologies",
}: TechChipGridProps) {
  const theme = usePortfolioTheme();

  if (!labels?.length) return null;

  return (
    <div
      className={`tech-chip-grid tech-chip-grid--${variant}${className ? ` ${className}` : ""}`}
      role="list"
      aria-label={ariaLabel}
    >
      {labels.map((label) => {
        const skill = resolveProjectTech(label, skills);
        const catColor = SKILL_CAT_COLOR[skill.category] || "var(--cyan)";
        const level = Math.min(5, Math.max(1, skill.level || 3));

        return (
          <div
            key={`${label}-${skill.id}`}
            className="tech-chip"
            role="listitem"
            style={{ "--cat-color": catColor } as React.CSSProperties}
            title={label}
          >
            <span className="tech-chip-icon work-toolkit-icon-box">
              <TechChipIcon skill={skill} theme={theme} />
            </span>
            <span className="tech-chip-body">
              <span className="tech-chip-name">{skill.name}</span>
              {showDots ? (
                <span className="tech-chip-dots" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < level ? "on" : ""} />
                  ))}
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
