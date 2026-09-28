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
        <h2 className="h2 reveal-item">Let&apos;s build something that needs to work.</h2>
        <p className="reveal-item contact-lede">
          I&apos;m open to full-stack, backend, and AI engineering opportunities.
        </p>
        <p className="reveal-item contact-lede contact-lede--last">
          If you&apos;re working on a product where scalability, reliability, or a difficult
          engineering problem actually matters, let&apos;s talk.
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
            <div className="line out">
              Full Stack Developer · Backend Systems · AI/LLM · Delhi, India
            </div>
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
