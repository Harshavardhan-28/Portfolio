import type { Metadata } from "next";
import CollectionList from "@/components/CollectionList";
import MiniFooter from "@/components/MiniFooter";
import { getItems } from "@/lib/collection";

export const metadata: Metadata = {
  title: "Hackathons · Harshavardhan Khamkar",
  description: "Hackathon stories and wins by Harshavardhan Khamkar.",
};

export default function AchievementsPage() {
  return (
    <>
      <CollectionList kind="hackathons" items={getItems("hackathons")} />
      <MiniFooter />
    </>
  );
}
