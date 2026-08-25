import projectsData from "@/data/projects.json";

// Content lives in data/projects.json — edit that file to add, remove, or
// update a project. Both the /projects grid and each /projects/[slug] page
// read from this same list.
export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  tags: string[];
  /** Path under /public/images/projects/<slug>/. Leave null until you have a real screenshot — cards fall back to a placeholder. */
  image: string | null;
  /** Small square mark shown next to the category eyebrow on the detail page's hero. Cropped center — source doesn't need to be square. */
  logo: string | null;
  summary: string;
  description: string[];
  /** UI screenshots shown in the detail page's Gallery section. Paths under /public/images/projects/<slug>/. */
  gallery: string[] | null;
  /** Optional per-photo captions for the gallery, keyed by the image path (must match an entry in `gallery`). */
  galleryCaptions?: Record<string, string>;
  /** System/agent diagrams shown in the detail page's Architecture section — the first entry renders large, the rest as a smaller row below it. */
  architecture: string[] | null;
  /** Optional per-diagram captions for the architecture section, keyed by the image path (must match an entry in `architecture`). */
  architectureCaptions?: Record<string, string>;
  githubUrl: string | null;
  liveUrl: string | null;
  youtubeUrl: string | null;
  whitepaperUrl: string | null;
};

export const projects: Project[] = projectsData as Project[];
