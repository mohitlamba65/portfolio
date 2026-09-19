import { PortfolioService } from "@/services/portfolio-service";
import ExperienceView from "@/components/sections/ExperienceView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Engineering Journey & Scale | Mohit Lamba",
  description: "Work experience and distributed backend systems shipped at EY and AI scale.",
};

export default async function ExperiencePage() {
  const data = await PortfolioService.getPortfolio();

  return <ExperienceView experiences={data.experiences} />;
}
