export type Project = {
  /** Stable id used for anchors and 3D clearing mapping */
  id: string;
  index: string;
  name: string;
  pitch: string;
  description: string;
  highlights: string[];
  tech: string[];
  github: string;
  /** Live demo / deployed URL, if one exists. Renders a "Live" button. */
  liveUrl?: string;
  /**
   * Hero visual for the project. Drop a file at /public/projects/<id>.png|.webm
   * and point `src` at it. When unset, ProjectVisual renders a designed
   * placeholder mockup so the panel never looks empty.
   */
  media?: { type: "image" | "video"; src: string };
  /** Emissive tint of this project's mushroom clearing in the 3D scene */
  tint: string;
  badge?: string;
};

export const projects: Project[] = [
  {
    id: "rentra",
    index: "01",
    name: "Rentra",
    pitch: "Open-source property management for independent landlords.",
    description:
      "A self-hostable, privacy-first platform for landlords managing properties across multiple countries — tenants, leases, payments and documents in one place, with no vendor lock-in.",
    highlights: [
      "Multi-property & multi-currency portfolio tracking",
      "Full tenant lifecycle with lease & payment management",
      "BetterAuth security: OAuth, 2FA and passkeys",
      "Web + iOS/Android via CapacitorJS, shipped with Docker",
    ],
    tech: ["React", "TypeScript", "Express", "PostgreSQL", "Drizzle", "Docker", "Tailwind"],
    github: "https://github.com/Abdullah73k/Rentra",
    media: { type: "image", src: "/projects/rentra.png" },
    tint: "#3fdc77", // forest green — home base
    badge: "Open source",
  },
  {
    id: "ethosai",
    index: "02",
    name: "EthosAI",
    pitch: "Agentic AI that explains Ethereum wallet behavior.",
    description:
      "A behavioral-analysis platform that profiles on-chain wallet activity, correlates it with market data, and delivers explainable AI insights — plus a voice-enabled Discord coach you can actually talk to.",
    highlights: [
      "LLM-driven behavioral insights with DeepSeek",
      "Real-time Discord voice coaching — Deepgram STT + ElevenLabs TTS",
      "Etherscan & CoinGecko pipelines for on-chain + market data",
      "Bun/ElysiaJS backend with Prisma & PostgreSQL",
    ],
    tech: ["TypeScript", "Bun", "ElysiaJS", "React", "PostgreSQL", "DeepSeek", "Discord.js"],
    github: "https://github.com/Nucleon2/EthosAI",
    media: { type: "image", src: "/projects/ethosai.png" },
    tint: "#22d3ee", // cyan — on-chain / blockchain
    badge: "AI × Blockchain",
  },
  {
    id: "solace",
    index: "03",
    name: "Solace",
    pitch: "A Solana wallet you command in plain English.",
    description:
      "An AI-native wallet built for the MLH AI Hackfest — natural-language transactions, autonomous portfolio rebalancing, and an AI guard that risk-scores every transaction before you sign it.",
    highlights: [
      "15+ natural-language command types, chainable into multi-step ops",
      "AI Wallet Guard: pre-signing security analysis & risk scoring",
      "Autonomous rebalancing on 30-second cycles via Jupiter v6",
      "Voice input, scheduled payments and .sol name resolution",
    ],
    tech: ["Next.js", "TypeScript", "Solana Web3.js", "Claude", "Jupiter", "Tailwind"],
    github: "https://github.com/Nucleon2/AI-hackfest-AI-agent-wallet",
    media: { type: "image", src: "/projects/solace.png" },
    tint: "#9945ff", // Solana purple
    badge: "MLH AI Hackfest",
  },
  {
    id: "ecosim",
    index: "04",
    name: "EcoSim",
    pitch: "An AI copilot for climate policy decisions.",
    description:
      "An interactive simulator where policy levers — carbon tax, renewables, deforestation — drive real-time climate metrics on a Three.js globe, with an AI assistant explaining every consequence in plain language.",
    highlights: [
      "Immersive R3F globe with heatmaps and particle systems",
      "Real-time temperature, CO₂, emissions & sea-level modelling",
      "AI-suggested optimal strategies for sustainability goals",
      "FastAPI + Pydantic simulation backend",
    ],
    tech: ["React", "TypeScript", "Three.js", "R3F", "FastAPI", "Python", "DeepSeek"],
    github: "https://github.com/Nucleon2/EcoSim-GenAI-hackathon",
    media: { type: "image", src: "/projects/ecosim.png" },
    tint: "#fbbf24", // sunrise amber — climate
    badge: "GenAI Hackathon",
  },
  {
    id: "wallet-risk",
    index: "05",
    name: "Wallet Risk Scorer",
    pitch: "Machine learning that smells a scam wallet.",
    description:
      "An ML pipeline that classifies blockchain addresses as safe or scam from behavioral transaction patterns — not blocklists — engineered from raw on-chain history.",
    highlights: [
      "XGBoost classifier with stratified K-fold cross-validation",
      "RandomizedSearchCV hyperparameter tuning",
      "Behavioral feature engineering from transaction frequency & value flows",
      "Serialized with joblib, ready for live risk-scoring integration",
    ],
    tech: ["Python", "XGBoost", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    github: "https://github.com/Nucleon2/wallet-scam-detector-ML",
    media: { type: "image", src: "/projects/wallet-risk.png" },
    tint: "#f43f5e", // rose — risk / danger
    badge: "Machine Learning",
  },
];
