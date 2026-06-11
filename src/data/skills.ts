export type SkillGroup = {
  label: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "HTML5", "CSS"],
  },
  {
    label: "Frameworks & Libraries",
    skills: [
      "React",
      "Next.js",
      "Three.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "TailwindCSS",
      "Bun",
    ],
  },
  {
    label: "Tools",
    skills: ["Git", "GitHub", "Bash", "Postman", "Jira", "Docker"],
  },
];
