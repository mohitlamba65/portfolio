import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";
import { PortfolioService } from "@/services/portfolio-service";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({ subsets: ["latin"], variable: "--display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--sans", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mono", display: "swap" });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await PortfolioService.getPortfolio();
  return {
    title: `${data.profile.name} — Backend & AI Systems Engineer`,
    description: data.profile.headline || `${data.profile.name} builds backend systems, AI agents, and data pipelines that hold up in production.`,
    keywords: ["Backend Engineer", "AI Systems", "Distributed Systems", "Node.js", "LangGraph"],
    authors: [{ name: data.profile.name }],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={cn(fraunces.variable, inter.variable, ibmPlexMono.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}