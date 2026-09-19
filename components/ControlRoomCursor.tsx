"use client";

import { useEffect, useState } from "react";

export default function ControlRoomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Disable on small screens
    if (window.innerWidth <= 900) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const addActive = () => setActive(true);
    const removeActive = () => setActive(false);

    window.addEventListener("mousemove", onMouseMove);

    // Attach to interactive elements
    const attachHover = () => {
      document.querySelectorAll('a, button, .navdot, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', addActive);
        el.addEventListener('mouseleave', removeActive);
      });
    };

    attachHover();

    // Re-attach if DOM changes
    const observer = new MutationObserver(() => {
      attachHover();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        id="cursor-dot"
        style={{ left: pos.x, top: pos.y }}
        className="fixed pointer-events-none z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-[var(--cyan)] hidden md:block"
      />
      <div
        id="cursor-ring"
        style={{ left: pos.x, top: pos.y }}
        className={`fixed pointer-events-none z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all duration-200 hidden md:block ${
          active 
            ? "w-[52px] h-[52px] border-[var(--cyan)] bg-[rgba(53,231,199,0.08)]" 
            : "w-[30px] h-[30px] border-[rgba(53,231,199,0.4)]"
        }`}
      />
    </>
  );
}
