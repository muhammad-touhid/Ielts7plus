"use client";

const courses = [
  {
    name: "IELTS Preparation",
    icon: "ti ti-certificate",
    price: "৳ 12000",
    duration: "2 Months",
    popular: true,
    features: [
      "All 4 modules covered",
      "Live classes + recordings",
      "10 full mock tests",
      "Writing & Speaking feedback",
      "Study materials included",
      "Doubt clearing sessions",
    ],
  },
  {
    name: "Spoken English",
    icon: "ti ti-microphone",
    price: "৳ 8000",
    duration: "2 Months",
    popular: false,
    features: [
      "Fluency & pronunciation",
      "Real-life conversation practice",
      "Interactive group sessions",
      "Vocabulary building",
      "Weekly speaking assessments",
      "Certified instructor",
    ],
  },
  {
    name: "Advanced Writing",
    icon: "ti ti-pencil",
    price: "৳ 10000",
    duration: "3 Months",
    popular: false,
    features: [
      "Task 1 & Task 2 mastery",
      "Essay structure & coherence",
      "Lexical resource training",
      "Weekly writing submissions",
      "Personalised written feedback",
      "Band 7+ writing strategies",
    ],
  },
  {
    name: "Grammar & Writing",
    icon: "ti ti-writing",
    price: "৳ 7500",
    duration: "2 Months",
    popular: false,
    features: [
      "Grammar fundamentals",
      "Sentence structure mastery",
      "Paragraph & essay writing",
      "Common error correction",
      "Practice worksheets",
      "Progress assessments",
    ],
  },
];

export default function CourseFeesSection() {
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

      <div className="relative z-10 mx-auto container">
        {/* Header */}
        <div className="text-center mt-15 mb-14">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Simple, Honest Course Fees
          </h2>
          <p className="text-blue-100 text-m leading-relaxed max-w-xl mx-auto">
            No hidden charges, no surprises. Pick the course that fits your
            goals and get started with expert-led coaching today.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-3xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2
                ${
                  course.popular
                    ? "shadow-2xl shadow-blue-900/40 ring-2 ring-blue-600"
                    : "shadow-lg shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30"
                }`}
            >
              {/* Popular badge */}
              {course.popular && (
                <div className="bg-blue-600 text-white text-xs font-bold text-center py-2 tracking-wider uppercase">
                  ⭐ Most Popular
                </div>
              )}

              <div className="p-7 flex flex-col flex-1">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5
                  ${course.popular ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                >
                  <i className={course.icon} />
                </div>

                {/* Course name */}
                <h3 className="text-base font-extrabold text-slate-800 mb-1 leading-snug">
                  {course.name}
                </h3>

                {/* Duration */}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 mb-5">
                  <i className="ti ti-clock text-blue-600" />
                  {course.duration}
                </span>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-black text-slate-900 leading-none">
                    {course.price}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100 mb-5" />

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {course.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <i className="ti ti-circle-check-filled text-emerald-500 text-base mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#enroll"
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl
                    transition-all duration-200 hover:-translate-y-0.5
                    ${
                      course.popular
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300"
                        : "bg-slate-900 text-white hover:bg-blue-600 shadow-md shadow-slate-200"
                    }`}
                >
                  Enroll Now
                  <i className="ti ti-arrow-right text-sm" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-blue-200 mt-10 md:flex items-center justify-center gap-2">
          <i className="ti ti-shield-check text-[#f87171] text-base" />
          All courses include study materials. Need a custom plan?{" "}
          <a
            href="#contact"
            className="text-white font-semibold hover:underline"
          >
            Talk to us
          </a>
        </p>
      </div>
    </section>
  );
}
