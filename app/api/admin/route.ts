import { NextRequest, NextResponse } from "next/server";
import { PortfolioService } from "@/services/portfolio-service";
import { isAdminPasswordConfigured, isAuthorizedAdminRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }

  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    if (action === "verify") {
      return NextResponse.json({ success: true });
    }

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
      case "github_sync_refresh":
        try {
          updated = await PortfolioService.refreshGithubStats();
        } catch (error) {
          const message = error instanceof Error ? error.message : "GitHub sync failed";
          const data = await PortfolioService.getPortfolioForAdmin();
          return NextResponse.json({ error: message, data }, { status: 502 });
        }
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
