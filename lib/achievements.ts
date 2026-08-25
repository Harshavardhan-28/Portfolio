import achievementsData from "@/data/achievements.json";

// Content lives in data/achievements.json — edit that file to add, remove, or
// update an entry. Both the homepage section and the /achievements pages
// (grid + each /achievements/[slug] detail page) read from this same list.
export type Achievement = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  /** Hero image shown at the top of the detail page. Path under /public/images/hackathon/<slug>/. */
  image: string;
  /** Thumbnail used on the card (home page + /achievements grid). Falls back to `image` when omitted. */
  previewImage?: string;
  /** Extra photos shown on the detail page, also under /public/images/hackathon/<slug>/. Set to null if there's only the cover image. */
  gallery: string[] | null;
  /** One-line teaser shown on the card. */
  summary: string;
  /**
   * The write-up, rendered on the detail page as one block per array entry.
   * Plain strings become paragraphs (the first one gets lead-paragraph
   * styling); prefix a line with "## " for a heading or "> " for a pull quote.
   */
  body: string[];
  /** Set this to link out to an existing blog post instead of the built-in detail page. */
  externalUrl: string | null;
};

export const achievements: Achievement[] = achievementsData as Achievement[];
