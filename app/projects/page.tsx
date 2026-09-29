import type { Metadata } from "next";
import CollectionList from "@/components/CollectionList";
import MiniFooter from "@/components/MiniFooter";
import { getItems } from "@/lib/collection";

export const metadata: Metadata = {
  title: "Projects · Harshavardhan Khamkar",
  description: "Projects by Harshavardhan Khamkar: ML systems, data pipelines, agentic AI and on chain privacy.",
};

export default function ProjectsPage() {
  return (
    <>
      <CollectionList kind="projects" items={getItems("projects")} />
      <MiniFooter />
    </>
  );
}
