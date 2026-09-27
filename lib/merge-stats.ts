import { getCachedGithubLiveStats } from "@/lib/github-stats-cache";
import { defaultGithubStatsConfig } from "@/lib/github-config";
import { resolveGithubUsername } from "@/lib/github-username";
import type { Profile, SystemStats } from "@/types/portfolio";

/** Merge live GitHub API values with CMS fallbacks and per-field overrides. */
export async function resolveEffectiveStats(
  stats: SystemStats,
  profile: Profile
): Promise<SystemStats> {
  const gh = stats.github ?? defaultGithubStatsConfig();
  if (!gh.syncEnabled) {
    return stats;
  }

  const username = resolveGithubUsername(profile.socialLinks.github, gh.username);
  if (!username) {
    return {
      ...stats,
      github: {
        ...gh,
        lastSyncError: "GitHub username missing (set profile link or stats.github.username)",
      },
    };
  }

  try {
    const live = await getCachedGithubLiveStats(username, gh.excludeForks !== false);
    const overrides = gh.overrides ?? {};

    return {
      ...stats,
      githubContributions: overrides.githubContributions
        ? stats.githubContributions
        : live.githubContributions,
      publicRepos: overrides.publicRepos ? stats.publicRepos : live.publicRepos,
      totalCommits: overrides.totalCommits ? stats.totalCommits : live.totalCommitsLastYear,
      github: {
        ...gh,
        lastSyncError: undefined,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "GitHub sync failed";
    return {
      ...stats,
      github: {
        ...gh,
        lastSyncError: message,
      },
    };
  }
}
