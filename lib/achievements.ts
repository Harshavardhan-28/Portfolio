import achievementsData from "@/data/achievements.json";

/** The structured fact rail shown beside the write-up. Every field is
 * optional — set only what you actually know and the rail renders just that. */
export type AchievementFacts = {
  result?: string;
  built?: string;
  team?: string;
  stack?: string[];
};

// Content lives in data/achievements.json — edit that file to add, remove, or
// update an entry. Both the homepage section and the /achievements pages
// (grid + each /achievements/[slug] detail page) read from this same list.
export type Achievement = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  /** City/venue, appended to the "tag · date" line on the hero — e.g. "Bengaluru". */
  location?: string;
  /** Hero image shown at the top of the detail page. Path under /public/images/hackathon/<slug>/. */
  image: string;
  /**
   * CSS `object-position` for the hero crop — the banner is a fixed-height
   * wide strip, so where the subject sits in the source photo determines
   * what survives the crop. A group with heads near the top of a near-square
   * photo needs e.g. "center 15%"; a landscape photo with empty ceiling above
   * the subjects needs a downward bias like "center 30%". Defaults to
   * "center top" — always check the render after adding a new hero.
   */
  heroPosition?: string;
  /** Thumbnail used on the card (home page + /achievements grid). Falls back to `image` when omitted. */
  previewImage?: string;
  /**
   * CSS `object-position` for the preview thumbnail crop. The home page card
   * is aspect-[3/4] and the /achievements grid card is aspect-video (16:9) —
   * a portrait source photo gets cropped hard on the 16:9 grid, so a plain
   * center crop can cut off heads. Defaults to "center".
   */
  previewPosition?: string;
  /** Extra photos shown on the detail page, also under /public/images/hackathon/<slug>/. Set to null if there's only the cover image. */
  gallery: string[] | null;
  /** Optional per-photo captions for the gallery grid, keyed by the image path (must match an entry in `gallery`). A photo without an entry here just shows its number. */
  galleryCaptions?: Record<string, string>;
  /** One-line teaser shown on the card. */
  summary: string;
  /**
   * The write-up, rendered on the detail page as one block per array entry.
   * Plain strings become paragraphs (the first one gets lead-paragraph
   * styling); prefix a line with "## " for a heading or "> " for a pull quote.
   * Each "## " heading also becomes an entry in the "On this page" nav.
   */
  body: string[];
  /** Structured facts (result, what you built, team, stack) shown in the sidebar rail. Omit entirely to hide the rail. */
  facts?: AchievementFacts;
  /** Link to the project's repo, shown as a button under the fact rail. */
  repoUrl?: string;
  /** Set this to link out to an existing blog post instead of the built-in detail page. */
  externalUrl: string | null;
};

export const achievements: Achievement[] = achievementsData as Achievement[];
