import CTASection from "../../components/shared/CTASection";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/HowItWorks";
import IeltsPrep from "../../components/IeltsPrep";
import OurCourses from "../../components/home/OurCourses";
import ReviewCarousel from "../../components/shared/ReviewCarousel";
import StatsSection from "../../components/shared/StatsSection";

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
