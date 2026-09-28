"use client";

import { Skill } from "@/types/portfolio";
import {
  FALLBACK_GLYPH_HTML,
  getSimpleIconUrl,
  getSkillGlyphHtml,
} from "@/lib/skill-icons";

export default function TechChipIcon({ skill, theme }: { skill: Skill; theme: "dark" | "light" }) {
  const glyphHtml = getSkillGlyphHtml(skill);

  if (glyphHtml) {
    return (
      <span className="work-toolkit-icon-glyph" dangerouslySetInnerHTML={{ __html: glyphHtml }} />
    );
  }

  const iconUrl = getSimpleIconUrl(skill, theme);
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
