import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import type { Achievement } from "@/lib/achievements";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const href = achievement.externalUrl ?? `/achievements/${achievement.slug}`;
  const isExternal = Boolean(achievement.externalUrl);

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-[#1c1c1c] transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(60,224,123,0.35)]"
    >
      <Image
        src={achievement.previewImage ?? achievement.image}
        alt={achievement.title}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        style={{ objectPosition: achievement.previewPosition ?? "center" }}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Scrim: separate layer so it sits above the image but below the text */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.45)_45%,transparent_80%)]" />

      <div className="absolute inset-x-5 bottom-5 flex flex-col gap-2">
        <span
          className={`${jetbrainsMono.className} text-[10px] font-medium uppercase leading-none tracking-[0.12em] text-[#3ce07b]`}
        >
          {achievement.tag} · {achievement.date}
        </span>
        <h3
          className={`${spaceGrotesk.className} m-0 text-3xl font-bold leading-[1.1] tracking-[-0.015em] text-white`}
        >
          {achievement.title}
        </h3>
      </div>
    </Link>
  );
}
