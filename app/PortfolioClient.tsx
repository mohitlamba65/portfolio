"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PortfolioData } from "@/types/portfolio";
import IslandCursor from "@/components/IslandCursor";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import IslandNav from "@/components/IslandNav";
import IslandHero from "@/components/sections/IslandHero";
import IslandAbout from "@/components/sections/IslandAbout";
import IslandStack from "@/components/sections/IslandStack";
import IslandWork from "@/components/sections/IslandWork";
import IslandExperience from "@/components/sections/IslandExperience";
import IslandContact from "@/components/sections/IslandContact";
import IslandFooter from "@/components/sections/IslandFooter";
import gsap from "gsap";

type Tab = "home" | "about" | "stack" | "work" | "experience" | "contact";

export default function PortfolioClient({ data }: { data: PortfolioData }) {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const currentTabRef = useRef<Tab>("home");

  // Init from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Tab;
    const valid: Tab[] = ["home", "about", "stack", "work", "experience", "contact"];
    if (hash && valid.includes(hash)) {
      // Direct show without animation on first load
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      const panel = document.getElementById(hash);
      if (panel) {
        panel.classList.add("active");
        gsap.fromTo(panel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: "power2.out" });
      }
      currentTabRef.current = hash;
      setActiveTab(hash);
    }
  }, []);

  // Popstate
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace("#", "") as Tab;
      if (hash) goToTab(hash, true);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const goToTab = useCallback((tab: string, skipHash?: boolean) => {
    const t = tab as Tab;
    if (t === currentTabRef.current) return;
    const oldPanel = document.getElementById(currentTabRef.current);
    const newPanel = document.getElementById(t);
    if (!newPanel) return;

    if (oldPanel) {
      gsap.to(oldPanel, {
        opacity: 0, y: 14, duration: .22, ease: "power1.in",
        onComplete: () => {
          oldPanel.classList.remove("active");
          newPanel.classList.add("active");
          window.scrollTo(0, 0);
          gsap.fromTo(newPanel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: "power2.out" });

          // Animate items inside new panel
          const items = newPanel.querySelectorAll<HTMLElement>(".reveal-item, .principle, .proj-card, .tl-item, .module, .stack-card");
          gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: "power2.out", delay: .05 });

          // Timeline progress
          if (t === "experience") {
            const items2 = newPanel.querySelectorAll<HTMLElement>(".tl-item");
            items2.forEach(i => i.classList.add("in"));
            const timeline = newPanel.querySelector<HTMLElement>(".timeline");
            if (timeline) setTimeout(() => timeline.style.setProperty("--tl-progress", "100%"), 200);
          }

          // Stat counters
          newPanel.querySelectorAll<HTMLElement>("[data-count]").forEach(target => {
            if (target.dataset.done) return;
            target.dataset.done = "1";
            const targetNum = parseInt(target.dataset.count || "0", 10);
            const suffix = target.dataset.suffix || "";
            const digits = String(targetNum).length;
            target.textContent = "0".repeat(digits) + suffix;
            target.style.opacity = ".4";
            let ticks = 0;
            const id = setInterval(() => {
              ticks++;
              const rnd = Array.from({ length: digits }).map(() => Math.floor(Math.random() * 10)).join("");
              target.textContent = rnd + suffix;
              if (ticks >= 7) {
                clearInterval(id);
                target.style.opacity = "1";
                const obj = { v: 0 };
                gsap.to(obj, { v: targetNum, duration: 0.9, ease: "power2.out", onUpdate: () => { target.textContent = Math.floor(obj.v) + suffix; } });
              }
            }, 45);
          });
        }
      });
    } else {
      newPanel.classList.add("active");
      gsap.fromTo(newPanel, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, ease: "power2.out" });
    }

    currentTabRef.current = t;
    setActiveTab(t);
    if (!skipHash) history.pushState(null, "", "#" + t);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <StarfieldCanvas />
      <IslandCursor />
      <IslandNav
        activeTab={activeTab}
        onTabChange={goToTab as (tab: Tab) => void}
        avatarUrl={data.profile.navbarAvatarUrl}
      />

      <main className="relative z-10">
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
