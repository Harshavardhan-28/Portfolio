import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Harsh Khamkar",
  description: "A showcase of projects built by Harsh Khamkar.",
};

export default function ProjectsPage() {
  return (
    <>
      <main className="min-h-screen bg-black px-6 pb-24 pt-32 text-white sm:pb-32 sm:pt-40 md:px-20">
        <h1 className="mb-10 text-[clamp(2.25rem,8.5vw,6rem)] font-black uppercase leading-none sm:mb-16">
          All <br />
          <span className="text-[#00ff41]">Projects</span>
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
