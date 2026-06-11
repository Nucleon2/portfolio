import type { Metadata } from "next";
import { Unbounded, Space_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmadkhamis.dev"),
  title: "Ahmad Khamis — Software Developer",
  description:
    "Ahmad Khamis is a software developer in Abu Dhabi building full-stack and AI-powered products — React, TypeScript, Three.js, Node.js and machine learning.",
  keywords: [
    "Ahmad Khamis",
    "software developer",
    "full-stack",
    "AI",
    "React",
    "TypeScript",
    "Three.js",
    "Abu Dhabi",
  ],
  openGraph: {
    title: "Ahmad Khamis — Software Developer",
    description:
      "Full-stack & AI projects from a developer in Abu Dhabi. Step into the bioluminescent forest.",
    url: "https://ahmadkhamis.dev",
    siteName: "Ahmad Khamis",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ahmad Khamis — portfolio" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Khamis — Software Developer",
    description:
      "Full-stack & AI projects from a developer in Abu Dhabi. Step into the bioluminescent forest.",
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  jobTitle: "Software Developer",
  url: "https://ahmadkhamis.dev",
  sameAs: [profile.github, profile.linkedin],
  alumniOf: profile.education.school,
  address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${spaceGrotesk.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
