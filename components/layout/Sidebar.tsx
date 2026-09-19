"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Briefcase,
  Layers,
  FolderGit2,
  Terminal,
  Sun,
  Moon,
  Lock,
  Command,
} from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

interface SidebarProps {
  navbarAvatarUrl?: string;
  onOpenCommandPalette?: () => void;
}

export default function Sidebar({
  navbarAvatarUrl = "/default-avatar.svg",
  onOpenCommandPalette,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      label: "About & Systems",
      href: "/",
      icon: User,
      active: pathname === "/" || pathname === "/about",
    },
    {
      label: "Tech Stack & 3D Skills",
      href: "/skills",
      icon: Layers,
      active: pathname.startsWith("/skills"),
    },
    {
      label: "Engineering Journey",
      href: "/experience",
      icon: Briefcase,
      active: pathname.startsWith("/experience"),
    },
    {
      label: "Featured Systems",
      href: "/projects",
      icon: FolderGit2,
      active: pathname.startsWith("/projects"),
    },
    {
      label: "Terminal & Contact",
      href: "/contact",
      icon: Terminal,
      active: pathname.startsWith("/contact"),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 z-40 flex flex-col items-center justify-between py-6 px-3 bg-slate-950/80 dark:bg-[#070b12]/90 backdrop-blur-2xl border-r border-slate-800/80 dark:border-white/10 transition-all duration-300">
      {/* Top Navbar Avatar */}
      <div className="flex flex-col items-center gap-6">
        <Link
          href="/"
          className="group relative p-1 rounded-full transition-transform duration-300 hover:scale-105"
          title="Home / About"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-400/70 p-0.5 shadow-lg shadow-teal-500/20 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={navbarAvatarUrl}
              alt="Mohit Lamba Avatar"
              className="w-full h-full object-cover rounded-full group-hover:brightness-110 transition-all"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow" />
        </Link>
      </div>

      {/* Center Nav Tabs */}
      <nav className="flex flex-col items-center gap-4 my-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`relative p-3.5 rounded-2xl transition-all duration-200 group ${
                item.active
                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/40 shadow-lg shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
              }`}
            >
              <Icon size={20} className="transition-transform group-hover:scale-110" />

              {/* Active Indicator Bar */}
              {item.active && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-teal-400 shadow-sm shadow-teal-400" />
              )}

              {/* Hover Tooltip */}
              <span className="absolute left-20 ml-2 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-900 border border-white/10 text-white shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Command Palette, Theme, Admin */}
      <div className="flex flex-col items-center gap-3">
        {/* Command Palette button */}
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title="Command Menu (⌘K / Ctrl+K)"
            className="p-3 rounded-2xl text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-all duration-200 group relative"
          >
            <Command size={18} />
            <span className="absolute left-20 ml-2 px-2 py-1 text-xs font-mono rounded bg-slate-900 border border-white/10 text-white shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
              Command Palette (⌘K)
            </span>
          </button>
        )}

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          className="p-3 rounded-2xl text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all duration-200 group relative"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span className="absolute left-20 ml-2 px-2 py-1 text-xs font-mono rounded bg-slate-900 border border-white/10 text-white shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        {/* Admin Portal link */}
        <Link
          href="/admin"
          title="Admin Control Center"
          className={`p-3 rounded-2xl transition-all duration-200 group relative ${
            pathname.startsWith("/admin")
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-lg"
              : "text-slate-400 hover:text-amber-400 hover:bg-white/5"
          }`}
        >
          <Lock size={17} />
          <span className="absolute left-20 ml-2 px-2 py-1 text-xs font-mono rounded bg-slate-900 border border-white/10 text-white shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            Admin Panel
          </span>
        </Link>
      </div>
    </aside>
  );
}
