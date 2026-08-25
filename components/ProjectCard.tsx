import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import type { Project } from "@/lib/projects";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block aspect-4/3 overflow-hidden rounded-xl bg-[#1c1c1c] transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(60,224,123,0.35)]"
    >
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <span className="text-9xl font-black text-[#00ff41] opacity-10">
            {project.title.charAt(0)}
          </span>
        </div>
      )}

      {/* Scrim: separate layer so it sits above the image but below the text */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.45)_45%,transparent_80%)]" />

      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1.5">
        <span
          className={`${jetbrainsMono.className} text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-[#3ce07b]`}
        >
          {project.category}
        </span>
        <h3
          className={`${spaceGrotesk.className} m-0 text-xl font-bold leading-[1.1] tracking-[-0.015em] text-white`}
        >
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
