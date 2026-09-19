import { PortfolioService } from "@/services/portfolio-service";
import ContactTerminalView from "@/components/sections/ContactTerminalView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terminal & Contact | Mohit Lamba",
  description: "Connect with Mohit Lamba for high-scale backend engineering and AI architecture roles.",
};

export default async function ContactPage() {
  const data = await PortfolioService.getPortfolio();

  return <ContactTerminalView profile={data.profile} />;
}
