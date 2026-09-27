/** Extract GitHub login from profile URL or env fallback. */
export function parseGithubUsername(githubUrl: string | undefined): string | null {
  if (!githubUrl?.trim()) return null;
  try {
    const url = githubUrl.startsWith("http") ? new URL(githubUrl) : new URL(`https://${githubUrl}`);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0]?.replace(/\.git$/, "") ?? null;
  } catch {
    const match = githubUrl.match(/github\.com\/([^/?#]+)/i);
    return match?.[1] ?? null;
  }
}

export function resolveGithubUsername(
  githubUrl: string | undefined,
  configuredUsername?: string | null
): string | null {
  const fromConfig = configuredUsername?.trim();
  if (fromConfig) return fromConfig;
  const fromEnv = process.env.GITHUB_USERNAME?.trim();
  if (fromEnv) return fromEnv;
  return parseGithubUsername(githubUrl);
}
