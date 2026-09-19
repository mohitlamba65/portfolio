import { PortfolioService } from "@/services/portfolio-service";
import PortfolioClient from "./PortfolioClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await PortfolioService.getPortfolio();
  return <PortfolioClient data={data} />;
}
