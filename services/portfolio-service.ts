import { PortfolioRepository } from "@/lib/storage/portfolio-repo";
import { PortfolioData, Profile, Project, Skill, SystemStats, WorkExperience } from "@/types/portfolio";
import fs from "fs/promises";
import path from "path";

export class PortfolioService {
  static async getPortfolio(): Promise<PortfolioData> {
    return await PortfolioRepository.getPortfolioData();
  }

  static async updateProfile(profileUpdates: Partial<Profile>): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.profile = {
      ...current.profile,
      ...profileUpdates,
      socialLinks: {
        ...current.profile.socialLinks,
        ...(profileUpdates.socialLinks || {}),
      }
    };
    return await PortfolioRepository.savePortfolioData(current);
  }

  static async updateStats(statsUpdates: Partial<SystemStats>): Promise<PortfolioData> {
    const current = await PortfolioRepository.getPortfolioData();
    current.stats = {
      ...current.stats,
      ...statsUpdates,
    };
    return await PortfolioRepository.savePortfolioData(current);
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
