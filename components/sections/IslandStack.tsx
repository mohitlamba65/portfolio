"use client";

import { useEffect, useRef, useState } from "react";
import { Skill } from "@/types/portfolio";

interface IslandStackProps {
  skills: Skill[];
}

const FALLBACK_GLYPH = `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "backend", label: "Backend" },
  { key: "ai", label: "AI / Agents" },
  { key: "data", label: "Data" },
  { key: "frontend", label: "Frontend" },
  { key: "infra", label: "Infra" },
];

export default function IslandStack({ skills }: IslandStackProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
  }, []);

  const visible = filter === "all" ? skills : skills.filter((s) => s.category === filter);

  return (
    <div ref={sectionRef} className="tab-panel" id="stack" data-panel>
      <div className="panel-inner">
        <div className="kicker">STACK</div>
        <h2 className="h2 reveal-item">Tools I actually reach for.</h2>
        <p style={{ color: "var(--text-dim)", maxWidth: "60ch", marginBottom: "30px" }} className="reveal-item">
          Muted by default, lit up on hover. Filter by category — no metaphors, just the stack.
        </p>

        {/* Filter buttons */}
        <div className="skill-filters reveal-item">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn${filter === f.key ? " active" : ""}`}
              data-filter={f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stack grid */}
        <div className="stack-grid" ref={gridRef}>
          {visible.map((s) => {
            const dots = Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < s.level ? "on" : ""} />
            ));
            const iconHtml = s.icon
              ? `<img src="https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${s.icon}.svg" alt="${s.name}" width="30" height="30" onerror="this.outerHTML='${FALLBACK_GLYPH.replace(/'/g, "\\'")}'">`
              : FALLBACK_GLYPH;

            return (
              <div key={s.id} className="stack-card">
                <div dangerouslySetInnerHTML={{ __html: iconHtml }} />
                <div className="sname">{s.name}</div>
                <div className="slevel">{dots}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
