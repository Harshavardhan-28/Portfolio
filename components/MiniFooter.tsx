import Link from "next/link";
import { EMAIL } from "@/lib/site";

const link = "hover-fg";

export default function MiniFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--line)" }}>
      <div
        className="mono mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 pb-10 pt-8 text-xs"
        style={{ color: "var(--muted)" }}
      >
        <span>© 2026 Harshavardhan Khamkar</span>
        <div className="flex flex-wrap gap-6">
          <Link href="/" className={link}>Home</Link>
          <a href={`mailto:${EMAIL}`} className={link}>Contact</a>
          <a href="https://github.com/Harshavardhan-28" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>
          <a href="https://www.linkedin.com/in/harshavardhan-khamkar/" target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
