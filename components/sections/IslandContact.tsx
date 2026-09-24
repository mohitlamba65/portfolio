"use client";

import { useEffect, useRef, useState } from "react";
import { Profile } from "@/types/portfolio";

interface IslandContactProps {
  profile: Profile;
}

export default function IslandContact({ profile }: IslandContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const email = profile.socialLinks?.email || "mohitlamba043@gmail.com";
  const linkedin = profile.socialLinks?.linkedin || "https://www.linkedin.com/in/mohit-lamba-b39a3b35a";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2200);
    });
  };

  return (
    <div ref={sectionRef} className="tab-panel" id="contact" data-panel>
      <div className="panel-inner">
        <div className="kicker">CONTACT</div>
        <h2 className="h2 reveal-item">Let&apos;s build something that has to actually work.</h2>
        <p
          className="reveal-item"
          style={{ color: "var(--text-dim)", maxWidth: "56ch", marginBottom: "36px" }}
        >
          Open to backend, full-stack, and AI engineering roles. If you&apos;ve got a system that needs
          to hold up under real load, I&apos;d like to hear about it.
        </p>

        {/* Terminal */}
        <div className="terminal reveal-item">
          <div className="term-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="term-body">
            <div className="line">
              <span className="prompt">mohit@systems</span>:~$ whoami
            </div>
            <div className="line out">Backend Engineer · AI Systems · Delhi, India</div>
            <div className="line">
              <span className="prompt">mohit@systems</span>:~$ cat contact.txt
            </div>
            <div className="line out">email: {email}</div>
            <div className="line out">
              linkedin: /in/
              {linkedin.split("/in/")[1] || "mohit-lamba-b39a3b35a"}
            </div>
            <div className="line">
              <span className="prompt">mohit@systems</span>:~${" "}
              <span className="cursor-blink" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="contact-actions reveal-item">
          <button className="btn btn-primary" onClick={copyEmail}>
            Copy email address
          </button>
          <a href={linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
            Connect on LinkedIn
          </a>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Download resume
            </a>
          )}
        </div>
      </div>

      {/* Toast */}
      <div id="toast" className={toastVisible ? "show" : ""}>
        Email copied to clipboard
      </div>
    </div>
  );
}
