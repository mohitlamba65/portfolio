"use client";

import React, { useState, useRef, useEffect } from "react";
import { Profile } from "@/types/portfolio";
import {
  Terminal as TerminalIcon,
  Mail,
  FileText,
  Copy,
  Check,
  Send,
  Sparkles,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface ContactTerminalViewProps {
  profile: Profile;
}

interface CommandLog {
  id: string;
  command: string;
  response: React.ReactNode;
}

export default function ContactTerminalView({
  profile,
}: ContactTerminalViewProps) {
  const [copied, setCopied] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init",
      command: "welcome",
      response: (
        <div className="text-slate-400 space-y-1 text-xs font-mono">
          <div>Mohit Lamba Systems Shell [Version 3.8.4]</div>
          <div>Type <span className="text-teal-400 font-bold">&apos;help&apos;</span> to see available commands or click quick actions below.</div>
        </div>
      ),
    },
  ]);

  // Recruiter direct contact form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.socialLinks.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let res: React.ReactNode;

    switch (cmd) {
      case "help":
        res = (
          <div className="space-y-1 text-xs font-mono text-slate-300">
            <div><span className="text-teal-400 font-semibold">about</span> - Brief overview and headline</div>
            <div><span className="text-teal-400 font-semibold">scale</span> - High throughput scale metrics (EY 5M+ users)</div>
            <div><span className="text-teal-400 font-semibold">resume</span> - Download official resume PDF</div>
            <div><span className="text-teal-400 font-semibold">email</span> - Display contact email</div>
            <div><span className="text-teal-400 font-semibold">github</span> - Mohit&apos;s GitHub repository link</div>
            <div><span className="text-teal-400 font-semibold">clear</span> - Clear terminal session</div>
          </div>
        );
        break;
      case "about":
        res = <div className="text-xs font-mono text-slate-300">{profile.headline}</div>;
        break;
      case "scale":
        res = (
          <div className="text-xs font-mono text-amber-400">
            Enterprise WhatsApp Platform: 5,000,000+ Active Users | RabbitMQ &amp; Redis Queues | 99.99% Uptime
          </div>
        );
        break;
      case "resume":
        window.open(profile.resumeUrl, "_blank");
        res = <div className="text-xs font-mono text-teal-400">Opening resume at {profile.resumeUrl}...</div>;
        break;
      case "email":
        res = <div className="text-xs font-mono text-teal-300">{profile.socialLinks.email}</div>;
        break;
      case "github":
        window.open(profile.socialLinks.github, "_blank");
        res = <div className="text-xs font-mono text-teal-400">Opening {profile.socialLinks.github}...</div>;
        break;
      case "clear":
        setLogs([]);
        setTerminalInput("");
        return;
      default:
        res = (
          <div className="text-xs font-mono text-rose-400">
            Command not recognized: &apos;{cmd}&apos;. Type &apos;help&apos; for available options.
          </div>
        );
    }

    setLogs((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, command: cmd, response: res },
    ]);
    setTerminalInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${profile.socialLinks.email}?subject=Recruiter Inquiry from ${encodeURIComponent(
      formName
    )}&body=${encodeURIComponent(
      `From: ${formName} (${formEmail})\n\nMessage:\n${formMessage}`
    )}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-tab-enter">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-mono tracking-widest uppercase">
          <span>—</span> CONTACT &amp; INTERACTIVE SHELL
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Let&apos;s Build Resilient Systems Together
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Interested in discussing high-scale backend engineering, distributed systems, or agentic AI architectures? Reach out via terminal, email, or recruiter dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Terminal */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden min-h-[440px]">
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-300 font-semibold">
                mohit@systems:~
              </span>
            </div>
            <span className="text-[11px] text-teal-400 font-mono">
              sh · zsh
            </span>
          </div>

          {/* Terminal Body */}
          <div
            className="flex-1 p-5 overflow-y-auto space-y-4 font-mono text-xs"
            onClick={() => inputRef.current?.focus()}
          >
            {logs.map((log) => (
              <div key={log.id} className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-teal-400">mohit@systems:~$</span>
                  <span className="text-slate-200">{log.command}</span>
                </div>
                <div className="pl-4">{log.response}</div>
              </div>
            ))}

            {/* Input Line */}
            <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
              <span className="text-teal-400">mohit@systems:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type 'help', 'scale', 'resume'..."
                className="flex-1 bg-transparent text-teal-300 placeholder-slate-600 focus:outline-none font-mono text-xs"
              />
            </form>
            <div ref={bottomRef} />
          </div>

          {/* Quick Terminal Command Pills */}
          <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex flex-wrap gap-2 text-[11px] font-mono">
            {["help", "scale", "resume", "email", "clear"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setTerminalInput(c);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-teal-400 transition-colors"
              >
                ${c}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Direct Dispatch & Contact Cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Action Card: Email & Resume */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Direct Channels
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-teal-500" />
                <span className="text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 truncate">
                  {profile.socialLinks.email}
                </span>
              </div>
              <button
                type="button"
                onClick={copyEmail}
                className="p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                title="Copy Email"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold transition-all"
              >
                <FileText size={15} />
                <span>Resume.pdf</span>
              </a>

              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-all"
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Recruiter Message Box */}
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              Send Recruiter Dispatch
            </h3>
            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono text-center">
                ✓ Dispatch initialized! Your default email client will complete sending.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3 text-xs font-mono">
                <input
                  type="text"
                  required
                  placeholder="Your Name / Company"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Role details, scale challenges, or meeting request..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-bold font-sans flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
                >
                  <Send size={15} />
                  <span>Send Dispatch</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
