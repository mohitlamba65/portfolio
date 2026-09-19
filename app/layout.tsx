import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import PortfolioShell from "@/components/layout/PortfolioShell";
import { PortfolioService } from "@/services/portfolio-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await PortfolioService.getPortfolio();
  return {
    title: `${data.profile.name} — ${data.profile.subTitle}`,
    description: data.profile.headline,
    keywords: [
      "Mohit Lamba",
      "Backend Engineer",
      "AI Systems",
      "LangGraph",
      "RabbitMQ",
      "Distributed Systems",
      "5M Users Scale",
    ],
    authors: [{ name: data.profile.name }],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const portfolioData = await PortfolioService.getPortfolio();

  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <PortfolioShell initialData={portfolioData}>
            {children}
          </PortfolioShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
