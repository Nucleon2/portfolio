export type SkillCategory = "Languages" | "Frameworks" | "Tools";

export type Skill = {
  name: string;
  /** Proficiency 1–3 → drives star size, glow and label weight. */
  level: 1 | 2 | 3;
  category: SkillCategory;
  /** Resting position in the constellation, as a percentage of the canvas. */
  x: number;
  y: number;
};

/** Accent per cluster — a faint hue shift so the three regions read as
 *  distinct "neighbourhoods" of the same green sky, not one flat field. */
export const categoryColor: Record<SkillCategory, string> = {
  Languages: "#7dffb0", // bio-bright — home green
  Frameworks: "#5fe0ff", // cool cyan — the build layer
  Tools: "#f5c451", // ember — the workshop
};

/**
 * Skills as a star-map. Coordinates are hand-placed so the three clusters
 * (languages upper-left, frameworks through the centre, tools lower-right)
 * read as an organic constellation rather than rigid rows — the threads in
 * the component connect real measured positions, so this layout *is* the art.
 */
export const skills: Skill[] = [
  // Languages — upper-left
  { name: "TypeScript", level: 3, category: "Languages", x: 19, y: 24 },
  { name: "JavaScript", level: 3, category: "Languages", x: 33, y: 14 },
  { name: "Python", level: 2, category: "Languages", x: 12, y: 44 },
  { name: "HTML5", level: 3, category: "Languages", x: 30, y: 35 },
  { name: "CSS", level: 3, category: "Languages", x: 14, y: 62 },
  { name: "SQL", level: 2, category: "Languages", x: 26, y: 56 },

  // Frameworks & Libraries — the dense core through the middle
  { name: "React", level: 3, category: "Frameworks", x: 48, y: 22 },
  { name: "Next.js", level: 3, category: "Frameworks", x: 62, y: 13 },
  { name: "Three.js", level: 2, category: "Frameworks", x: 57, y: 38 },
  { name: "Node.js", level: 3, category: "Frameworks", x: 46, y: 47 },
  { name: "Express", level: 2, category: "Frameworks", x: 68, y: 49 },
  { name: "TailwindCSS", level: 3, category: "Frameworks", x: 78, y: 27 },
  { name: "PostgreSQL", level: 2, category: "Frameworks", x: 40, y: 66 },
  { name: "Bun", level: 2, category: "Frameworks", x: 82, y: 40 },

  // Tools — lower / right
  { name: "Git", level: 3, category: "Tools", x: 56, y: 63 },
  { name: "GitHub", level: 3, category: "Tools", x: 70, y: 70 },
  { name: "Docker", level: 2, category: "Tools", x: 62, y: 82 },
  { name: "Bash", level: 2, category: "Tools", x: 48, y: 80 },
  { name: "Postman", level: 2, category: "Tools", x: 84, y: 60 },
  { name: "Jira", level: 2, category: "Tools", x: 86, y: 78 },
];

export type SkillGroup = {
  label: SkillCategory;
  skills: Skill[];
};

/** Grouped view, derived from the flat star-map — used by the mobile layout. */
export const skillGroups: SkillGroup[] = (["Languages", "Frameworks", "Tools"] as SkillCategory[]).map(
  (label) => ({ label, skills: skills.filter((s) => s.category === label) }),
);
