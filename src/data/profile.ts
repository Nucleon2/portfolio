export const profile = {
  name: "Ahmad Khamis",
  firstName: "Ahmad",
  lastName: "Khamis",
  tagline: "Software developer & AI tinkerer",
  location: "Abu Dhabi, UAE",
  email: "ahmadkhamis008@gmail.com",
  phone: "0585499334",
  github: "https://github.com/Nucleon2",
  githubHandle: "Nucleon2",
  linkedin: "https://www.linkedin.com/in/Ahmad-khamis",
  linkedinHandle: "Ahmad-khamis",
  resumeUrl: "/resume.pdf",
  about: [
    "I'm a student developer at the Canadian International School in Abu Dhabi (AP Computer Science, class of 2026), building full-stack and AI-powered products that people can actually use.",
    "Self-taught in React, Three.js, Node and the modern TypeScript ecosystem — I learn by shipping: hackathons, open-source platforms, and ML experiments on real blockchain data.",
  ],
  education: {
    school: "Canadian International School",
    location: "Abu Dhabi, UAE",
    graduation: "June 2026",
    detail: "AP Computer Science",
  },
} as const;

export const experience = [
  {
    company: "Open Innovation",
    role: "Innovation Intern",
    location: "Abu Dhabi, UAE",
    period: "Dec 2025 — Jan 2026",
    bullets: [
      "Worked in an open innovation environment focused on rapid experimentation and evaluation of emerging AI technologies.",
      "Gained hands-on exposure to machine learning concepts including neural networks, embeddings, and model evaluation pipelines.",
      "Explored and implemented Retrieval-Augmented Generation (RAG) using vector databases and semantic search to improve LLM context relevance.",
      "Analyzed AI use cases by translating business problems into technical prototypes and feasibility assessments.",
      "Developed understanding of the end-to-end ML lifecycle — data preprocessing, training, inference, and deployment.",
    ],
  },
] as const;
