import type { GithubStatsConfig } from "@/types/portfolio";

export function defaultGithubStatsConfig(): GithubStatsConfig {
  return {
    syncEnabled: false,
    excludeForks: true,
    overrides: {
      githubContributions: false,
      publicRepos: false,
      totalCommits: false,
    },
  };
}
