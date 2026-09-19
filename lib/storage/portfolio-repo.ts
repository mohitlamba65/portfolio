import fs from "fs/promises";
import path from "path";
import { PortfolioData } from "@/types/portfolio";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");
const DEFAULT_DATA_FILE = path.join(DATA_DIR, "portfolio-default.json");

export class PortfolioRepository {
  private static async ensureDirectory(): Promise<void> {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {
      // directory already exists or error
    }
  }

  static async getPortfolioData(): Promise<PortfolioData> {
    await this.ensureDirectory();

    try {
      // Try to read custom updated portfolio.json
      const content = await fs.readFile(DATA_FILE, "utf-8");
      return JSON.parse(content) as PortfolioData;
    } catch {
      // Fallback to default seed data
      try {
        const defaultContent = await fs.readFile(DEFAULT_DATA_FILE, "utf-8");
        const defaultData = JSON.parse(defaultContent) as PortfolioData;
        // Seed portfolio.json so it's ready for updates
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
        return defaultData;
      } catch (err) {
        console.error("Failed to read default portfolio data:", err);
        throw new Error("Unable to load portfolio configuration.");
      }
    }
  }

  static async savePortfolioData(data: PortfolioData): Promise<PortfolioData> {
    await this.ensureDirectory();
    data.lastUpdated = new Date().toISOString();
    const tempFile = `${DATA_FILE}.tmp`;
    
    // Atomic write via temp file
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tempFile, DATA_FILE);
    return data;
  }
}
