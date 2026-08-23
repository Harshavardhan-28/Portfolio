import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group mb-12 flex w-fit items-center gap-3 rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-300 transition-all duration-300 hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      {label}
    </Link>
  );
}
