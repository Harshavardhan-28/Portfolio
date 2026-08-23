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
      <main className="min-h-screen bg-black px-6 pb-32 pt-40 text-white md:px-20">
        <h1 className="mb-16 text-6xl font-black uppercase leading-none md:text-8xl">
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
