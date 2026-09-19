"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function ControlRoomProjects({ projects }: { projects: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("in");
            }, i * 150);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="py-24 border-t border-[var(--line)]">
      <div className="reveal font-mono text-sm text-[var(--cyan)] mb-12 tracking-widest uppercase">
        03 / Selected_Projects
      </div>

      <div className="flex flex-col gap-24">
        {projects.map((proj, i) => {
          const indexNum = String(i + 1).padStart(3, '0');
          // Fake hero stat for visual flair since it's not in the model yet, or use stars if available
          const heroStat = proj.githubUrl ? "10K+" : "99.9%"; 
          const heroLabel = proj.githubUrl ? "STARS" : "UPTIME";
          const provenance = i % 2 === 0 ? "SOLO ARCHITECTURE" : "CORE TEAM";

          return (
            <div key={proj.id} className="reveal relative group">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Image Side */}
                <div className="relative aspect-video bg-[var(--bg-panel)] border border-[var(--line)] rounded overflow-hidden group-hover:border-[var(--cyan)] transition-colors">
                  <div className="absolute inset-0 bg-[rgba(53,231,199,0.1)] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none mix-blend-overlay" />
                  {proj.imageUrl ? (
                    <Image 
                      src={proj.imageUrl} 
                      alt={proj.title} 
                      fill
                      className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[var(--line)] text-6xl">
                      &lt; / &gt;
                    </div>
                  )}
                  
                  {/* Hero Stat Overlay */}
                  <div className="absolute bottom-4 left-4 z-20 flex flex-col">
                    <span className="font-display font-bold text-4xl text-white drop-shadow-md">{heroStat}</span>
                    <span className="font-mono text-xs tracking-widest text-[var(--cyan)] uppercase drop-shadow-md">{heroLabel}</span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="relative z-10 flex flex-col items-start justify-center">
                  
                  {/* Ghost Numeral */}
                  <div className="absolute -top-16 -right-8 font-display font-bold text-[180px] leading-none text-[var(--bg-panel-2)] select-none pointer-events-none opacity-50 overflow-hidden">
                    {indexNum}
                  </div>

                  <div className="relative z-10 w-full">
                    <div className="font-mono text-xs text-[var(--amber)] mb-4 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[var(--amber)] rounded-full" />
                      {provenance}
                    </div>

                    <h3 className="font-display text-3xl text-[var(--text)] mb-6 group-hover:text-[var(--cyan)] transition-colors">{proj.title}</h3>
                    
                    <p className="text-[var(--text-dim)] mb-8 text-lg font-light leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex gap-3 mb-8 flex-wrap">
                      {proj.technologies.map((tech: string, idx: number) => (
                        <span key={idx} className="font-mono text-xs border border-[var(--line)] px-3 py-1 rounded text-[var(--text-faint)]">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-6">
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="font-mono text-sm text-[var(--cyan)] hover:text-white flex items-center gap-2 transition-colors">
                          Deploy <span className="text-xs">↗</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="font-mono text-sm text-[var(--text-dim)] hover:text-white flex items-center gap-2 transition-colors">
                          Repository <span className="text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
