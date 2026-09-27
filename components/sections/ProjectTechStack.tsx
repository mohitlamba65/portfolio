"use client";

import { useEffect, useState } from "react";
import { Skill } from "@/types/portfolio";
import { resolveProjectTech } from "@/lib/resolve-project-tech";
import {
  FALLBACK_GLYPH_HTML,
  getSimpleIconUrl,
  getSkillGlyphHtml,
  SKILL_CAT_COLOR,
} from "@/lib/skill-icons";

function TechIcon({ skill, theme }: { skill: Skill; theme: "dark" | "light" }) {
  const glyphHtml = getSkillGlyphHtml(skill);
  const iconUrl = getSimpleIconUrl(skill, theme);

  if (glyphHtml) {
    return (
      <span className="work-toolkit-icon-glyph" dangerouslySetInnerHTML={{ __html: glyphHtml }} />
    );
  }

  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt=""
        width={16}
        height={16}
        className="work-toolkit-icon-img"
        onError={(e) => {
          const parent = e.currentTarget.parentElement;
          if (!parent) return;
          e.currentTarget.remove();
          const span = document.createElement("span");
          span.className = "work-toolkit-icon-glyph";
          span.innerHTML = FALLBACK_GLYPH_HTML;
          parent.appendChild(span);
        }}
      />
    );
  }

  return (
    <span className="work-toolkit-icon-glyph" dangerouslySetInnerHTML={{ __html: FALLBACK_GLYPH_HTML }} />
  );
}

interface ProjectTechStackProps {
  techStack: string[];
  skills: Skill[];
}

export default function ProjectTechStack({ techStack, skills }: ProjectTechStackProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  if (!techStack?.length) return null;

  return (
    <div className="proj-tags" role="list" aria-label="Technologies used">
      {techStack.map((label) => {
        const skill = resolveProjectTech(label, skills);
        const catColor = SKILL_CAT_COLOR[skill.category] || "var(--cyan)";
        const level = Math.min(5, Math.max(1, skill.level || 3));

        return (
          <div
            key={`${label}-${skill.id}`}
            className="proj-tech-chip"
            role="listitem"
            style={{ "--cat-color": catColor } as React.CSSProperties}
            title={label}
          >
            <span className="proj-tech-icon-box work-toolkit-icon-box">
              <TechIcon skill={skill} theme={theme} />
            </span>
            <span className="proj-tech-chip-body">
              <span className="proj-tech-name">{skill.name}</span>
              <span className="proj-tech-dots" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < level ? "on" : ""} />
                ))}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
