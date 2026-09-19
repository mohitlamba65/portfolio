"use client";

import HeroCanvas from "@/components/ui/HeroCanvas";
import { useEffect, useRef, useState } from "react";

export default function ControlRoomHero({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedRole, setTypedRole] = useState("Backend Engineer");

  const roles = [
    "Backend Engineer",
    "AI / Agentic Systems Builder",
    "Distributed Systems Architect",
    "High-Throughput Pipeline Engineer"
  ];

  useEffect(() => {
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeLoop = () => {
      const currentRole = roles[roleIdx];
      if (!isDeleting) {
        charIdx++;
        setTypedRole(currentRole.slice(0, charIdx));
        if (charIdx === currentRole.length) {
          isDeleting = true;
          timeoutId = setTimeout(typeLoop, 2000);
          return;
        }
      } else {
        charIdx--;
        setTypedRole(currentRole.slice(0, charIdx));
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          timeoutId = setTimeout(typeLoop, 400);
          return;
        }
      }
      timeoutId = setTimeout(typeLoop, isDeleting ? 40 : 80);
    };

    timeoutId = setTimeout(typeLoop, 600);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const reveals = sectionRef.current?.querySelectorAll(".reveal");
      reveals?.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add("in");
        }, i * 120);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen relative flex flex-col justify-center py-24 sm:py-32 border-b border-[var(--line)] overflow-hidden"
    >
      <HeroCanvas />

      <div className="section-inner relative z-10">
        {/* Eyebrow Status */}
        <div className="reveal flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(53,231,199,0.7)] animate-[pulse_2s_infinite]" />
          <span className="font-mono text-xs tracking-widest text-[var(--cyan)] uppercase font-semibold">
            AVAILABLE FOR BACKEND · AI ENGINEERING ROLES // {profile?.location || "Delhi, India"}
          </span>
        </div>

        {/* Hero Name */}
        <h1 className="reveal text-5xl sm:text-7xl lg:text-8xl font-display font-bold text-[var(--text)] tracking-tight leading-none mb-6">
          {profile?.name || "Mohit Lamba"}
        </h1>

        {/* Dynamic Typing Role */}
        <div className="reveal flex items-center gap-3 font-mono text-xl sm:text-2xl text-[var(--cyan)] mb-8">
          <span>&gt;</span>
          <span>{typedRole}</span>
          <span className="w-2.5 h-6 bg-[var(--cyan)] animate-[blink_1s_infinite]" />
        </div>

        {/* Tagline Narrative */}
        <p className="reveal text-lg sm:text-xl text-[var(--text-dim)] font-light leading-relaxed max-w-3xl mb-12">
          {profile?.bio ||
            "I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3am. Focused on making AI agents and distributed systems truly reliable in production."}
        </p>

        {/* Action CTAs */}
        <div className="reveal flex flex-wrap gap-4">
          <a
            href="#projects"
            className="btn-primary px-8 py-3.5 rounded-[var(--radius)] font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 uppercase shadow-lg shadow-teal-500/10"
          >
            [ SEE WHAT I'VE SHIPPED ]
          </a>
          <a
            href="#contact"
            className="btn-ghost px-8 py-3.5 rounded-[var(--radius)] border border-[var(--line)] text-[var(--text-dim)] font-mono text-xs sm:text-sm tracking-wider transition-all duration-200 uppercase hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
          >
            / GET IN TOUCH
          </a>
        </div>
      </div>

      {/* Scroll cue indicator */}
      <div className="absolute bottom-8 left-6 sm:left-12 md:left-16 lg:left-24 flex flex-col items-center gap-2 font-mono text-[10px] text-[var(--text-faint)] tracking-widest z-10 pointer-events-none hidden sm:flex">
        <span>SCROLL</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--cyan)] to-transparent animate-[cuemove_2s_infinite]" />
      </div>
    </section>
  );
}

