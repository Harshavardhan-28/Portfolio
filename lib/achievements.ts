// Single source of truth for the Achievements/Hackathons showcase.
// To add a new entry: push a new object here — the grid on the homepage
// and its detail page at /achievements/[slug] both read from this file.

export type Achievement = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  image: string;
  /** Extra photos shown on the detail page. Omit if there's only the cover image. */
  gallery?: string[];
  /** One-line teaser shown on the card. */
  summary: string;
  /** Paragraphs rendered on the detail page — edit these with the real write-up. */
  body: string[];
  /** Set this to link out to an existing blog post instead of the built-in detail page. */
  externalUrl?: string;
};

export const achievements: Achievement[] = [
  {
    slug: "ethglobal-new-delhi",
    title: "ETHGlobal New Delhi",
    tag: "Hackathon",
    date: "October 2025",
    image: "/images/EthGlobal-polaroid.jpg",
    gallery: ["/images/EthGlobal-polaroid.jpg", "/images/20251014_133407.jpg"],
    summary: "Building on-chain with the team at ETHGlobal's New Delhi hackathon.",
    body: [
      "Add your write-up here — what you and the team built, the stack you used, and anything you'd do differently next time.",
    ],
  },
  {
    slug: "google-cloud-agentic-ai-day",
    title: "Google Cloud Agentic AI Day",
    tag: "Hackathon",
    date: "July 2025",
    image: "/images/AgenticAIDaySolo.jpg",
    summary: "A day deep in agentic AI workflows at Google Cloud's Agentic AI Day.",
    body: ["Add your write-up here."],
  },
  {
    slug: "eth-mumbai",
    title: "ETH Mumbai",
    tag: "Hackathon",
    date: "2025",
    image: "/images/EthMumbai.jpg",
    summary: "Shipping in the trenches at ETH Mumbai.",
    body: ["Add your write-up here."],
  },
];
