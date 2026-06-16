"use client";

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden py-28 px-5">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#354e98] to-[#4a71df]" />

      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Eyebrow badge */}
        <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full border border-white/20 backdrop-blur-sm">
          <i className="ti ti-clock-hour-4 text-amber-300" />
          Limited Seats Available — Batch Starting Soon
        </span>

        {/* Headline */}
        <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
          Your Band 7+ Journey{" "}
          <span className="relative inline-block">
            Starts Today
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 9C50 3 100 1 150 3C200 5 250 9 298 6"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Paragraph */}
        <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
          Join over 5,000 students who achieved their target IELTS score with
          expert-led coaching, structured practice, and personalised feedback —
          all designed to get you to Band 7+ faster.
        </p>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          {/* Primary */}
          <a
            href="#consultation"
            className="inline-flex items-center gap-2.5 bg-white text-blue-600 font-bold text-sm px-8 py-4 rounded-full
              shadow-xl shadow-blue-900/30 hover:bg-sky-50 hover:scale-105 hover:shadow-2xl
              transition-all duration-300"
          >
            <i className="ti ti-calendar-event text-base" />
            Book a Free Consultation
          </a>

          {/* Secondary */}
          <a
            href="#courses"
            className="inline-flex items-center gap-2.5 bg-transparent text-white font-bold text-sm px-8 py-4 rounded-full
              border-2 border-white/40 hover:border-white hover:bg-white/10
              transition-all duration-300"
          >
            <i className="ti ti-books text-base" />
            Explore Courses
            <i className="ti ti-arrow-right text-sm" />
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
          <div className="flex -space-x-2.5">
            {[44, 32, 68, 75].map((id, i) => (
              <img
                key={i}
                src={`https://randomuser.me/api/portraits/women/${id}.jpg`}
                alt="student"
                className="w-8 h-8 rounded-full ring-2 ring-blue-600 object-cover"
              />
            ))}
          </div>
          <p className="text-blue-200 text-sm">
            <span className="text-white font-bold">2,400+ students</span>{" "}
            enrolled this month
          </p>
        </div>
      </div>
    </section>
  );
}
