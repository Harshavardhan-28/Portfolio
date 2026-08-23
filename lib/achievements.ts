import achievementsData from "@/data/achievements.json";

// Content lives in data/achievements.json — edit that file to add, remove, or
// update an entry. Both the homepage section and the /achievements pages
// (grid + each /achievements/[slug] detail page) read from this same list.
export type Achievement = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  image: string;
  /** Extra photos shown on the detail page. Set to null if there's only the cover image. */
  gallery: string[] | null;
  /** One-line teaser shown on the card. */
  summary: string;
  /** Paragraphs rendered on the detail page — edit these with the real write-up. */
  body: string[];
  /** Set this to link out to an existing blog post instead of the built-in detail page. */
  externalUrl: string | null;
};

export const achievements: Achievement[] = achievementsData as Achievement[];
