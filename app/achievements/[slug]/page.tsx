import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CollectionDetail from "@/components/CollectionDetail";
import MiniFooter from "@/components/MiniFooter";
import { getItems } from "@/lib/collection";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getItems("hackathons").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItems("hackathons").find((a) => a.slug === slug);
  return { title: item ? `${item.title} · Harshavardhan Khamkar` : "Hackathon", description: item?.tagline };
}

export default async function AchievementPage({ params }: Props) {
  const { slug } = await params;
  const items = getItems("hackathons");
  const index = items.findIndex((a) => a.slug === slug);
  if (index < 0) notFound();
  return (
    <>
      <CollectionDetail kind="hackathons" item={items[index]} next={items[(index + 1) % items.length]} />
      <MiniFooter />
    </>
  );
}
