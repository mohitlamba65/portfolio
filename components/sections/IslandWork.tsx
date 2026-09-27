"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Project, Skill } from "@/types/portfolio";
import WorkToolkit from "@/components/sections/WorkToolkit";
import ProjectTechStack from "@/components/sections/ProjectTechStack";
import gsap from "gsap";

interface IslandWorkProps {
  projects: Project[];
  skills: Skill[];
}

function ProjectLinkArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}

function ProjectStatusBadge({ proj, className }: { proj: Project; className?: string }) {
  const statusClass =
    proj.status === "private"
      ? "proj-status private"
      : proj.status === "building"
        ? "proj-status building"
        : "proj-status";

  return (
    <div className={`${statusClass}${className ? ` ${className}` : ""}`}>
      <span className="dotlive"></span>
      {proj.statusLabel ||
        (proj.status === "live" ? "LIVE" : proj.status === "building" ? "BUILDING" : "PRIVATE")}
    </div>
  );
}

function ProjectActions({
  proj,
  className,
  layout = "row",
}: {
  proj: Project;
  className?: string;
  layout?: "row" | "column";
}) {
  return (
    <div className={`proj-actions${layout === "column" ? " proj-actions-stack" : ""}${className ? ` ${className}` : ""}`}>
      {proj.liveUrl ? (
        <a
          href={proj.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="proj-link proj-link-primary"
        >
          Visit
          <ProjectLinkArrow />
        </a>
      ) : null}
      {proj.githubUrl ? (
        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-link">
          {proj.status === "building" ? "GitHub" : "Repository"}
          <ProjectLinkArrow />
        </a>
      ) : proj.status === "private" ? (
        <span className="proj-link proj-link-muted">Proprietary — happy to walk through architecture</span>
      ) : null}
    </div>
  );
}

export default function IslandWork({ projects, skills }: IslandWorkProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fb !== fa) return fb - fa;
        return 0;
      }),
    [projects]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".reveal-item, .proj-card");
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out", delay: 0.05 }
    );

    el.querySelectorAll<HTMLElement>(".proj-media").forEach((media, i) => {
      gsap.fromTo(
        media,
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.7, delay: 0.1 + i * 0.08, ease: "power2.out" }
      );
    });

    el.querySelectorAll<HTMLElement>(".proj-card [data-count]").forEach((target) => {
      if (target.dataset.done) return;
      target.dataset.done = "1";
      const targetNum = parseInt(target.dataset.count || "0", 10);
      const suffix = target.dataset.suffix || "";
      const digits = String(targetNum).length;
      target.textContent = "0".repeat(digits) + suffix;
      target.style.opacity = ".4";

      let ticks = 0;
      const max = 7;
      const id = setInterval(() => {
        ticks++;
        const rnd = Array.from({ length: digits })
          .map(() => Math.floor(Math.random() * 10))
          .join("");
        target.textContent = rnd + suffix;
        if (ticks >= max) {
          clearInterval(id);
          target.style.opacity = "1";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: targetNum,
            duration: 0.9,
            ease: "power2.out",
            onUpdate: () => {
              target.textContent = Math.floor(obj.v) + suffix;
            },
          });
        }
      }, 45);
    });
  }, [sortedProjects]);

  return (
    <div ref={sectionRef} className="tab-panel" id="work" data-panel>
      <div className="panel-inner">
        <div className="kicker">PROJECTS</div>
        <h2 className="h2 reveal-item">Things I&apos;ve built and run.</h2>
        <p className="reveal-item work-intro">
          Personal projects and production systems — with the stack that keeps them running.
        </p>

        <WorkToolkit skills={skills} />

        <div className="work-projects-divider reveal-item" aria-hidden />

        <div className="proj-list">
          {sortedProjects.map((proj, i) => {
            let countVal = 0;
            let countSuffix = "";
            if (proj.heroStat) {
              const match = proj.heroStat.value.match(/^([\d.]+)(.*)$/);
              if (match) {
                countVal = parseFloat(match[1]);
                countSuffix = match[2];
              }
            }

            const coverSrc = proj.coverImageUrl;
            const hasMedia = Boolean(coverSrc);

            return (
              <article
                key={proj.id}
                className={`proj-card reveal-item${hasMedia ? " has-media" : ""}`}
              >
                <div className="ghost-num">{String(i + 1).padStart(3, "0")}</div>

                <div className="proj-card-inner">
                  <div className="proj-card-main">
                    <div className="proj-top">
                      <span className="proj-eyebrow">{proj.eyebrow || `PROJECT ${i + 1}`}</span>
                      {!hasMedia ? <ProjectStatusBadge proj={proj} /> : null}
                    </div>

                    <h3>{proj.title}</h3>
                    {proj.provenance ? <div className="proj-provenance">{proj.provenance}</div> : null}
                    <p className="desc">{proj.description}</p>

                    {proj.techStack?.length > 0 ? (
                      <ProjectTechStack techStack={proj.techStack} skills={skills} />
                    ) : null}

                    {!hasMedia ? (
                      <div className="proj-bottom">
                        {proj.heroStat ? (
                          <div className="proj-herostat">
                            <div className="n stat-num" data-count={countVal} data-suffix={countSuffix}>
                              0
                            </div>
                            <div className="l">{proj.heroStat.label}</div>
                          </div>
                        ) : (
                          <div className="proj-bottom-spacer" />
                        )}
                        <ProjectActions proj={proj} />
                      </div>
                    ) : proj.heroStat ? (
                      <div className="proj-herostat proj-herostat-inline">
                        <div className="n stat-num" data-count={countVal} data-suffix={countSuffix}>
                          0
                        </div>
                        <div className="l">{proj.heroStat.label}</div>
                      </div>
                    ) : null}
                  </div>

                  {hasMedia && coverSrc ? (
                    <aside className="proj-card-aside" aria-label={`${proj.title} preview`}>
                      <ProjectStatusBadge proj={proj} className="proj-aside-status" />
                      <a
                        href={proj.liveUrl || coverSrc}
                        target={proj.liveUrl ? "_blank" : undefined}
                        rel={proj.liveUrl ? "noopener noreferrer" : undefined}
                        className="proj-media"
                        aria-label={`Preview ${proj.title}`}
                      >
                        <Image
                          src={coverSrc}
                          alt={`Screenshot of ${proj.title}`}
                          fill
                          className="proj-media-img"
                          sizes="252px"
                          priority={i < 2}
                        />
                        <span className="proj-media-shine" aria-hidden />
                      </a>
                      <ProjectActions proj={proj} layout="column" className="proj-aside-actions" />
                    </aside>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
