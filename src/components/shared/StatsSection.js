"use client";

const stats = [
  {
    icon: "ti ti-rosette-discount-check",
    number: "100%",
    heading: "Guaranteed Band Improvement",
    para: "Personalized strategies to boost your IELTS score.",
  },
  {
    icon: "ti ti-certificate-2",
    number: "100%",
    heading: "Certified IELTS Trainers",
    para: "Experienced, British Council-trained instructors.",
  },
  {
    icon: "ti ti-calendar-event",
    number: "24",
    heading: "Flexible Class Schedules",
    para: "Morning, evening, and weekend batches to suit your lifestyle.",
  },
  {
    icon: "ti ti-clipboard-text",
    number: "100%",
    heading: "Mock Tests & Real Exam Simulation",
    para: "Regular practice with full-length tests under exam conditions.",
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-16 text-white bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-5 text-3xl text-white">
              <i className={item.icon} />
            </div>

            {/* Number */}
            <span className="text-4xl font-extrabold text-white mb-2 leading-none">
              {item.number}
            </span>

            {/* Heading */}
            <h3 className="text-base font-bold text-white mb-1">
              {item.heading}
            </h3>

            {/* Para */}
            <p className="text-sm text-blue-100 leading-relaxed">{item.para}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
