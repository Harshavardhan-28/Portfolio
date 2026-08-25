import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { projects } from "@/lib/projects";
import BackButton from "@/components/BackButton";
import HeroZoom from "@/components/HeroZoom";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectArchitecture from "@/components/ProjectArchitecture";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.11-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.58A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.11 2.12C4.5 20.5 12 20.5 12 20.5s7.5 0 9.39-.58a3 3 0 0 0 2.11-2.12A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
    </svg>
  );
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Harsh Khamkar` : "Project" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;
  const hasLinks = Boolean(
    project.githubUrl || project.liveUrl || project.youtubeUrl || project.whitepaperUrl
  );

  const factLabel = `${jetbrainsMono.className} text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500`;
  const linkPill = `${jetbrainsMono.className} flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-90`;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero: anchored to the top, same treatment as the achievements detail
          page. Projects without a screenshot yet (image: null) get a large
          stroked lettermark instead of the photo — keeps the banner's weight
          and gradient consistent whether or not there's a real image. */}
      <div className="relative h-85 w-full overflow-hidden bg-neutral-950 sm:h-[70vh] sm:max-h-160 sm:min-h-100">
        {project.image ? (
          <>
            <Image src={project.image} alt={project.title} fill className="object-cover grayscale contrast-125" priority />
            <HeroZoom src={project.image} alt={project.title} />
          </>
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "radial-gradient(circle at 50% 35%, #141414, #050505)" }}
          >
            <span
              aria-hidden="true"
              className="select-none text-[42vw] font-black uppercase leading-none text-transparent sm:text-[24vw]"
              style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.14)" }}
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.25)_65%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-x-6 bottom-8 md:inset-x-20 md:bottom-10">
          <div className="mb-3 flex items-center gap-3">
            {project.logo && (
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/15">
                <Image src={project.logo} alt="" fill className="object-cover" />
              </div>
            )}
            <div className={`${jetbrainsMono.className} text-xs font-medium uppercase tracking-[0.18em] text-[#3ce07b]`}>
              {project.category}
            </div>
          </div>
          <h1
            className={`${spaceGrotesk.className} max-w-[20ch] text-4xl font-bold uppercase leading-[0.95] tracking-[-0.025em] text-white sm:text-5xl md:text-7xl`}
          >
            {project.title}
          </h1>
          {project.tagline && (
            <p className={`${spaceGrotesk.className} mt-3 max-w-[50ch] text-base text-neutral-300 sm:text-lg`}>
              {project.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar + article */}
      <div className="grid grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[270px_1fr] md:gap-14 md:px-20 md:py-16">
        <div className="flex flex-col gap-6">
          <BackButton href="/projects" label="All projects" />

          <div className="flex flex-col gap-4 rounded-xl border border-white/12 p-5">
            <div>
              <div className={factLabel}>Category</div>
              <div className={`${spaceGrotesk.className} mt-1.5 text-base font-medium text-[#00ff41]`}>
                {project.category}
              </div>
            </div>
            {project.tags.length > 0 && (
              <>
                <div className="h-px bg-white/10" />
                <div>
                  <div className={`${factLabel} mb-2`}>Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`${jetbrainsMono.className} rounded-full border border-white/16 px-2.5 py-1 text-[11px] text-neutral-300`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
            {hasLinks && (
              <>
                <div className="h-px bg-white/10" />
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkPill} bg-[#00ff41] text-black`}
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkPill} border border-white/25 text-white`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      Live Demo
                    </a>
                  )}
                  {project.youtubeUrl && (
                    <a
                      href={project.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkPill} border border-white/25 text-white`}
                    >
                      <YouTubeIcon />
                      YouTube
                    </a>
                  )}
                  {project.whitepaperUrl && (
                    <a
                      href={project.whitepaperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${linkPill} border border-white/25 text-white`}
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      Whitepaper
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex max-w-[70ch] flex-col gap-6">
          <p className={`${spaceGrotesk.className} text-xl font-normal leading-relaxed text-white sm:text-2xl`}>
            {project.description[0]}
          </p>
          {project.description.length > 1 && (
            <>
              <div className="h-px w-16 bg-[#00ff41]/35" />
              {project.description.slice(1).map((line, i) => {
                if (line.startsWith("## ")) {
                  const text = line.slice(3);
                  return (
                    <h2
                      key={i}
                      id={text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                      className={`${spaceGrotesk.className} scroll-mt-24 pt-4 text-2xl font-bold uppercase leading-tight tracking-[-0.02em] text-white sm:text-3xl`}
                    >
                      {text}
                    </h2>
                  );
                }
                return (
                  <p key={i} className={`${spaceGrotesk.className} text-lg leading-relaxed text-gray-300`}>
                    {line}
                  </p>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Gallery — screenshots have their own white/light backgrounds, so each
          cell gets a light card rather than cropping them onto the dark page
          bg. object-contain (not cover, unlike the achievements photo
          gallery) so no UI or diagram content gets clipped. Click-to-zoom. */}
      {project.gallery && project.gallery.length > 0 && (
        <ProjectGallery images={project.gallery} captions={project.galleryCaptions} title={project.title} />
      )}

      {/* Architecture — first entry renders large (the system diagram), any
          rest (per-agent diagrams) as a smaller row underneath. Click-to-zoom. */}
      {project.architecture && project.architecture.length > 0 && (
        <ProjectArchitecture images={project.architecture} captions={project.architectureCaptions} title={project.title} />
      )}

      {/* Prev/next footer — same pattern as the achievements detail page:
          skinny arrow-links on desktop, full-width tap targets below `sm`. */}
      <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-9 sm:flex-row sm:items-center sm:justify-between sm:gap-0 md:px-20">
        <Link
          href="/#projects"
          className={`${jetbrainsMono.className} group flex items-center justify-center gap-2 rounded-lg border border-white/20 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-300 transition-colors hover:border-white/40 hover:text-white sm:justify-start sm:border-0 sm:bg-transparent sm:p-0 sm:text-neutral-400 sm:hover:text-white`}
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          All projects
        </Link>
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className={`${jetbrainsMono.className} group flex items-center justify-center gap-2 rounded-lg bg-[#00ff41] py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90 sm:justify-end sm:bg-transparent sm:p-0 sm:text-[#00ff41] sm:transition-colors sm:hover:text-white sm:hover:opacity-100`}
          >
            Next: {next.title}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </main>
  );
}
