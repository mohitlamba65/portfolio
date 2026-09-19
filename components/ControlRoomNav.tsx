"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function ControlRoomNav({
  avatarUrl,
}: {
  avatarUrl?: string;
}) {
  const [activeSection, setActiveSection] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Progress bar logic
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledProgress = height > 0 ? (winScroll / height) * 100 : 0;
      setProgress(scrolledProgress);

      // Section intersection detection
      const sections = document.querySelectorAll("section[id]");
      const scrollPos = window.scrollY + 200;
      sections.forEach((sec) => {
        const top = (sec as HTMLElement).offsetTop;
        const height = (sec as HTMLElement).offsetHeight;
        const id = sec.getAttribute("id");
        if (scrollPos >= top && scrollPos < top + height && id) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Intro" },
    { id: "about", label: "About" },
    { id: "skills", label: "Stack" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top throughput progress line */}
      <div id="progress" style={{ width: `${progress}%` }} />

      {/* Desktop Left Rail Navigation */}
      <nav
        id="sidenav"
        className="fixed left-0 top-0 h-screen w-[80px] hidden md:flex flex-col items-center justify-between py-8 border-r border-[var(--line)] z-50 bg-[var(--bg)]/90 backdrop-blur-md"
      >
        {/* Top Logo / Avatar */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="group relative flex flex-col items-center gap-1 cursor-pointer"
          title="Mohit Lamba"
        >
          <div className="w-10 h-10 rounded-sm border border-[var(--line)] group-hover:border-[var(--cyan)] transition-colors overflow-hidden bg-[var(--bg-panel)] flex items-center justify-center relative shadow-sm">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Mohit Lamba"
                fill
                sizes="40px"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <span className="font-mono text-sm font-bold text-[var(--cyan)]">ML</span>
            )}
          </div>
        </a>

        {/* Center Vertical Navdots */}
        <div className="flex flex-col gap-6 items-center">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="group relative flex items-center justify-center p-2 focus:outline-none"
                aria-label={`Scroll to ${item.label}`}
              >
                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute left-[56px] px-2.5 py-1 bg-[var(--bg-panel-2)] border border-[var(--cyan)]/40 rounded-[var(--radius)] text-[11px] font-mono tracking-wider text-[var(--cyan)] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/40 z-50">
                  {item.label}
                </span>

                {/* Dot indicator */}
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--cyan)] scale-125 shadow-[0_0_10px_rgba(53,231,199,0.8)]"
                      : "bg-[var(--line)] group-hover:bg-[var(--text-dim)]"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom System Status */}
        <div className="flex flex-col items-center gap-3 font-mono text-[9px] text-[var(--text-faint)] select-none">
          <div className="w-2 h-2 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_rgba(53,231,199,0.7)] animate-[pulse_2s_infinite]" />
          <span className="[writing-mode:vertical-rl] tracking-widest text-[var(--text-dim)] uppercase">
            SYSTEM ONLINE
          </span>
        </div>
      </nav>

      {/* Mobile Top Header (< md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--line)] z-50 flex items-center justify-between px-6">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("hero");
          }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-sm border border-[var(--line)] overflow-hidden bg-[var(--bg-panel)] flex items-center justify-center relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Mohit Lamba"
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <span className="font-mono text-xs font-bold text-[var(--cyan)]">ML</span>
            )}
          </div>
          <span className="font-mono text-xs text-[var(--text-dim)] tracking-wider">MOHIT LAMBA</span>
        </a>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--cyan)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-ping" />
            <span>ONLINE</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--text-dim)] hover:text-[var(--cyan)] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[var(--bg-panel)]/95 backdrop-blur-xl border-b border-[var(--line)] z-40 p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center justify-between py-2 text-left font-mono text-sm tracking-wider uppercase transition-colors ${
                  isActive ? "text-[var(--cyan)] font-bold" : "text-[var(--text-dim)]"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-[var(--cyan)]" : "bg-[var(--line)]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

