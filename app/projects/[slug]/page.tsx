import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";
import BackButton from "@/components/BackButton";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
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
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white sm:py-32 md:px-20">
      <BackButton href="/projects" />

      <span className="text-sm font-bold uppercase tracking-widest text-[#00ff41]">
        {project.category}
      </span>
      <h1 className="mb-2 mt-4 text-4xl font-black uppercase leading-none sm:text-5xl md:text-7xl">
        {project.title}
      </h1>
      {project.tagline && (
        <p className="mb-12 text-lg text-gray-400 sm:text-xl">{project.tagline}</p>
      )}
      {!project.tagline && <div className="mb-12" />}

      <div
        className={
          project.image
            ? "relative mb-12 h-[35vh] w-full overflow-hidden rounded-2xl border border-white/10 sm:h-[50vh] md:h-[70vh]"
            : "relative mb-12 aspect-21/9 w-full overflow-hidden rounded-2xl border border-white/10"
        }
      >
        {project.image ? (
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900">
            <span className="text-7xl font-black text-[#00ff41] opacity-10 sm:text-8xl">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {project.tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="max-w-2xl space-y-4 text-lg text-gray-300">
        {project.description.map((point, i) => (
          <p key={i}>{point}</p>
        ))}
      </div>

      {(project.githubUrl || project.liveUrl || project.youtubeUrl) && (
        <div className="mt-12 flex flex-wrap gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-[#00ff41] px-8 py-4 font-bold uppercase tracking-widest text-[#00ff41] transition-all duration-300 hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
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
              className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-white/30 px-8 py-4 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-[#00ff41] hover:text-[#00ff41]"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              Live Demo
            </a>
          )}
          {project.youtubeUrl && (
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-white/30 px-8 py-4 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-[#00ff41] hover:text-[#00ff41]"
            >
              <YouTubeIcon />
              YouTube
            </a>
          )}
        </div>
      )}
    </main>
  );
}
