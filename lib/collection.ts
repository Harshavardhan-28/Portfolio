import { projects } from "@/lib/projects";
import { achievements } from "@/lib/achievements";

// View model shared by the projects and hackathons pages. Both collections are
// normalised here (on the server) so the client components render one shape.

export type CollectionKind = "projects" | "hackathons";

export type Block = { kind: "h" | "p"; text: string; id: string };
export type Fact = { label: string; value: string; accent: boolean };
export type LinkItem = { label: string; url: string; icon: string; primary: boolean; external: boolean };
export type Shot = { src: string; cap: string; fit: "contain" | "cover"; frame: "white" | "surface2" };

export type CollectionItem = {
  slug: string;
  title: string;
  /** Route segment for hrefs. */
  base: "/projects" | "/achievements";
  // card
  cardImage: string | null;
  cardPos: string;
  meta: string;
  meta2: string;
  sub: string;
  cardTags: string[];
  badge: boolean;
  // filters
  category: string;
  winner: boolean;
  // detail
  heroImage: string | null;
  heroPos: string;
  logo: string | null;
  logoFit: "cover" | "contain";
  eyebrow: string;
  tagline: string;
  lead: string;
  blocks: Block[];
  facts: Fact[];
  stack: string[];
  links: LinkItem[];
  gallery: Shot[];
  galleryTitle: string;
  arch: Shot[];
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const toBlocks = (body: string[]): Block[] =>
  body.slice(1).map((line) =>
    line.startsWith("## ")
      ? { kind: "h", text: line.slice(3), id: slugify(line.slice(3)) }
      : { kind: "p", text: line.replace(/^> /, ""), id: "" }
  );

function projectItems(): CollectionItem[] {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    base: "/projects",
    cardImage: p.image,
    cardPos: "center top",
    meta: p.category,
    meta2: p.githubUrl ? "Open source" : "",
    sub: p.summary && !p.summary.startsWith("Add a") ? p.summary : p.tagline || "Write-up coming soon.",
    cardTags: p.tags.slice(0, 3).concat(p.tags.length > 3 ? [`+${p.tags.length - 3}`] : []),
    badge: false,
    category: p.category,
    winner: false,
    heroImage: p.image,
    heroPos: "center top",
    logo: p.logo,
    logoFit: p.logoFit === "cover" ? "cover" : "contain",
    eyebrow: p.category,
    tagline: p.tagline,
    lead: p.description[0] ?? p.summary,
    blocks: toBlocks(p.description),
    facts: [{ label: "Category", value: p.category, accent: true }],
    stack: p.tags,
    links: (
      [
        p.githubUrl && { label: "GitHub", url: p.githubUrl, icon: "ph ph-github-logo", primary: true },
        p.liveUrl && { label: "Live demo", url: p.liveUrl, icon: "ph ph-globe", primary: false },
        p.youtubeUrl && { label: "Watch demo", url: p.youtubeUrl, icon: "ph ph-youtube-logo", primary: false },
        p.whitepaperUrl && { label: "Whitepaper", url: p.whitepaperUrl, icon: "ph ph-file-text", primary: false },
      ] as (Omit<LinkItem, "external"> | null | "" | undefined)[]
    )
      .filter((l): l is Omit<LinkItem, "external"> => Boolean(l))
      .map((l) => ({ ...l, external: true })),
    gallery: (p.gallery ?? []).map((src, i) => ({
      src,
      cap: p.galleryCaptions?.[src] ?? `${p.title} screen ${i + 1}`,
      fit: "contain",
      frame: "white",
    })),
    galleryTitle: "Screens",
    arch: (p.architecture ?? []).map((src) => ({
      src,
      cap: p.architectureCaptions?.[src] ?? "Architecture",
      fit: "contain",
      frame: "white",
    })),
  }));
}

function hackathonItems(): CollectionItem[] {
  return achievements.map((a) => {
    const winner = Boolean(a.facts?.result);
    const project = projects.find((p) => p.slug === a.projectSlug);
    const galleryRest = (a.gallery ?? []).filter((s) => s !== a.image);
    const facts: Fact[] = [
      { label: "Result", value: a.facts?.result ?? "Participant", accent: winner },
      ...(a.facts?.built ? [{ label: "Built", value: a.facts.built, accent: false }] : []),
      { label: "When", value: [a.date, a.location].filter(Boolean).join(", "), accent: false },
    ];
    const links: LinkItem[] = [
      ...(project
        ? [{ label: `View ${project.title}`, url: `/projects/${project.slug}`, icon: "ph ph-squares-four", primary: true, external: false }]
        : []),
      ...(a.externalUrl
        ? [{ label: "Event page", url: a.externalUrl, icon: "ph ph-globe", primary: false, external: true }]
        : []),
    ];
    return {
      slug: a.slug,
      title: a.title,
      base: "/achievements",
      cardImage: a.previewImage ?? a.image,
      cardPos: a.previewPosition ?? a.heroPosition ?? "center",
      meta: a.date,
      meta2: a.location ?? a.tag,
      sub: a.summary,
      cardTags: winner ? [a.facts!.result!] : ["Participant"],
      badge: winner,
      category: a.tag,
      winner,
      heroImage: a.image,
      heroPos: a.heroPosition ?? "center",
      logo: null,
      logoFit: "contain",
      eyebrow: [a.tag, a.date, a.location].filter(Boolean).join(" / "),
      tagline: a.summary,
      lead: a.body[0] ?? a.summary,
      blocks: toBlocks(a.body),
      facts,
      stack: [],
      links,
      gallery: galleryRest.map((src, i) => ({
        src,
        cap: a.galleryCaptions?.[src] ?? `${a.title} photo ${i + 1}`,
        fit: "cover",
        frame: "surface2",
      })),
      galleryTitle: "Gallery",
      arch: [],
    };
  });
}

export const getItems = (kind: CollectionKind) =>
  kind === "projects" ? projectItems() : hackathonItems();
