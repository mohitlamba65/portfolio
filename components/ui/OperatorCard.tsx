"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Profile } from "@/types/portfolio";

export function OperatorCard({ profile }: { profile: Profile }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !frameRef.current) return;
    
    const card = cardRef.current;
    const frame = frameRef.current;
    
    const xTo = gsap.quickTo(frame, "rotateY", { ease: "power3", duration: 0.5 });
    const yTo = gsap.quickTo(frame, "rotateX", { ease: "power3", duration: 0.5 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation between -14 and +14 degrees
      const rotateY = ((x - centerX) / centerX) * 14;
      const rotateX = -((y - centerY) / centerY) * 14;
      
      xTo(rotateY);
      yTo(rotateX);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="flex flex-col gap-[20px]">
      <div 
        ref={cardRef} 
        className="relative perspective-[800px] cursor-crosshair w-full max-w-[320px] mx-auto sm:max-w-none"
      >
        <div 
          ref={frameRef}
          className="relative aspect-[4/5] rounded-[10px] overflow-hidden bg-[var(--bg-panel-2)] border border-[var(--border-color)] transition-colors duration-300 hover:border-[var(--signal-primary)] preserve-3d group"
        >
          {/* Corner brackets */}
          <span className="absolute top-[10px] left-[10px] w-[22px] h-[22px] border-t-2 border-l-2 border-[var(--signal-primary)] opacity-90 z-20"></span>
          <span className="absolute top-[10px] right-[10px] w-[22px] h-[22px] border-t-2 border-r-2 border-[var(--signal-primary)] opacity-90 z-20"></span>
          <span className="absolute bottom-[10px] left-[10px] w-[22px] h-[22px] border-b-2 border-l-2 border-[var(--signal-primary)] opacity-90 z-20"></span>
          <span className="absolute bottom-[10px] right-[10px] w-[22px] h-[22px] border-b-2 border-r-2 border-[var(--signal-primary)] opacity-90 z-20"></span>

          {/* Scanline */}
          <div className="absolute left-0 right-0 h-[40%] z-10 pointer-events-none mix-blend-screen animate-scanline"
               style={{
                 background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--signal-primary) 16%, transparent), transparent)'
               }}
          />

          {/* Photo */}
          <img 
            src={profile.profilePhotoUrl || "/default-avatar.svg"} 
            alt={profile.name}
            className="w-full h-full object-cover block saturate-[1.05]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
              e.currentTarget.nextElementSibling?.classList.add('flex');
            }}
          />
          <div className="hidden w-full h-full items-center justify-center font-display text-[54px] text-[var(--text-faint)]"
               style={{
                 background: 'repeating-linear-gradient(135deg, var(--bg-panel-2), var(--bg-panel-2) 10px, var(--bg-elevated) 10px, var(--bg-elevated) 20px)'
               }}>
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
      
      <div>
        <div className="mt-[12px] font-mono text-[11px] text-[var(--text-dim)] flex items-center gap-[8px]">
          <span className="w-[6px] h-[6px] rounded-full bg-[var(--signal-primary)] animate-pulse flex-shrink-0"></span>
          OPERATOR: {profile.name.toUpperCase()} — STATUS: ACTIVE
        </div>

        <div className="flex flex-wrap gap-[8px] mt-[12px]">
          <span className="font-mono text-[11px] px-[13px] py-[7px] rounded-[20px] border" style={{ color: 'var(--signal-ai)', borderColor: 'color-mix(in srgb, var(--signal-ai) 45%, var(--border-color))', backgroundColor: 'color-mix(in srgb, var(--signal-ai) 10%, transparent)' }}>Debugs at 2am</span>
          <span className="font-mono text-[11px] px-[13px] py-[7px] rounded-[20px] border" style={{ color: 'var(--signal-data)', borderColor: 'color-mix(in srgb, var(--signal-data) 45%, var(--border-color))', backgroundColor: 'color-mix(in srgb, var(--signal-data) 10%, transparent)' }}>Writes tests before demos</span>
          <span className="font-mono text-[11px] px-[13px] py-[7px] rounded-[20px] border" style={{ color: 'var(--signal-frontend)', borderColor: 'color-mix(in srgb, var(--signal-frontend) 45%, var(--border-color))', backgroundColor: 'color-mix(in srgb, var(--signal-frontend) 10%, transparent)' }}>Reads the RFC</span>
          <span className="font-mono text-[11px] px-[13px] py-[7px] rounded-[20px] border" style={{ color: 'var(--signal-infra)', borderColor: 'color-mix(in srgb, var(--signal-infra) 45%, var(--border-color))', backgroundColor: 'color-mix(in srgb, var(--signal-infra) 10%, transparent)' }}>Ships boring code, on purpose</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes scanline {
          0% { top: -40%; }
          100% { top: 100%; }
        }
        .animate-scanline {
          animation: scanline 4.5s linear infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
