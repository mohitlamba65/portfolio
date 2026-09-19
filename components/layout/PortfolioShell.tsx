"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/layout/CommandPalette";
import RecruiterTabs from "@/components/layout/RecruiterTabs";
import { PortfolioData } from "@/types/portfolio";

interface PortfolioShellProps {
  children: React.ReactNode;
  initialData: PortfolioData;
}

export default function PortfolioShell({
  children,
  initialData,
}: PortfolioShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialData);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Keep portfolio data in sync or refresh on navigation
  useEffect(() => {
    const handleOpen = () => setPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  // Admin view has its own full-screen layout
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-teal-500/30 selection:text-teal-300">
      {/* Left Vertical Cyber Sidebar */}
      <Sidebar
        navbarAvatarUrl={portfolio.profile.navbarAvatarUrl}
        onOpenCommandPalette={() => setPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <div className="pl-0 md:pl-20 min-h-screen flex flex-col transition-all duration-300">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-20">
          {/* Top Recruiter Quick Tabs Bar */}
          <RecruiterTabs resumeUrl={portfolio.profile.resumeUrl} />

          {/* Page View */}
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} {portfolio.profile.name}. All systems operational.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hover:text-teal-400 transition-colors"
            >
              Command Palette [⌘K]
            </button>
            <span>·</span>
            <a
              href={portfolio.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Resume.pdf
            </a>
          </div>
        </footer>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        email={portfolio.profile.socialLinks.email}
        resumeUrl={portfolio.profile.resumeUrl}
        githubUrl={portfolio.profile.socialLinks.github}
      />
    </div>
  );
}
