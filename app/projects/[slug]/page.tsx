import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import BackButton from "@/components/BackButton";

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
    <main className="min-h-screen bg-black px-6 py-32 text-white md:px-20">
      <BackButton href="/projects" />

      <span className="text-sm font-bold uppercase tracking-widest text-[#00ff41]">
        {project.category}
      </span>
      <h1 className="mb-2 mt-4 text-5xl font-black uppercase leading-none md:text-7xl">
        {project.title}
      </h1>
      {project.tagline && (
        <p className="mb-12 text-xl text-gray-400">{project.tagline}</p>
      )}
      {!project.tagline && <div className="mb-12" />}

      <div className="relative mb-12 h-[50vh] w-full overflow-hidden rounded-2xl border border-white/10 md:h-[70vh]">
        {project.image ? (
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-900">
            <span className="text-9xl font-black text-[#00ff41] opacity-10">
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

      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-12 flex flex-wrap gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-full border-2 border-[#00ff41] px-8 py-4 font-bold uppercase tracking-widest text-[#00ff41] transition-all duration-300 hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
            >
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
              Live Demo
            </a>
          )}
        </div>
      )}
    </main>
  );
}
