"use client";

import { useEffect, useRef } from "react";

export default function MarqueeTicker() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      addAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAnimation() {
    if (scrollerRef.current) {
      scrollerRef.current.setAttribute("data-animated", "true");
      const scrollerInner = scrollerRef.current.querySelector(".scroller__inner");
      if (scrollerInner) {
        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true) as HTMLElement;
          duplicatedItem.setAttribute("aria-hidden", "true");
          scrollerInner.appendChild(duplicatedItem);
        });
      }
    }
  }

  const facts = [
    "5M+ USERS SERVED",
    "2770 GITHUB CONTRIBUTIONS",
    "99.99% UPTIME",
    "40+ MICROSERVICES MANAGED",
    "ZERO DATA BREACHES"
  ];

  return (
    <div className="w-full py-12 border-y border-[var(--line)] bg-[var(--bg-panel)] overflow-hidden mt-24 mb-24 relative select-none">
      <div 
        ref={scrollerRef} 
        className="scroller w-full max-w-full group"
      >
        <ul className="scroller__inner flex flex-wrap gap-8 py-4 items-center w-max group-hover:[animation-play-state:paused]">
          {facts.map((fact, i) => (
            <li key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-mono text-xl tracking-widest text-[var(--cyan)] font-bold">{fact}</span>
              <span className="text-[var(--text-faint)] text-lg">✦</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .scroller[data-animated="true"] {
          overflow: hidden;
          -webkit-mask: linear-gradient(
            90deg,
            transparent,
            white 10%,
            white 90%,
            transparent
          );
          mask: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
        }

        .scroller[data-animated="true"] .scroller__inner {
          width: max-content;
          flex-wrap: nowrap;
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 1rem));
          }
        }
      `}</style>
    </div>
  );
}
