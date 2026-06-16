"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    icon: "ti ti-target",
    title: "Assessment & Goal Setting",
    description:
      "We evaluate your English skills and set clear goals for your IELTS journey.",
    iconColor: "text-blue-700",
    iconBg: "bg-sky-100",
    iconHoverBg: "group-hover:bg-blue-700",
    numberColor: "text-sky-100",
    borderHover: "hover:border-blue-700",
    barColor: "bg-blue-700",
    shadow: "hover:shadow-sky-100",
  },
  {
    number: "02",
    icon: "ti ti-school",
    title: "Expert-Led Classes",
    description:
      "Learn with top IELTS trainers using proven strategies and updated materials.",
    iconColor: "text-blue-700",
    iconBg: "bg-sky-100",
    iconHoverBg: "group-hover:bg-blue-700",
    numberColor: "text-sky-100",
    borderHover: "hover:border-blue-700",
    barColor: "bg-blue-700",
    shadow: "hover:shadow-sky-100",
  },
  {
    number: "03",
    icon: "ti ti-message-dots",
    title: "Practice & Feedback",
    description:
      "Take regular mock tests and receive personalized feedback to sharpen your skills.",
    iconColor: "text-blue-700",
    iconBg: "bg-sky-100",
    iconHoverBg: "group-hover:bg-blue-700",
    numberColor: "text-sky-100",
    borderHover: "hover:border-blue-700",
    barColor: "bg-blue-700",
    shadow: "hover:shadow-sky-100",
  },
  {
    number: "04",
    icon: "ti ti-certificate",
    title: "Test Readiness",
    description:
      "Get fully prepared with exam strategies and final tips to achieve your target score.",
    iconColor: "text-blue-700",
    iconBg: "bg-sky-100",
    iconHoverBg: "group-hover:bg-blue-700",
    numberColor: "text-sky-100",
    borderHover: "hover:border-blue-700",
    barColor: "bg-blue-700",
    shadow: "hover:shadow-sky-100",
  },
];

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = stepRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.2 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, []);

  return (
    <section className="relative py-24 px-5 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="relative z-10 container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-700 bg-sky-100 px-5 py-2 rounded-full mb-5">
            Simple. Structured. Successful.
          </span>
          <h2 className="mb-3 text-3xl font-bold text-gray-700">
            Your Journey to{" "}
            <span className="relative inline-block text-blue-700">
              Band 7+
              <span className="absolute bottom-1 left-0 w-full h-2 bg-sky-200 rounded-full -z-10" />
            </span>
          </h2>
          <p className="max-w-xl mx-auto leading-relaxed text-gray-500">
            From your very first lesson to exam day, our four-step framework
            gives every student a structured, proven path to IELTS success.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`group relative bg-white rounded-3xl p-8 border-2 border-slate-100 overflow-hidden cursor-default
                transition-all duration-500 ease-out
                ${step.borderHover} hover:-translate-y-2 hover:shadow-2xl ${step.shadow}
                ${visibleSteps.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Watermark number */}
              <span
                className={`absolute -top-3 right-3 text-[6rem] font-black leading-none select-none pointer-events-none transition-colors duration-300 ${step.numberColor}`}
              >
                {step.number}
              </span>

              {/* Icon bubble */}
              <div
                className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl
                  ${step.iconBg} ${step.iconColor}
                  ${step.iconHoverBg} group-hover:text-white
                  transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6`}
              >
                <i className={step.icon} />
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-base font-bold text-gray-700 mb-3 leading-snug">
                {step.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>

              {/* Bottom accent bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-bl-3xl ${step.barColor}`}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#courses"
            className="inline-flex items-center gap-3 bg-slate-900 text-white text-sm font-semibold px-9 py-4 rounded-full
              shadow-lg shadow-slate-300 hover:bg-blue-600 hover:shadow-sky-200 hover:-translate-y-1
              transition-all duration-300"
          >
            <i className="ti ti-rocket text-lg" />
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  );
}
