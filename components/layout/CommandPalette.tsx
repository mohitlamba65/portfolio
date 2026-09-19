"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  ArrowUpRight,
  Clipboard,
  FileText,
  Zap,
  Lock,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { useTheme } from "@/components/theme/ThemeProvider";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  email?: string;
  resumeUrl?: string;
  githubUrl?: string;
}

export default function CommandPalette({
  open,
  onClose,
  email = "mohitlamba65@gmail.com",
  resumeUrl = "/resume.pdf",
  githubUrl = "https://github.com/mohitlamba65",
}: CommandPaletteProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else openPalette();
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 900);
  };

  const actions = [
    {
      id: "about",
      label: "Jump to Overview & Systems",
      hint: "Tab: /about",
      icon: ArrowUpRight,
      action: () => {
        router.push("/");
        onClose();
      },
    },
    {
      id: "skills",
      label: "Inspect 3D Tech Stack & Constellation",
      hint: "Tab: /skills",
      icon: Zap,
      action: () => {
        router.push("/skills");
        onClose();
      },
    },
    {
      id: "experience",
      label: "View Engineering Journey & Scale",
      hint: "Tab: /experience",
      icon: ArrowUpRight,
      action: () => {
        router.push("/experience");
        onClose();
      },
    },
    {
      id: "projects",
      label: "Explore Featured Systems & Architecture",
      hint: "Tab: /projects",
      icon: ArrowUpRight,
      action: () => {
        router.push("/projects");
        onClose();
      },
    },
    {
      id: "contact",
      label: "Open Contact Terminal",
      hint: "Tab: /contact",
      icon: Terminal,
      action: () => {
        router.push("/contact");
        onClose();
      },
    },
    {
      id: "resume",
      label: "Download Official Resume",
      hint: resumeUrl,
      icon: FileText,
      action: () => {
        window.open(resumeUrl, "_blank");
        onClose();
      },
    },
    {
      id: "copy-email",
      label: copied ? "Email Copied to Clipboard!" : `Copy Email (${email})`,
      hint: "clipboard",
      icon: copied ? Check : Clipboard,
      action: copyEmail,
    },
    {
      id: "github",
      label: "Open GitHub Profile",
      hint: "github.com",
      icon: GithubIcon,
      action: () => {
        window.open(githubUrl, "_blank");
        onClose();
      },
    },
    {
      id: "theme",
      label: `Switch Theme to ${theme === "dark" ? "Light" : "Dark"}`,
      hint: "appearance",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
    },
    {
      id: "admin",
      label: "Open Admin Management Portal",
      hint: "secure /admin",
      icon: Lock,
      action: () => {
        router.push("/admin");
        onClose();
      },
    },
  ];

  const filtered = actions.filter((item) =>
    `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-tab-enter"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-900 dark:bg-[#0c121d] border border-slate-700/60 dark:border-white/10 shadow-2xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 dark:border-white/10 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2 text-teal-400">
            <Terminal size={14} /> mohit@systems:~$
          </span>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
            ESC
          </kbd>
        </div>

        {/* Search input */}
        <div className="p-3 border-b border-slate-800 dark:border-white/5">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered[0]) {
                filtered[0].action();
              }
            }}
            placeholder="Type a command or jump to section..."
            className="w-full px-3 py-2 bg-transparent text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
          />
        </div>

        {/* Results list */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm text-slate-300 hover:text-white hover:bg-teal-500/10 hover:border-teal-500/30 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className="text-slate-400 group-hover:text-teal-400 transition-colors"
                  />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-mono text-slate-500 group-hover:text-teal-400/80">
                  {item.hint}
                </span>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No matching command found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/50 text-[11px] font-mono text-slate-500 border-t border-slate-800/80">
          <span>↑↓ Navigate · Enter Run</span>
          <span>⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}

function openPalette() {
  // Dispatched via custom event if called outside component
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}
