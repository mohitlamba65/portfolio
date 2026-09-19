import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PortfolioService } from "@/services/portfolio-service";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--display" });
const inter = Inter({ subsets: ["latin"], variable: "--sans" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--mono" });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await PortfolioService.getPortfolio();
  return {
    title: `${data.profile.name} — Backend & AI Systems Engineer`,
    description: data.profile.headline,
    keywords: [
      "Backend Engineer",
      "AI Systems",
      "Distributed Systems",
    ],
    authors: [{ name: data.profile.name }],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
