"use client";

export default function ControlRoomFooter() {
  return (
    <footer className="w-full py-12 border-t border-[var(--line)] bg-[var(--bg)] text-xs font-mono text-[var(--text-faint)]">
      <div className="section-inner flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} Mohit Lamba — Backend & AI Systems Engineer
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mohitlamba65"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--cyan)] transition-colors"
          >
            GITHUB
          </a>
          <a
            href="https://www.linkedin.com/in/mohit-lamba-b39a3b35a"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--cyan)] transition-colors"
          >
            LINKEDIN
          </a>
          <a
            href="/admin"
            className="hover:text-[var(--amber)] transition-colors"
          >
            SYS_ADMIN
          </a>
        </div>
      </div>
    </footer>
  );
}
