"use client";

import { useEffect, useRef, useState } from "react";

export default function ControlRoomAbout({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState({ users: 0, contribs: 0, commits: 0, repos: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("in");
              }, i * 120);
            });

            // Animate stats
            const duration = 1200;
            const startTime = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              setCounts({
                users: Math.floor(progress * 5),
                contribs: Math.floor(progress * 2770),
                commits: Math.floor(progress * 1500),
                repos: Math.floor(progress * 56),
              });
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const pills = [
    { text: "Always bet on Postgres", color: "#35E7C7", bg: "rgba(53, 231, 199, 0.08)" },
    { text: "Logs or it didn't happen", color: "#FFA645", bg: "rgba(255, 166, 69, 0.08)" },
    { text: "Stateless > Stateful", color: "#FF5D5D", bg: "rgba(255, 93, 93, 0.08)" },
    { text: "Ship small, ship often", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.08)" },
  ];

  const principles = [
    {
      code: "01",
      title: "SOLID Principles",
      desc: "Every service & module has one distinct reason to change. Keeps complex distributed systems survivable.",
    },
    {
      code: "02",
      title: "Clean Architecture",
      desc: "Business logic stays pure and decoupled, completely agnostic to database engines or transport protocols.",
    },
    {
      code: "03",
      title: "Hexagonal Boundaries",
      desc: "Ports and adapters allow swapping AI providers or cache layers via configuration without code rewrites.",
    },
    {
      code: "04",
      title: "Resilient System Design",
      desc: "Designing for inevitable partial failures with circuit breakers, idempotency, and backpressure queues.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[var(--line)] relative"
    >
      <div className="section-inner">
        {/* Section Header */}
        <div className="reveal flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--cyan)] uppercase mb-4">
          <span className="w-4 h-[1px] bg-[var(--cyan)]" />
          <span>01 / ABOUT_ME</span>
        </div>

        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[var(--text)] mb-12 tracking-tight">
          Engineering the unseen systems that power high-scale products.
        </h2>

        {/* 2-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-[var(--text-dim)] font-light leading-relaxed">
            <p className="reveal">
              I'm a full-stack engineer who specialized into backend architecture and AI infrastructure.
              I thrive on systems where the real challenge isn't the interface — it's what happens after the request leaves the client.
            </p>
            <p className="reveal">
              At <strong className="text-[var(--text)] font-semibold">EY</strong>, I engineered core microservices for a WhatsApp engagement platform serving <strong className="text-[var(--cyan)] font-semibold">5M+ active users</strong>. That scale taught me to design for catastrophic failure modes, rigorous rate limits, and sub-millisecond database optimizations.
            </p>
            <p className="reveal">
              Today, I build production-grade <strong className="text-[var(--text)] font-semibold">Agentic AI swarms</strong> (LangGraph, LangChain, RAG, tool-calling pipelines) backed by resilient distributed queues, vector databases, and multi-tenant security layers.
            </p>

            {/* Personality Tags */}
            <div className="reveal flex flex-wrap gap-3 pt-4">
              {pills.map((pill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full font-mono text-xs font-medium tracking-wide border transition-transform hover:scale-105"
                  style={{
                    color: pill.color,
                    backgroundColor: pill.bg,
                    borderColor: `${pill.color}40`,
                  }}
                >
                  {pill.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Stats & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="reveal bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden shadow-lg shadow-black/20">
              <div className="px-6 py-4 border-b border-[var(--line)] font-mono text-xs text-[var(--text-faint)] uppercase tracking-wider flex items-center justify-between">
                <span>SYSTEM_TELEMETRY</span>
                <span className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" />
              </div>
              <div className="divide-y divide-[var(--line)]">
                <div className="px-6 py-4 flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[var(--text-dim)] uppercase">USERS ON SYSTEMS SHIPPED</span>
                  <span className="font-display font-bold text-2xl text-[var(--cyan)]">{counts.users}M+</span>
                </div>
                <div className="px-6 py-4 flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[var(--text-dim)] uppercase">GITHUB CONTRIBUTIONS</span>
                  <span className="font-display font-bold text-2xl text-[var(--cyan)]">{counts.contribs.toLocaleString()}+</span>
                </div>
                <div className="px-6 py-4 flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[var(--text-dim)] uppercase">PRODUCTION COMMITS</span>
                  <span className="font-display font-bold text-2xl text-[var(--cyan)]">{counts.commits.toLocaleString()}+</span>
                </div>
                <div className="px-6 py-4 flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[var(--text-dim)] uppercase">PUBLIC REPOSITORIES</span>
                  <span className="font-display font-bold text-2xl text-[var(--cyan)]">{counts.repos}</span>
                </div>
              </div>
            </div>

            <div className="reveal p-5 bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)]">
              <div className="font-mono text-xs text-[var(--amber)] mb-2 uppercase font-semibold">&gt; Core_Philosophy</div>
              <p className="font-mono text-xs text-[var(--text-dim)] leading-relaxed">
                "Code is read 10x more than it is written. Design with clear boundaries so anyone can refactor with zero fear."
              </p>
            </div>
          </div>
        </div>

        {/* 4 Architecture Principles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((p) => (
            <div
              key={p.code}
              className="reveal p-6 bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)] hover:border-[var(--cyan)] transition-colors group"
            >
              <div className="font-mono text-xs text-[var(--amber)] font-bold mb-3">{p.code}</div>
              <h4 className="font-display text-base font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--cyan)] transition-colors">
                {p.title}
              </h4>
              <p className="font-sans text-xs text-[var(--text-dim)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

