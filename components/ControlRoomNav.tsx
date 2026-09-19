"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ControlRoomNav({
  avatarUrl,
}: {
  avatarUrl?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Nav shrink logic
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Progress bar logic
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledProgress = (winScroll / height) * 100;
      setProgress(scrolledProgress);

      // Intersection observer for sections to highlight nav dots
      const sections = document.querySelectorAll("section");
      sections.forEach(sec => {
        const top = window.scrollY;
        const offset = (sec as HTMLElement).offsetTop - 150;
        const height = (sec as HTMLElement).offsetHeight;
        const id = sec.getAttribute("id");
        if (top >= offset && top < offset + height && id) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <div id="progress" style={{ width: `${progress}%` }} />
      <nav
        id="sidenav"
        className={`fixed top-1/2 -translate-y-1/2 left-8 z-50 bg-[var(--bg-panel)] border border-[var(--line)] py-8 px-6 rounded-[var(--radius)] flex flex-col items-center gap-12 transition-all duration-300 hidden md:flex ${
          scrolled ? "w-[80px]" : "w-[240px]"
        }`}
      >
        <div className="logo text-2xl font-display font-bold text-[var(--cyan)] shrink-0 h-10 w-10 flex items-center justify-center rounded-full overflow-hidden bg-[var(--bg-panel-2)] border border-[var(--line)] relative group">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
          ) : (
            <span>ML</span>
          )}
        </div>

        <div className="nav-links flex flex-col gap-6 w-full items-center">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`navdot group relative flex items-center w-full min-h-[24px] ${
                  scrolled ? "justify-center" : "justify-between px-2"
                } text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors`}
                data-tooltip={item.label}
              >
                {!scrolled && (
                  <span className={`label text-xs uppercase tracking-widest font-mono transition-opacity ${isActive ? "text-[var(--cyan)] font-bold" : ""}`}>
                    {item.label}
                  </span>
                )}
                <span
                  className={`dot w-2 h-2 rounded-full border border-current transition-all ${
                    isActive ? "bg-[var(--cyan)] border-[var(--cyan)] shadow-[0_0_8px_rgba(53,231,199,0.5)]" : "bg-transparent"
                  }`}
                />
              </a>
            );
          })}
        </div>

        <div className="vertical-line w-[1px] h-24 bg-gradient-to-b from-[var(--line)] to-transparent mt-auto" />
      </nav>
    </>
  );
}
