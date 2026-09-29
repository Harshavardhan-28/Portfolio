import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import TechStack from "@/components/TechStack";
import ProjectCarousel from "@/components/ProjectCarousel";
import Achievements from "@/components/Achievements";
import Experience from "@/components/Experience";
import SocialGallery from "@/components/SocialGallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <TechStack />
      <ProjectCarousel />
      <Achievements />
      <Experience />
      <SocialGallery />
      <Footer isHome />
    </main>
  );
}
