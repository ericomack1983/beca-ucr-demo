import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonial from "@/components/landing/Testimonial";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Stats />
        <Testimonial />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
