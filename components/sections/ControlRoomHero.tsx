"use client";

import HeroCanvas from "@/components/ui/HeroCanvas";
import { useEffect, useRef } from "react";

export default function ControlRoomHero({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Simple reveal animation for hero text
    const timer = setTimeout(() => {
      const reveals = sectionRef.current?.querySelectorAll(".reveal");
      reveals?.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add("in");
        }, i * 150);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="min-h-screen relative flex items-center pt-20">
      <HeroCanvas />
      
      <div className="relative z-10 w-full">
        {/* Subtle sys-status header */}
        <div className="reveal flex items-center gap-3 mb-12">
          <div className="w-2 h-2 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(53,231,199,0.5)]" />
          <span className="font-mono text-xs tracking-widest text-[var(--cyan)] uppercase">
            System Online // {profile.location || "Global"}
          </span>
        </div>

        {/* Quiet but strong single-sentence headline */}
        <h1 className="reveal text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[var(--text)] leading-[1.2] max-w-4xl tracking-tight">
          I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3am<span className="inline-block w-3 h-3 md:w-4 md:h-4 ml-2 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(53,231,199,0.5)] animate-[pulse_2s_infinite]" />
        </h1>
        
        {/* Actions */}
        <div className="reveal mt-16 flex gap-6">
          <a href="#projects" className="btn-primary px-8 py-3 rounded font-mono text-sm tracking-wide transition-transform">
            [ VIEW ARCHITECTURE ]
          </a>
          <a href="#contact" className="btn-ghost px-8 py-3 rounded border border-[var(--line)] text-[var(--text-dim)] font-mono text-sm tracking-wide transition-all hover:border-[var(--cyan)] hover:text-[var(--cyan)]">
            / INIT CONTACT
          </a>
        </div>
      </div>
    </section>
  );
}
