import type { ReactNode } from "react";
import { Profile } from "@/types/portfolio";

interface IslandFooterProps {
  profile: Profile;
}

function SocialIcon({ children }: { children: ReactNode }) {
  return (
    <span className="footer-social-icon" aria-hidden>
      {children}
    </span>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
      <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.378-.195-1.849-.662l-4.669-4.682c-.467-.467-.702-1.087-.702-1.794 0-.706.235-1.275.702-1.773l4.669-4.682c.471-.467 1.062-.697 1.849-.697.662 0 1.244.139 1.823.662l2.697 2.606c.435.445.711 1.031.711 1.657 0 .626-.276 1.212-.711 1.657zm.989-8.274l-2.882-2.843c-.467-.58-1.062-.871-1.795-.871-.734 0-1.328.291-1.794.871l-4.528 4.572c-.495.467-.743 1.029-.743 1.687 0 .659.248 1.271.743 1.776l4.528 4.686c.466.505 1.06.758 1.794.758.733 0 1.328-.253 1.795-.758l2.882-2.862c.466-.505.699-1.122.699-1.858 0-.735-.233-1.352-.699-1.857z" />
    </svg>
  );
}

export default function IslandFooter({ profile }: IslandFooterProps) {
  const year = new Date().getFullYear();
  const name = profile.name || "Mohit Lamba";
  const { github, linkedin, email, leetcode } = profile.socialLinks;
  const leetcodeUrl = leetcode || "https://leetcode.com/u/explo43/";

  const socials = [
    github && { href: github, label: "GitHub", icon: <GitHubIcon /> },
    linkedin && { href: linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
    email && { href: `mailto:${email}`, label: "Email", icon: <MailIcon /> },
    leetcodeUrl && { href: leetcodeUrl, label: "LeetCode", icon: <LeetCodeIcon /> },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[];

  return (
    <footer>
      <span>
        © {year} {name}. All rights reserved.
      </span>
      <div className="footer-socials" aria-label="Social links">
        {socials.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={item.label}
            title={item.label}
          >
            <SocialIcon>{item.icon}</SocialIcon>
          </a>
        ))}
      </div>
    </footer>
  );
}
