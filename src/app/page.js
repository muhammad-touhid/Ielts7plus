import CTASection from "./components/CTASection";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import IeltsPrep from "./components/IeltsPrep";
import OurCourses from "./components/OurCourses";
import ReviewCarousel from "./components/ReviewCarousel";
import StatsSection from "./components/StatsSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurCourses />
      <IeltsPrep />
      <HowItWorks />
      <StatsSection />
      <ReviewCarousel />
      <CTASection />
    </main>
  );
}
