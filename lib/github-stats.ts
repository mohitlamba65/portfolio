import { resolveGithubUsername } from "@/lib/github-username";
import type { GithubLiveSnapshot } from "@/types/portfolio";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const GITHUB_REST = "https://api.github.com";

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("GitHub GraphQL returned no data");
  return json.data;
}

type UserContributionsQuery = {
  user: {
    createdAt: string;
    contributionsCollection: {
      contributionCalendar: { totalContributions: number };
      totalCommitContributions: number;
    };
  } | null;
};

type UserCommitsLastYearQuery = {
  user: {
    contributionsCollection: {
      totalCommitContributions: number;
    };
  } | null;
};

/** All-time contribution count (wide date range), aligned with profile infographic totals. */
async function fetchAllTimeContributions(username: string): Promise<number> {
  const now = new Date().toISOString();
  const data = await graphql<UserContributionsQuery>(
    `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        createdAt
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
          }
          totalCommitContributions
        }
      }
    }
  `,
    { login: username, from: "2008-01-01T00:00:00Z", to: now }
  );

  if (!data.user) throw new Error(`GitHub user not found: ${username}`);
  return data.user.contributionsCollection.contributionCalendar.totalContributions;
}

async function fetchCommitsLastYear(username: string): Promise<number> {
  const to = new Date();
  const from = new Date(to);
  from.setUTCFullYear(from.getUTCFullYear() - 1);

  const data = await graphql<UserCommitsLastYearQuery>(
    `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
        }
      }
    }
  `,
    { login: username, from: from.toISOString(), to: to.toISOString() }
  );

  if (!data.user) throw new Error(`GitHub user not found: ${username}`);
  return data.user.contributionsCollection.totalCommitContributions;
}

async function fetchPublicRepoCount(username: string, excludeForks: boolean): Promise<number> {
  if (!excludeForks) {
    const res = await fetch(`${GITHUB_REST}/users/${encodeURIComponent(username)}`, {
      headers: githubHeaders(),
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error(`GitHub REST user HTTP ${res.status}`);
    const user = (await res.json()) as { public_repos?: number };
    return user.public_repos ?? 0;
  }

  let page = 1;
  let count = 0;
  const perPage = 100;

  while (page <= 10) {
    const res = await fetch(
      `${GITHUB_REST}/users/${encodeURIComponent(username)}/repos?type=owner&per_page=${perPage}&page=${page}`,
      { headers: githubHeaders(), next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error(`GitHub REST repos HTTP ${res.status}`);
    const repos = (await res.json()) as { fork?: boolean }[];
    if (!repos.length) break;
    count += repos.filter((r) => !r.fork).length;
    if (repos.length < perPage) break;
    page += 1;
  }

  return count;
}

export async function fetchGithubLiveStats(
  username: string,
  excludeForks = true
): Promise<Omit<GithubLiveSnapshot, "fetchedAt">> {
  const [githubContributions, totalCommitsLastYear, publicRepos] = await Promise.all([
    fetchAllTimeContributions(username),
    fetchCommitsLastYear(username),
    fetchPublicRepoCount(username, excludeForks),
  ]);

  return { githubContributions, totalCommitsLastYear, publicRepos };
}

export async function fetchGithubLiveStatsForProfile(
  githubUrl: string | undefined,
  configuredUsername: string | undefined | null,
  excludeForks: boolean
): Promise<Omit<GithubLiveSnapshot, "fetchedAt">> {
  const username = resolveGithubUsername(githubUrl, configuredUsername);
  if (!username) throw new Error("GitHub username not configured");
  return fetchGithubLiveStats(username, excludeForks);
}
