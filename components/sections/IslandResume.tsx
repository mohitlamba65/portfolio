"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { highlightText, getResumeHighlightPhrases } from "@/lib/resume-highlight";
import gsap from "gsap";

interface IslandResumeProps {
  data: PortfolioData;
}

const SECTIONS = [
  { id: "resume-summary", label: "Summary" },
  { id: "resume-experience", label: "Experience" },
  { id: "resume-skills", label: "Skills" },
  { id: "resume-projects", label: "Projects" },
] as const;

const catColor: Record<string, string> = {
  backend: "var(--cyan)",
  ai: "var(--amber)",
  data: "var(--blue)",
  frontend: "var(--pink)",
  infra: "var(--violet)",
};

export default function IslandResume({ data }: IslandResumeProps) {
  const { profile, experiences, skills, projects, stats } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("resume-summary");

  const resumeUrl = profile.resumeUrl || "/resume.pdf";
  const highlights = getResumeHighlightPhrases(skills, stats);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);
  const topSkills = skills.slice(0, 12);

  const summaryText =
    profile.headline ||
    profile.heroTag ||
    "Backend and AI systems engineer focused on production reliability and scalable architecture.";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 60);
    });

    const items = el.querySelectorAll<HTMLElement>(".tl-item");
    items.forEach((i) => i.classList.add("in"));
    const timeline = el.querySelector<HTMLElement>(".resume-timeline");
    if (timeline) {
      setTimeout(() => timeline.style.setProperty("--tl-progress", "100%"), 200);
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const node = el.querySelector(`#${id}`);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={sectionRef} className="tab-panel" id="resume" data-panel>
      <div className="panel-inner">
        <div className="kicker">RESUME</div>
        <div className="resume-header reveal-item">
          <div>
            <h2 className="h2" style={{ marginBottom: 8 }}>
              {profile.name}
            </h2>
            <p style={{ color: "var(--text-dim)", fontSize: 15, maxWidth: "52ch" }}>
              {profile.roleTitle || profile.subTitle || "Backend · AI Systems Engineer"}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </div>
          <div className="resume-header-actions">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download PDF
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Open in tab
            </a>
          </div>
        </div>

        <div className="trait-row reveal-item" style={{ marginTop: 20, marginBottom: 28 }}>
          <span className="trait" style={{ "--tc": "var(--cyan)" } as React.CSSProperties}>
            {stats.usersServed || "1M+"} users shipped
          </span>
          <span className="trait" style={{ "--tc": "var(--amber)" } as React.CSSProperties}>
            AI & agentic systems
          </span>
          <span className="trait" style={{ "--tc": "var(--blue)" } as React.CSSProperties}>
            {stats.githubContributions?.toLocaleString() || "2,770"} GitHub contributions
          </span>
          <span className="trait" style={{ "--tc": "var(--violet)" } as React.CSSProperties}>
            Production reliability
          </span>
        </div>

        <nav className="resume-section-nav reveal-item" aria-label="Resume sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`resume-section-nav-btn${activeSection === s.id ? " active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="resume-body">
          <section id="resume-summary" className="resume-block reveal-item">
            <h3 className="resume-block-title">Summary</h3>
            <p className="resume-prose">{highlightText(summaryText, highlights)}</p>
            {profile.heroTag && profile.headline && (
              <p className="resume-prose" style={{ marginTop: 16 }}>
                {highlightText(profile.heroTag, highlights)}
              </p>
            )}
            {profile.bioParagraphs?.[0] && (
              <p className="resume-prose" style={{ marginTop: 16, color: "var(--text-dim)" }}>
                {highlightText(profile.bioParagraphs[0], highlights)}
              </p>
            )}
          </section>

          <section id="resume-experience" className="resume-block reveal-item">
            <h3 className="resume-block-title">Experience</h3>
            <div className="timeline resume-timeline">
              {experiences.map((exp) => (
                <div key={exp.id} className="tl-item">
                  <div className="tl-eyebrow">
                    {exp.company.toUpperCase()}
                    {exp.period ? ` · ${exp.period.toUpperCase()}` : ""}
                  </div>
                  <h4>{exp.role}</h4>
                  <p>{exp.description}</p>
                  {exp.highlightMetric && (
                    <p className="resume-metric">{exp.highlightMetric}</p>
                  )}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="proj-tags" style={{ marginTop: 12 }}>
                      {exp.techStack.slice(0, 6).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="resume-skills" className="resume-block reveal-item">
            <h3 className="resume-block-title">Core skills</h3>
            <div className="resume-skill-grid">
              {topSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="resume-skill-chip"
                  style={{ "--cat-color": catColor[skill.category] || "var(--cyan)" } as React.CSSProperties}
                >
                  <span className="resume-skill-name">{skill.name}</span>
                  <span className="resume-skill-dots">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < skill.level ? "on" : ""} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="resume-projects" className="resume-block reveal-item">
            <h3 className="resume-block-title">Selected work</h3>
            <div className="resume-project-list">
              {displayProjects.map((proj) => (
                <article key={proj.id} className="resume-project-card">
                  <div className="proj-eyebrow">{proj.eyebrow || "PROJECT"}</div>
                  <h4 style={{ fontSize: 18, margin: "8px 0 6px" }}>{proj.title}</h4>
                  <p className="desc" style={{ marginBottom: 12 }}>
                    {proj.description}
                  </p>
                  {proj.techStack?.length > 0 && (
                    <div className="proj-tags">
                      {proj.techStack.slice(0, 5).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-link"
                      style={{ marginTop: 14, display: "inline-flex" }}
                    >
                      View repository
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>

          <div className="resume-download-strip reveal-item">
            <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
              Prefer the official document? Download the full PDF resume.
            </p>
            <a href={resumeUrl} download className="btn btn-primary">
              Download resume.pdf
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
