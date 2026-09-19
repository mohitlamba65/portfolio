"use client";

import { useEffect, useState, useCallback } from "react";
import { PortfolioData } from "@/types/portfolio";
import IslandCursor from "@/components/IslandCursor";
import IslandNav from "@/components/IslandNav";
import IslandHero from "@/components/sections/IslandHero";
import IslandAbout from "@/components/sections/IslandAbout";
import IslandStack from "@/components/sections/IslandStack";
import IslandWork from "@/components/sections/IslandWork";
import IslandExperience from "@/components/sections/IslandExperience";
import IslandContact from "@/components/sections/IslandContact";
import IslandFooter from "@/components/sections/IslandFooter";

type Tab = "home" | "about" | "stack" | "work" | "experience" | "contact";

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  // Init from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    const valid: Tab[] = ["home", "about", "stack", "work", "experience", "contact"];
    if (hash && valid.includes(hash)) setActiveTab(hash);
  }, []);

  const goToTab = useCallback((tab: string) => {
    const t = tab as Tab;
    setActiveTab(t);
    window.scrollTo(0, 0);
    history.pushState(null, "", "#" + t);
  }, []);

  // Popstate (browser back/forward)
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace("#", "") as Tab;
      if (hash) setActiveTab(hash);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Apply active class to panels using DOM (preserves CSS transitions)
  useEffect(() => {
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      const id = panel.getAttribute("id");
      panel.classList.toggle("active", id === activeTab);
    });
  }, [activeTab]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <IslandCursor />
      <IslandNav
        activeTab={activeTab}
        onTabChange={goToTab}
        avatarUrl={data.profile.navbarAvatarUrl}
      />

      <main>
        <IslandHero data={data} onTabChange={goToTab} />
        <IslandAbout profile={data.profile} stats={data.stats} />
        <IslandStack skills={data.skills} />
        <IslandWork projects={data.projects} />
        <IslandExperience experiences={data.experiences} />
        <IslandContact profile={data.profile} />
        <IslandFooter />
      </main>
    </div>
  );
}
