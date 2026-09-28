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
  const avatarUrl = data.profile.navbarAvatarUrl || "/default-avatar.svg";
  const iconType = avatarUrl.endsWith(".svg") ? "image/svg+xml" : "image/jpeg";
  const title = `${data.profile.name} | Full Stack Developer · Backend Engineer · AI Systems`;
  const description =
    data.profile.headline ||
    "I build full-stack products, scalable backend systems, and AI workflows that hold up in production.";

  return {
    title,
    description,
    keywords: [
      "Full Stack Developer",
      "Backend Engineer",
      "AI Systems",
      "Node.js",
      "LangGraph",
      "Scalable Systems",
    ],
    authors: [{ name: data.profile.name }],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    icons: {
      icon: [{ url: "/icon", type: iconType, sizes: "32x32" }],
      apple: [{ url: "/apple-icon", type: iconType, sizes: "180x180" }],
      shortcut: ["/icon"],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={cn(fraunces.variable, inter.variable, ibmPlexMono.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}