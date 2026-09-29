import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function AboutSection() {
  return (
    <section data-sec="about" className="flex flex-wrap items-center gap-12 px-6 py-16 md:mx-auto md:max-w-[1200px] md:flex-nowrap">
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-8">
        <SectionHeading num="01" eyebrow="About" title="About myself" />
        <Reveal
          as="p"
          className="m-0 max-w-[560px] text-2xl"
          style={{ lineHeight: "32px", letterSpacing: "-0.015em", color: "var(--fg)", textWrap: "pretty" }}
        >
          I build immersive digital experiences that blend high-performance engineering with cinematic aesthetics.
        </Reveal>
        <Reveal
          as="a"
          href="/Harshavardhan_Khamkar_Resume.pdf"
          download
          className="box-border flex h-14 w-full max-w-[320px] items-center justify-between gap-6 rounded-full border px-5 text-base font-semibold hover:bg-[var(--accentSoft)] active:scale-[0.98]"
          style={{ borderColor: "var(--accentLine)", color: "var(--accentText)" }}
        >
          Download resume
          <i className="ph ph-download-simple" style={{ fontSize: 20 }} />
        </Reveal>
      </div>
      <Reveal
        photo
        className="relative max-h-[640px] min-w-0 flex-[1_1_320px] overflow-hidden rounded-3xl border"
        style={{ aspectRatio: "4/5", background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <Image
          src="/images/Harsh_Passport_photo.jpeg"
          alt="Portrait of Harshavardhan Khamkar"
          fill
          sizes="(min-width: 768px) 560px, 100vw"
          className="object-cover"
          style={{
            objectPosition: "center 20%",
            filter: "grayscale(1)",
            transform: "scale(1.08)",
            transition: "filter 1400ms var(--ease), transform 1400ms var(--ease)",
          }}
        />
        <div
          className="mono absolute bottom-2 left-2 flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium"
          style={{
            background: "var(--glass)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: "var(--fg)",
          }}
        >
          <i className="ph ph-briefcase" style={{ fontSize: 14, color: "var(--accentText)" }} />
          SWE Intern, Wabi Sabi Tech
        </div>
      </Reveal>
    </section>
  );
}
