"use client";

import { useEffect } from "react";

export default function IslandCursor() {
  useEffect(() => {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    const move = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Bind hover active class
  useEffect(() => {
    const bindHovers = () => {
      const ring = document.getElementById("cursor-ring");
      if (!ring) return;
      document.querySelectorAll("a, button, .filter-btn, .module, .stack-card").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("active"));
        el.addEventListener("mouseleave", () => ring.classList.remove("active"));
      });
    };
    bindHovers();
    // re-bind on DOM mutations (stack grid re-renders)
    const obs = new MutationObserver(bindHovers);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div id="cursor-dot" />
      <div id="cursor-ring" />
    </>
  );
}