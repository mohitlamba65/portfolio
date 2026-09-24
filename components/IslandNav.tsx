"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Tab = "home" | "about" | "stack" | "work" | "experience" | "resume" | "contact";

interface IslandNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  avatarUrl?: string;
}

const NAV_TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
];

export default function IslandNav({ activeTab, onTabChange, avatarUrl }: IslandNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") || localStorage.getItem("portfolio-theme")) as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(saved);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
  };

  const handleTab = (tab: Tab) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <>
      <nav id="island" className={scrolled ? "scrolled" : ""}>
        {/* Logo */}
        <div className="island-logo">
          {avatarUrl && avatarUrl !== "/default-avatar.svg" ? (
            <Image src={avatarUrl} alt="ML" fill sizes="34px" className="object-cover" />
          ) : (
            <span>ML</span>
          )}
        </div>

        {/* Tabs */}
        <div className="island-tabs">
          {NAV_TABS.map((t) => (
            <button
              key={t.id}
              className={`island-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => handleTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="island-cta" onClick={() => handleTab("contact")}>
          Get in touch
        </button>

        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      <button
        className={`theme-toggle theme-toggle-standalone${scrolled ? " scrolled" : ""}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <svg
          className={theme === "dark" ? "" : "hidden"}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"
        >
          <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
        </svg>
        <svg
          className={theme === "light" ? "" : "hidden"}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>

      {/* Mobile menu */}
      <div id="mobile-menu" className={mobileOpen ? "open" : ""}>
        {[...NAV_TABS, { id: "contact" as Tab, label: "Contact" }].map((t) => (
          <button
            key={t.id}
            className={activeTab === t.id ? "active" : ""}
            onClick={() => handleTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}
