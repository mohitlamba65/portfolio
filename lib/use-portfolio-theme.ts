"use client";

import { useEffect, useState } from "react";

export function usePortfolioTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () => {
      const t = document.documentElement.getAttribute("data-theme");
      setTheme(t === "light" ? "light" : "dark");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
