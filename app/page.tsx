import Image from "next/image";
import Scene from "@/components/Scene";
import HeroOverlay from "@/components/HeroOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";
import ProjectCarousel from "@/components/ProjectCarousel";
import AboutSection from "@/components/AboutSection";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";


export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-black text-white min-h-[300vh]">

        {/* Layer 0: The 3D World */}
        <Scene />

        {/* Layer 1: Hero Section */}
        <HeroOverlay />

        {/* Layer 2: About Section */}
        <AboutSection />

        {/* Layer 3: Projects Carousel (Horizontal Scroll) */}
        <ProjectCarousel />

        {/* Layer 4: Hackathons & Achievements */}
        <Achievements />

        {/* Layer 4.5: Work Experience */}
        <Experience />

        {/* Spacer to push footer down */}
        <div className="h-[20vh]" />

        {/* Layer 5: Social Gallery Section */}
        <SocialGallery />

        {/* Layer 6: Footer */}
        <Footer />

      </main>
    </SmoothScroll>
  );
}
