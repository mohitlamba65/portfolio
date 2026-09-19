import { NextResponse } from "next/server";
import { PortfolioService } from "@/services/portfolio-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await PortfolioService.getPortfolio();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}
