"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

export default function ControlRoomContact({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const email = profile?.socialLinks?.email || "mohitlamba043@gmail.com";
  const linkedin = profile?.socialLinks?.linkedin || "https://www.linkedin.com/in/mohit-lamba-b39a3b35a";
  const github = profile?.socialLinks?.github || "https://github.com/mohitlamba65";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("in");
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = terminalInput.trim().toLowerCase();
      const newLogs = [`guest@systems:~$ ${cmd}`];

      if (cmd === "help") {
        newLogs.push(
          "AVAILABLE COMMANDS:",
          "  whoami    - Print engineering summary",
          "  contact   - Display email & contact protocol",
          "  skills    - List core competencies",
          "  github    - Open GitHub repositories",
          "  linkedin  - Open LinkedIn profile",
          "  clear     - Clear terminal buffer"
        );
      } else if (cmd === "whoami") {
        newLogs.push(
          "Mohit Lamba — Backend & AI Systems Engineer (5M+ scale, Agentic AI, Distributed Systems)"
        );
      } else if (cmd === "contact" || cmd === "email") {
        newLogs.push(`[EMAIL] -> ${email}`);
        copyToClipboard(email);
      } else if (cmd === "github") {
        newLogs.push(`[ROUTING] -> ${github}`);
        window.open(github, "_blank");
      } else if (cmd === "linkedin") {
        newLogs.push(`[ROUTING] -> ${linkedin}`);
        window.open(linkedin, "_blank");
      } else if (cmd === "skills") {
        newLogs.push("LangGraph, LangChain, PostgreSQL, Node.js, Redis, Docker, Microservices, RAG");
      } else if (cmd === "clear") {
        setTerminalOutput([]);
        setTerminalInput("");
        return;
      } else if (cmd !== "") {
        newLogs.push(`command not found: '${cmd}'. Type 'help' for available system commands.`);
      }

      setTerminalOutput((prev) => [...prev, ...newLogs]);
      setTerminalInput("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToastMessage("Email copied to clipboard");
    setTimeout(() => {
      setCopied(false);
      setToastMessage("");
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 sm:py-32 relative min-h-[80vh] flex flex-col justify-center"
    >
      <div className="section-inner">
        {/* Section Header */}
        <div className="reveal flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--cyan)] uppercase mb-4">
          <span className="w-4 h-[1px] bg-[var(--cyan)]" />
          <span>05 / CONNECTION_ESTABLISHED</span>
        </div>

        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[var(--text)] mb-4 tracking-tight">
          Let's build something that has to actually work.
        </h2>
        <p className="reveal text-base sm:text-lg text-[var(--text-dim)] font-light max-w-2xl mb-12">
          Open to backend, full-stack, and AI engineering roles. If you've got a system that needs to hold up under real production load, let's talk.
        </p>

        {/* Terminal Container */}
        <div className="reveal max-w-3xl bg-[#080B11] border border-[var(--line)] rounded-[var(--radius)] overflow-hidden shadow-2xl shadow-black/60 mb-8">
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-[var(--bg-panel-2)] border-b border-[var(--line)] flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5D5D]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFA645]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#35E7C7]" />
            <span className="ml-3 font-mono text-xs text-[var(--text-faint)]">
              mohit@systems:~ (bash)
            </span>
          </div>

          {/* Terminal Body */}
          <div
            className="p-6 font-mono text-xs sm:text-sm text-[var(--text-dim)] space-y-3 min-h-[220px] max-h-[360px] overflow-y-auto cursor-text select-text"
            onClick={() => inputRef.current?.focus()}
          >
            <div>
              <span className="text-[var(--cyan)]">mohit@systems</span>:~$ whoami
            </div>
            <div className="text-[var(--text)] pl-2">
              Backend Engineer · AI Systems · Delhi, India
            </div>

            <div>
              <span className="text-[var(--cyan)]">mohit@systems</span>:~$ cat contact.txt
            </div>
            <div className="text-[var(--text)] pl-2 space-y-1">
              <div>email: {email}</div>
              <div>linkedin: /in/mohit-lamba-b39a3b35a</div>
              <div>github: /mohitlamba65</div>
            </div>

            {terminalOutput.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.startsWith("guest@")
                    ? "text-[var(--cyan)]"
                    : line.startsWith("[")
                    ? "text-[var(--amber)] font-semibold"
                    : "text-[var(--text)] pl-2"
                }
              >
                {line}
              </div>
            ))}

            {/* Interactive Prompt */}
            <div className="flex items-center gap-2 pt-1 text-[var(--text)]">
              <span className="text-[var(--cyan)]">guest@systems:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="type 'help' or command..."
                className="bg-transparent border-none outline-none flex-1 font-mono text-[var(--text)] text-xs sm:text-sm placeholder:text-[var(--text-faint)]"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="w-2 h-4 bg-[var(--cyan)] animate-[blink_1s_infinite]" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="reveal flex flex-wrap items-center gap-4">
          <button
            onClick={() => copyToClipboard(email)}
            className="btn-primary px-6 py-3 rounded-[var(--radius)] font-mono text-xs sm:text-sm font-semibold tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer uppercase shadow-lg shadow-teal-500/10"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? "EMAIL COPIED" : "COPY EMAIL ADDRESS"}</span>
          </button>

          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost px-6 py-3 rounded-[var(--radius)] border border-[var(--line)] text-[var(--text-dim)] font-mono text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 transition-all hover:border-[var(--cyan)] hover:text-[var(--cyan)] uppercase"
          >
            <span>CONNECT ON LINKEDIN</span>
            <ExternalLink size={14} />
          </a>

          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost px-6 py-3 rounded-[var(--radius)] border border-[var(--line)] text-[var(--text-dim)] font-mono text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 transition-all hover:border-[var(--cyan)] hover:text-[var(--cyan)] uppercase"
          >
            <span>GITHUB</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-[var(--radius)] bg-[var(--bg-panel-2)] border border-[var(--cyan)] text-[var(--cyan)] font-mono text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}

