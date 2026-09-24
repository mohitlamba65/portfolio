import { Profile } from "@/types/portfolio";

interface IslandFooterProps {
  profile: Profile;
}

export default function IslandFooter({ profile }: IslandFooterProps) {
  const year = new Date().getFullYear();
  const name = profile.name || "Mohit Lamba";

  return (
    <footer>
      <span>
        © {year} {name} — Next.js + vanilla CSS, clean architecture.
        {profile.resumeUrl && (
          <>
            {" · "}
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
              Resume
            </a>
          </>
        )}
      </span>
      <span>Last deployed: just now.</span>
    </footer>
  );
}
