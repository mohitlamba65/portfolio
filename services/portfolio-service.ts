import { PortfolioRepository } from "@/lib/storage/portfolio-repo";
import { defaultGithubStatsConfig } from "@/lib/github-config";
import { resolveEffectiveStats } from "@/lib/merge-stats";
import {
  fetchGithubLiveStatsForProfile,
} from "@/lib/github-stats";
import {
  revalidateGithubStatsCache,
} from "@/lib/github-stats-cache";
import { resolveGithubUsername } from "@/lib/github-username";
import {
  PortfolioData,
  Profile,
  Project,
  Skill,
  SystemStats,
  WorkExperience,
  GithubLiveSnapshot,
} from "@/types/portfolio";
import fs from "fs/promises";
import path from "path";

export class PortfolioService {
  /** Raw CMS JSON — use in admin saves. */
  static async getPortfolioForAdmin(): Promise<PortfolioData> {
    return await PortfolioRepository.getPortfolioData();
  }

  /** Public-facing data with merged GitHub stats when sync is enabled. */
  static async getPortfolio(): Promise<PortfolioData> {
    const data = await PortfolioRepository.getPortfolioData();
    const stats = await resolveEffectiveStats(data.stats, data.profile);
    return { ...data, stats };
  }

  static async updateProfile(profileUpdates: Partial<Profile>): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.profile = {
      ...current.profile,
      ...profileUpdates,
      socialLinks: {
        ...current.profile.socialLinks,
        ...(profileUpdates.socialLinks || {}),
      },
    };
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async updateStats(statsUpdates: Partial<SystemStats>): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    const { github, ...rest } = statsUpdates;
    current.stats = {
      ...current.stats,
      ...rest,
      ...(github
        ? {
            github: {
              ...(current.stats.github ?? defaultGithubStatsConfig()),
              ...github,
              overrides: {
                ...(current.stats.github?.overrides ?? {}),
                ...(github.overrides ?? {}),
              },
            },
          }
        : {}),
    };
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async refreshGithubStats(): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    const gh = { ...(current.stats.github ?? defaultGithubStatsConfig()), syncEnabled: true };
    const username = resolveGithubUsername(current.profile.socialLinks.github, gh.username);
    if (!username) {
      throw new Error("GitHub username not configured");
    }

    revalidateGithubStatsCache();
    const excludeForks = gh.excludeForks !== false;

    try {
      const live = await fetchGithubLiveStatsForProfile(
        current.profile.socialLinks.github,
        gh.username,
        excludeForks
      );
      const snapshot: GithubLiveSnapshot = {
        ...live,
        fetchedAt: new Date().toISOString(),
      };

      current.stats.github = {
        ...gh,
        username: gh.username ?? username,
        lastSyncedAt: snapshot.fetchedAt,
        lastSyncError: undefined,
        liveSnapshot: snapshot,
      };

      await PortfolioRepository.savePortfolioData(current);
      return await this.getPortfolioForAdmin();
    } catch (err) {
      const message = err instanceof Error ? err.message : "GitHub sync failed";
      current.stats.github = {
        ...gh,
        username: gh.username ?? username,
        lastSyncError: message,
      };
      await PortfolioRepository.savePortfolioData(current);
      throw err;
    }
  }

  /** Called from Vercel cron — refresh when sync is enabled. */
  static async cronRefreshGithubStatsIfEnabled(): Promise<{ refreshed: boolean; error?: string }> {
    const current = await PortfolioRepository.getPortfolioData();
    if (!current.stats.github?.syncEnabled) {
      return { refreshed: false };
    }
    try {
      await this.refreshGithubStats();
      return { refreshed: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "GitHub sync failed";
      return { refreshed: false, error: message };
    }
  }

  static async updateExperiences(experiences: WorkExperience[]): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.experiences = experiences;
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async updateProjects(projects: Project[]): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.projects = projects;
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async updateSkills(skills: Skill[]): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.skills = skills;
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async saveAll(data: PortfolioData): Promise<PortfolioData> {
    return await PortfolioRepository.savePortfolioData(data);
  }

  static async resetToDefault(): Promise<PortfolioData> {
    const defaultFile = path.join(process.cwd(), "data", "portfolio-default.json");
    const content = await fs.readFile(defaultFile, "utf-8");
    const defaultData = JSON.parse(content) as PortfolioData;
    return await PortfolioRepository.savePortfolioData(defaultData);
  }
}
