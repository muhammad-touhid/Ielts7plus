import CTASection from "../../components/shared/CTASection";
import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/HowItWorks";
import OurCourses from "../../components/home/OurCourses";
import ReviewCarousel from "../../components/shared/ReviewCarousel";
import StatsSection from "../../components/shared/StatsSection";
import BatchCarousel from "@/components/shared/batch-schedule/BatchCarousel";

export default function Home() {
  return (
    <main>
      <Hero />
      <OurCourses />
      <BatchCarousel />
      <HowItWorks />
      <StatsSection />
      <ReviewCarousel />
      <CTASection />
    </main>
  );
}
