"use client";

import { useEffect, useRef, useState } from "react";
import { Skill } from "@/types/portfolio";
import gsap from "gsap";

interface IslandStackProps {
  skills: Skill[];
}

const CUSTOM_GLYPHS: Record<string, string> = {
  restapi: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 7l-4 5 4 5M17 7l4 5-4 5M14 4l-4 16"/></svg>`,
  systemdesign: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="7" height="6" rx="1"/><rect x="14" y="4" width="7" height="6" rx="1"/><rect x="8.5" y="14" width="7" height="6" rx="1"/><path d="M6.5 10v2h11v-2M12 16v-3"/></svg>`,
  langgraph: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="6" r="2.3"/><circle cx="19" cy="6" r="2.3"/><circle cx="12" cy="18" r="2.3"/><path d="M7 7l3 8M17 7l-3 8M7.3 6h9.4"/></svg>`,
  langchain: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="9" width="8" height="6" rx="3"/><rect x="13" y="9" width="8" height="6" rx="3"/><path d="M11 12h2"/></svg>`,
  rag: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="10" height="14" rx="1"/><path d="M7 7h4M7 10h4M7 13h2"/><circle cx="17" cy="16" r="3.2"/><path d="M19.3 18.3L22 21"/></svg>`,
  mcp: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="2" width="6" height="7" rx="1"/><path d="M12 9v3M7 12h10v3a3 3 0 01-3 3h-4a3 3 0 01-3-3v-3z"/><path d="M9 21v-3M15 21v-3"/></svg>`,
  llmapi: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3a4 4 0 00-4 4v1a3 3 0 00-1 5.8V16a4 4 0 004 4 4 4 0 004-4v-2.2A3 3 0 0018 8V7a4 4 0 00-4-4h-2z"/><path d="M9 11h6M9 14h4"/></svg>`,
  mongoose: `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 20V9a6 6 0 0112 0v4"/><path d="M18 13a3 3 0 013 3v1a3 3 0 01-3 3h-1"/><circle cx="6" cy="20" r="1.2" fill="currentColor" stroke="none"/></svg>`,
};
const FALLBACK_GLYPH = `<svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>`;

const catColor: Record<string, string> = {
  backend: "var(--cyan)",
  ai: "var(--amber)",
  data: "var(--blue)",
  frontend: "var(--pink)",
  infra: "var(--violet)",
};

// Map skill id to custom glyph key
const glyphMap: Record<string, string> = {
  "rest-apis": "restapi",
  "system-design": "systemdesign",
  langgraph: "langgraph",
  langchain: "langchain",
  rag: "rag",
  mcp: "mcp",
  "llm-apis": "llmapi",
  mongoose: "mongoose",
};

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
  const thumbRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? skills : skills.filter(s => s.category === filter);

  // Move segmented control thumb
  const moveThumb = (filterKey: string) => {
    const seg = segRef.current;
    const thumb = thumbRef.current;
    if (!seg || !thumb) return;
    const activeBtn = seg.querySelector<HTMLElement>(`button[data-filter="${filterKey}"]`);
    if (!activeBtn) return;
    thumb.style.width = activeBtn.offsetWidth + "px";
    thumb.style.transform = `translateX(${activeBtn.offsetLeft - 4}px)`;
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
  }, []);

  // Animate grid items and move thumb after render
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.children) as HTMLElement[];
    gsap.fromTo(cards,
      { opacity: 0, y: 10, scale: .94 },
      { opacity: 1, y: 0, scale: 1, duration: .4, stagger: .025, ease: "back.out(1.6)" }
    );
    // Delay thumb move until layout is painted
    requestAnimationFrame(() => moveThumb(filter));
  }, [filter, visible.length]);

  // On resize
  useEffect(() => {
    const onResize = () => moveThumb(filter);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [filter]);

  return (
    <div ref={sectionRef} className="tab-panel" id="stack" data-panel>
      <div className="panel-inner">
        <div className="kicker">STACK</div>
        <h2 className="h2 reveal-item">Tools I actually reach for.</h2>
        <p style={{ color: "var(--text-dim)", maxWidth: "60ch", marginBottom: "30px" }} className="reveal-item">
        </p>

        <div className="stack-toolbar reveal-item">
          <div className="segmented" id="segmented" ref={segRef}>
            <div className="seg-thumb" id="seg-thumb" ref={thumbRef}></div>
            {FILTERS.map(f => (
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
          <div className="stack-count">
            {visible.length} {visible.length === 1 ? "tool" : "tools"}
          </div>
        </div>

        <div className="stack-grid" ref={gridRef}>
          {visible.map(s => {
            const glyphKey = glyphMap[s.id];
            const color = catColor[s.category] || "var(--cyan)";
            const dots = Array.from({ length: 5 }, (_, i) =>
              `<span class="${i < s.level ? "on" : ""}"></span>`
            ).join("");

            let iconHtml: string;
            if (glyphKey && CUSTOM_GLYPHS[glyphKey]) {
              iconHtml = CUSTOM_GLYPHS[glyphKey];
            } else if (s.icon) {
              iconHtml = `<img src="https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${s.icon}.svg" alt="${s.name}" width="28" height="28" onerror="this.outerHTML='${FALLBACK_GLYPH.replace(/'/g, "\\'")}'" />`;
            } else {
              iconHtml = FALLBACK_GLYPH;
            }

            return (
              <div
                key={s.id}
                className="stack-card"
                style={{ "--cat-color": color } as React.CSSProperties}
                dangerouslySetInnerHTML={{
                  __html: `${iconHtml}<div class="sname">${s.name}</div><div class="slevel">${dots}</div>`
                }}
              />
            );
          })}
        </div>

        <div className="signal-legend reveal-item">
          <div className="signal-item"><span className="signal-dot" style={{ background: "var(--cyan)" }}></span>BACKEND — the power-on light</div>
          <div className="signal-item"><span className="signal-dot" style={{ background: "var(--amber)" }}></span>AI / AGENTS — reasoning signal</div>
          <div className="signal-item"><span className="signal-dot" style={{ background: "var(--blue)" }}></span>DATA — flow signal</div>
          <div className="signal-item"><span className="signal-dot" style={{ background: "var(--pink)" }}></span>FRONTEND — interface signal</div>
          <div className="signal-item"><span className="signal-dot" style={{ background: "var(--violet)" }}></span>INFRA — infrastructure signal</div>
        </div>
      </div>
    </div>
  );
}
