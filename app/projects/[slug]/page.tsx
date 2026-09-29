import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionDetail from "@/components/CollectionDetail";
import MiniFooter from "@/components/MiniFooter";
import { getItems } from "@/lib/collection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getItems("projects").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItems("projects").find((p) => p.slug === slug);
  return { title: item ? `${item.title} · Harshavardhan Khamkar` : "Project", description: item?.tagline };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const items = getItems("projects");
  const index = items.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  return (
    <>
      <CollectionDetail kind="projects" item={items[index]} next={items[(index + 1) % items.length]} />
      <MiniFooter />
    </>
  );
}
