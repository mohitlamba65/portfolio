import { unstable_cache, revalidateTag } from "next/cache";
import type { GithubLiveSnapshot } from "@/types/portfolio";
import { fetchGithubLiveStats } from "@/lib/github-stats";

export const GITHUB_STATS_CACHE_TAG = "github-stats";
const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours

export function revalidateGithubStatsCache(): void {
  revalidateTag(GITHUB_STATS_CACHE_TAG, "max");
}

export async function getCachedGithubLiveStats(
  username: string,
  excludeForks: boolean
): Promise<GithubLiveSnapshot> {
  const cached = unstable_cache(
    async (login: string, noForks: boolean) => {
      const live = await fetchGithubLiveStats(login, noForks);
      return { ...live, fetchedAt: new Date().toISOString() } satisfies GithubLiveSnapshot;
    },
    [GITHUB_STATS_CACHE_TAG, username, String(excludeForks)],
    { revalidate: REVALIDATE_SECONDS, tags: [GITHUB_STATS_CACHE_TAG] }
  );

  return cached(username, excludeForks);
}
