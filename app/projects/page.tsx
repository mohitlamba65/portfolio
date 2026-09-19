import { PortfolioService } from "@/services/portfolio-service";
import ProjectsView from "@/components/sections/ProjectsView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Featured Systems & Architectures | Mohit Lamba",
  description: "Distributed backends, agentic swarms, and high-concurrency systems.",
};

export default async function ProjectsPage() {
  const data = await PortfolioService.getPortfolio();

  return <ProjectsView projects={data.projects} />;
}
