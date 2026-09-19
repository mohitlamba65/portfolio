"use client";

import { useEffect, useRef, useState } from "react";

export default function ControlRoomContact({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("in");
            }, i * 150);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = terminalInput.trim().toLowerCase();
      setTerminalOutput(prev => [...prev, `guest@system:~$ ${cmd}`]);
      
      if (cmd === "help") {
        setTerminalOutput(prev => [...prev, "AVAILABLE COMMANDS:", "  contact   - Get email address", "  github    - View repositories", "  linkedin  - View professional profile", "  clear     - Clear terminal"]);
      } else if (cmd === "contact" || cmd === "email") {
        setTerminalOutput(prev => [...prev, `[INITIATING SECURE CHANNEL] -> ${profile.email || "hello@example.com"}`]);
        setTimeout(() => window.location.href = `mailto:${profile.email || "hello@example.com"}`, 1000);
      } else if (cmd === "github") {
        if (profile.githubUrl) {
          setTerminalOutput(prev => [...prev, `[ROUTING] -> ${profile.githubUrl}`]);
          setTimeout(() => window.open(profile.githubUrl, "_blank"), 1000);
        } else {
          setTerminalOutput(prev => [...prev, `[ERROR] GitHub URL not found.`]);
        }
      } else if (cmd === "linkedin") {
        if (profile.linkedinUrl) {
          setTerminalOutput(prev => [...prev, `[ROUTING] -> ${profile.linkedinUrl}`]);
          setTimeout(() => window.open(profile.linkedinUrl, "_blank"), 1000);
        } else {
          setTerminalOutput(prev => [...prev, `[ERROR] LinkedIn URL not found.`]);
        }
      } else if (cmd === "clear") {
        setTerminalOutput([]);
      } else if (cmd !== "") {
        setTerminalOutput(prev => [...prev, `command not found: ${cmd}. Type 'help' for available commands.`]);
      }
      setTerminalInput("");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 border-t border-[var(--line)] min-h-[70vh] flex flex-col justify-center">
      <div className="reveal font-mono text-sm text-[var(--cyan)] mb-12 tracking-widest uppercase">
        05 / Connection_Established
      </div>

      <div className="reveal max-w-3xl mx-auto w-full">
        <h2 className="font-display text-4xl md:text-5xl text-[var(--text)] mb-8 text-center">Ready to scale?</h2>
        <p className="text-center text-[var(--text-dim)] mb-12 font-mono text-sm">
          Execute a command below or use standard protocols to initiate contact.
        </p>

        {/* Terminal Block */}
        <div className="bg-[#04080F] border border-[var(--line)] rounded overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-text" onClick={() => inputRef.current?.focus()}>
          {/* Terminal Header */}
          <div className="bg-[var(--bg-panel-2)] px-4 py-2 flex items-center gap-2 border-b border-[var(--line)]">
            <div className="w-3 h-3 rounded-full bg-[#FF5D5D]" />
            <div className="w-3 h-3 rounded-full bg-[#FFA645]" />
            <div className="w-3 h-3 rounded-full bg-[#35E7C7]" />
            <div className="ml-4 font-mono text-xs text-[var(--text-faint)]">contact.exe - 80x24</div>
          </div>
          
          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm h-[300px] overflow-y-auto">
            <div className="text-[var(--cyan)] mb-4">
              [SYSTEM] Secure connection established.<br/>
              [SYSTEM] Type 'help' to see available commands.
            </div>
            
            <div className="space-y-2 mb-2">
              {terminalOutput.map((line, i) => (
                <div key={i} className={line.startsWith('guest@') ? 'text-[var(--text)]' : line.startsWith('[') ? 'text-[var(--amber)]' : 'text-[var(--text-dim)]'}>
                  {line}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[var(--text)]">
              <span className="text-[var(--cyan)]">guest@system:~$</span>
              <input 
                ref={inputRef}
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleCommand}
                className="bg-transparent border-none outline-none flex-1 font-mono text-[var(--text)]"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <span className="w-2 h-4 bg-[var(--text)] animate-[blink_1s_infinite]" />
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center gap-6 font-mono text-sm">
          {profile.email && <a href={`mailto:${profile.email}`} className="text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors">EMAIL</a>}
          {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors">GITHUB</a>}
          {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors">LINKEDIN</a>}
        </div>
      </div>
    </section>
  );
}
