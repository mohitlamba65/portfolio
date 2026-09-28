import type { AboutPhotoCardConfig, AboutPrincipleItem, Profile } from "@/types/portfolio";

export const TRAIT_ACCENT_COLORS = [
  "var(--cyan)",
  "var(--amber)",
  "var(--violet)",
  "var(--pink)",
] as const;

export function defaultAboutPhotoCard(name = "Mohit Lamba"): AboutPhotoCardConfig {
  return {
    metaLine1: `ENGINEER: ${name.toUpperCase()}`,
    metaLine2: "FOCUS: SCALE · PERFORMANCE · RELIABILITY",
    traits: [
      "I Build Products",
      "I Solve System Problems",
      "I Optimize What Matters",
      "I KEEP LEARNING",
    ],
  };
}

export function resolveAboutPhotoCard(profile: Profile): AboutPhotoCardConfig {
  const defaults = defaultAboutPhotoCard(profile.name);
  const card = profile.aboutPhotoCard;
  const metaLine1 = (card?.metaLine1 ?? defaults.metaLine1!).replace(
    /\{name\}/gi,
    profile.name.toUpperCase()
  );
  return {
    metaLine1,
    metaLine2: card?.metaLine2 ?? defaults.metaLine2,
    traits:
      card?.traits?.map((t) => t.trim()).filter(Boolean).length
        ? card!.traits!.map((t) => t.trim()).filter(Boolean)
        : defaults.traits,
  };
}

export const DEFAULT_ABOUT_PRINCIPLES: AboutPrincipleItem[] = [
  { code: "01", title: "SOLID", desc: "Every class has one reason to change. Makes large systems survivable." },
  { code: "02", title: "Clean Architecture", desc: "Business logic that doesn't know or care what database it's talking to." },
  { code: "03", title: "Hexagonal Architecture", desc: "Ports and adapters, so swapping a provider is a config change, not a rewrite." },
  { code: "04", title: "System Design", desc: "Thinking in failure modes and load before writing the first line." },
];

export function resolveAboutPrinciples(profile: Profile): AboutPrincipleItem[] {
  const items = profile.aboutPrinciples?.filter((p) => p.title?.trim());
  if (items?.length) {
    return items.map((p, i) => ({
      code: p.code || String(i + 1).padStart(2, "0"),
      title: p.title,
      desc: p.desc ?? "",
    }));
  }
  return DEFAULT_ABOUT_PRINCIPLES;
}
