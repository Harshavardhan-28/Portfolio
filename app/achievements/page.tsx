import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { achievements } from "@/lib/achievements";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  title: "Achievements — Harsh Khamkar",
  description: "Hackathons and achievements showcase for Harsh Khamkar.",
};

export default function AchievementsPage() {
  return (
    <>
      <main className="min-h-screen bg-black px-6 pb-24 pt-32 text-white sm:pb-32 sm:pt-40 md:px-20">
        <h1 className="mb-10 text-[clamp(2.25rem,8.5vw,6rem)] font-black uppercase leading-none sm:mb-16">
          Hackathons &amp; <br />
          <span className="text-[#00ff41]">Achievements</span>
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {achievements.map((achievement) => (
            <Link key={achievement.slug} href={`/achievements/${achievement.slug}`} className="group block h-full">
              <Card className="h-full gap-0 overflow-hidden rounded-xl border-white/8 bg-[#111] p-0 shadow-none transition-colors duration-200 group-hover:border-[#3ce07b]/50">
                <div className="relative aspect-video w-full overflow-hidden bg-[#1c1c1c]">
                  <Image
                    src={achievement.previewImage ?? achievement.image}
                    alt={achievement.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    style={{ objectPosition: achievement.previewPosition ?? "center" }}
                    className="object-cover"
                  />
                </div>

                <CardContent className="flex flex-1 flex-col gap-2.5 p-5">
                  <span
                    className={`${jetbrainsMono.className} text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-[#3ce07b]`}
                  >
                    {achievement.tag} · {achievement.date}
                  </span>
                  <h3
                    className={`${spaceGrotesk.className} m-0 text-[21px] font-bold leading-[1.15] tracking-[-0.01em] text-[#fafafa]`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`${spaceGrotesk.className} m-0 text-pretty text-sm font-normal leading-normal text-white/50`}
                  >
                    {achievement.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
