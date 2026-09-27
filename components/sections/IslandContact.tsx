"use client";

import { useEffect, useRef } from "react";
import { Profile } from "@/types/portfolio";
import { RESUME_VIEWER_PATH } from "@/lib/resume-viewer";
import { buildHireMeMailto, FileDocumentIcon, LinkedInIcon, MailIcon } from "@/components/ui/contact-icons";

interface IslandContactProps {
  profile: Profile;
}

export default function IslandContact({ profile }: IslandContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const email = profile.socialLinks?.email || "mohitlamba043@gmail.com";
  const linkedin = profile.socialLinks?.linkedin || "https://www.linkedin.com/in/mohit-lamba-b39a3b35a";
  const hireMailto = buildHireMeMailto(email, profile.name);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
  }, []);

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

        <div className="contact-actions reveal-item">
          <a href={hireMailto} className="btn btn-primary">
            <MailIcon />
            Hire me
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <LinkedInIcon />
            LinkedIn
          </a>
          {profile.resumeUrl && (
            <a href={RESUME_VIEWER_PATH} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <FileDocumentIcon />
              View resume
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
