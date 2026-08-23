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
  /** Path under /public. Leave null until you have a real screenshot — cards fall back to a placeholder. */
  image: string | null;
  summary: string;
  description: string[];
  githubUrl: string | null;
  liveUrl: string | null;
};

export const projects: Project[] = projectsData as Project[];
