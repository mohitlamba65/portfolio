import { NextRequest, NextResponse } from "next/server";
import { PortfolioService } from "@/services/portfolio-service";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await PortfolioService.cronRefreshGithubStatsIfEnabled();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("GET /api/cron/github-stats error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
