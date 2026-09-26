import fs from "fs/promises";
import path from "path";
import { PortfolioService } from "@/services/portfolio-service";

function contentTypeForExt(ext: string): string {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    default:
      return "application/octet-stream";
  }
}

/** Navbar avatar bytes from CMS (public/ path), with SVG fallback. */
export async function getNavbarAvatarIcon(): Promise<{ body: Buffer; contentType: string }> {
  const data = await PortfolioService.getPortfolio();
  const avatarUrl = data.profile.navbarAvatarUrl || "/default-avatar.svg";
  const rel = avatarUrl.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", rel);

  try {
    const body = await fs.readFile(filePath);
    return { body, contentType: contentTypeForExt(path.extname(filePath).toLowerCase()) };
  } catch {
    const fallback = path.join(process.cwd(), "public", "default-avatar.svg");
    const body = await fs.readFile(fallback);
    return { body, contentType: "image/svg+xml" };
  }
}
