"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Layers, Briefcase, FolderGit2, Terminal, FileText } from "lucide-react";

interface RecruiterTabsProps {
  resumeUrl?: string;
}

export default function RecruiterTabs({ resumeUrl = "/resume.pdf" }: RecruiterTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { label: "About & Core", href: "/", icon: User, active: pathname === "/" || pathname === "/about" },
    { label: "3D Tech Stack", href: "/skills", icon: Layers, active: pathname.startsWith("/skills") },
    { label: "Engineering Journey", href: "/experience", icon: Briefcase, active: pathname.startsWith("/experience") },
    { label: "Featured Systems", href: "/projects", icon: FolderGit2, active: pathname.startsWith("/projects") },
    { label: "Terminal & Contact", href: "/contact", icon: Terminal, active: pathname.startsWith("/contact") },
  ];

  return (
    <div className="w-full flex items-center justify-between gap-4 py-3 px-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-sm mb-8 overflow-x-auto">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                tab.active
                  ? "bg-teal-500 text-white dark:bg-teal-400 dark:text-slate-950 font-semibold shadow-md shadow-teal-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-2">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm"
        >
          <FileText size={14} />
          <span>Resume.pdf</span>
        </a>
      </div>
    </div>
  );
}
