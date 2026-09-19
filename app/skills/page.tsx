import { PortfolioService } from "@/services/portfolio-service";
import SkillsView from "@/components/sections/SkillsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "3D Tech Stack & System Core | Mohit Lamba",
  description: "Interactive 3D skills constellation and technical stack proficiency.",
};

export default async function SkillsPage() {
  const data = await PortfolioService.getPortfolio();

  return <SkillsView skills={data.skills} />;
}
