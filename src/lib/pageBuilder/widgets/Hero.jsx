// src/lib/pageBuilder/widgets/Hero.jsx
"use client";

import Link from "next/link";
import { DropZone } from "@measured/puck";

// Matches the existing IELTS7+ gradient hero pattern:
// from-[#354e98] to-[#4a71df] with a subtle grid overlay + decorative blobs.
export const Hero = {
  label: "Hero Section",
  fields: {
    heading: { type: "text" },
    subheading: { type: "textarea" },
    ctaText: { type: "text" },
    ctaHref: { type: "text" },
    showSecondaryCta: {
      type: "radio",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    secondaryCtaText: { type: "text" },
    secondaryCtaHref: { type: "text" },
  },
  defaultProps: {
    heading: "Master IELTS With Confidence",
    subheading: "Structured courses, expert mentors, and real mock tests to get the score you need.",
    ctaText: "Explore Courses",
    ctaHref: "/courses",
    showSecondaryCta: "yes",
    secondaryCtaText: "Take a Free Mock Test",
    secondaryCtaHref: "/mock-test",
  },
  render: ({ heading, subheading, ctaText, ctaHref, showSecondaryCta, secondaryCtaText, secondaryCtaHref }) => (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#354e98] to-[#4a71df] py-24 px-6">
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{heading}</h1>
        <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto">{subheading}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href={ctaHref || "#"}
            className="px-8 py-3 rounded-md bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
          >
            {ctaText}
          </Link>
          {showSecondaryCta === "yes" && (
            <Link
              href={secondaryCtaHref || "#"}
              className="px-8 py-3 rounded-md border-2 border-white text-white font-semibold hover:bg-white/10 transition"
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>

        {/* Redesign this section: drop extra Elements or a Subsection here */}
        <div className="mt-8">
          <DropZone zone="extra" />
        </div>
      </div>
    </section>
  ),
};
