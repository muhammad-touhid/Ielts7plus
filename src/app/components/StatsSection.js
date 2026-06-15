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
    heading: "Certified IELTS Trainers — Learn from",
    para: "Experienced, British Council-trained instructors.",
  },
  {
    icon: "ti ti-calendar-event",
    number: "24",
    heading: "Flexible Class Schedules — Morning,",
    para: "Evening, and weekend batches to suit your lifestyle.",
  },
  {
    icon: "ti ti-clipboard-text",
    number: "100%",
    heading: "Mock Tests & Real Exam Simulation —",
    para: "Regular practice with full-length tests under exam conditions.",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 text-white bg-gradient-to-r from-blue-700/90 to-blue-500/80 ">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
            <h3 className="text-base font-bold text-white">{item.heading}</h3>

            {/* Para */}
            <p className="text-sm text-blue-100 leading-relaxed">{item.para}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
