"use client";

import { useEffect, useState } from "react";
import { Skill } from "@/types/portfolio";
import {
  FALLBACK_GLYPH_HTML,
  getSimpleIconUrl,
  getSkillGlyphHtml,
  SKILL_CAT_COLOR,
  sortSkillsByLevel,
} from "@/lib/skill-icons";

const PREVIEW_COUNT = 14;

interface WorkToolkitProps {
  skills: Skill[];
}

function ToolkitIcon({ skill, theme }: { skill: Skill; theme: "dark" | "light" }) {
  const glyphHtml = getSkillGlyphHtml(skill);
  const iconUrl = getSimpleIconUrl(skill, theme);

  if (glyphHtml) {
    return (
      <span
        className="work-toolkit-icon-glyph"
        dangerouslySetInnerHTML={{ __html: glyphHtml }}
      />
    );
  }

  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt=""
        width={18}
        height={18}
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
    <span
      className="work-toolkit-icon-glyph"
      dangerouslySetInnerHTML={{ __html: FALLBACK_GLYPH_HTML }}
    />
  );
}

export default function WorkToolkit({ skills }: WorkToolkitProps) {
  const [expanded, setExpanded] = useState(false);
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

  const sorted = sortSkillsByLevel(skills);
  const hasMore = sorted.length > PREVIEW_COUNT;
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <section id="work-toolkit" className="work-toolkit reveal-item" aria-labelledby="work-toolkit-title">
      <div className="work-toolkit-head">
        <h3 id="work-toolkit-title" className="work-toolkit-title">
          Toolkit
        </h3>
        <p className="work-toolkit-sub">
          Stack highlights — the proof is in the systems below.
        </p>
      </div>

      <div className="work-toolkit-grid">
        {visible.map((skill) => (
          <div
            key={skill.id}
            className="work-toolkit-chip"
            style={{ "--cat-color": SKILL_CAT_COLOR[skill.category] || "var(--cyan)" } as React.CSSProperties}
            title={skill.name}
          >
            <span className="work-toolkit-icon-box">
              <ToolkitIcon skill={skill} theme={theme} />
            </span>
            <span className="work-toolkit-name">{skill.name}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="work-toolkit-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer tools" : `Show all ${sorted.length} tools`}
        </button>
      )}
    </section>
  );
}
