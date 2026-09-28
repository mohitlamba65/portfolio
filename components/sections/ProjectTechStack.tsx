"use client";

import { Skill } from "@/types/portfolio";
import TechChipGrid from "@/components/shared/TechChipGrid";

interface ProjectTechStackProps {
  techStack: string[];
  skills: Skill[];
}

/** Project card tech row — uses shared TechChipGrid. */
export default function ProjectTechStack({ techStack, skills }: ProjectTechStackProps) {
  return (
    <TechChipGrid
      labels={techStack}
      skills={skills}
      variant="project"
      className="proj-tags"
      ariaLabel="Technologies used"
    />
  );
}
