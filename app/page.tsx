import { PortfolioService } from "@/services/portfolio-service";
import AboutView from "@/components/sections/AboutView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await PortfolioService.getPortfolio();

  return <AboutView data={data} />;
}
