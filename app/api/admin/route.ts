import { NextRequest, NextResponse } from "next/server";
import { PortfolioService } from "@/services/portfolio-service";

const ADMIN_PASSCODE = process.env.ADMIN_PASSWORD || "admin123";

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key") || req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "").trim();
  return token === ADMIN_PASSCODE;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    let updated;
    switch (action) {
      case "update_profile":
        updated = await PortfolioService.updateProfile(payload);
        break;
      case "update_stats":
        updated = await PortfolioService.updateStats(payload);
        break;
      case "update_experiences":
        updated = await PortfolioService.updateExperiences(payload);
        break;
      case "update_projects":
        updated = await PortfolioService.updateProjects(payload);
        break;
      case "update_skills":
        updated = await PortfolioService.updateSkills(payload);
        break;
      case "save_all":
        updated = await PortfolioService.saveAll(payload);
        break;
      case "reset_defaults":
        updated = await PortfolioService.resetToDefault();
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("POST /api/admin error:", error);
    return NextResponse.json({ error: "Failed to update portfolio data" }, { status: 500 });
  }
}
