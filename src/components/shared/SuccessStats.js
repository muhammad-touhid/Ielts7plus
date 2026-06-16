"use client";

const stats = [
  {
    icon: "ti ti-rosette-discount-check",
    number: "95%",
    heading: "Success Rate",
  },
  {
    icon: "ti ti-school",
    number: "1000+",
    heading: "Students Achieved Target Score",
  },
  {
    icon: "ti ti-arrow-autofit-up",
    number: "1.5 Bands",
    heading: "Average Score Improvement",
  },
  {
    icon: "ti ti-star",
    number: "4.8/5",
    heading: "Student Satisfaction",
  },
];

export default function SuccessStats() {
  return (
    <section className="py-16 text-white bg-white rounded-3xl">
      {/* Content */}
      <div className=" z-10 container mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 ">
        {stats.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-2 text-3xl text-[#ef4444]">
              <i className={item.icon} />
            </div>

            {/* Number */}
            <span className="text-4xl font-extrabold text-blue-600 mb-2 leading-none">
              {item.number}
            </span>

            {/* Heading */}
            <h3 className="text-base text-gray-500 mb-1">{item.heading}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
