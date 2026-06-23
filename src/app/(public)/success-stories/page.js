import ReviewCarouselBlue from "@/components/shared/ReviewCarouselBlue";
import SuccessStats from "@/components/shared/SuccessStats";

const successStoriesPage = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#354e98] to-[#4a71df] py-24 px-5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 mx-auto ">
        <ReviewCarouselBlue />
        <SuccessStats />
      </div>
    </section>
  );
};

export default successStoriesPage;
