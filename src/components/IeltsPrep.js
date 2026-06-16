"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const cardItem = [
  {
    image: "/images/card-item/pexels-photo-207756.jpg",
    title: "Academic IELTS — Batch A",
    desc: "Intensive prep for university admission goals.",
    schedule: "Weekends",
    href: "/courses/academic",
    rating: 4.9,
    reviews: 128,
  },
  {
    image: "/images/card-item/pexels-photo-5185074.jpg",
    title: "Spoken English — Batch B",
    desc: "Build fluency and confidence for speaking.",
    schedule: "Weekdays & Evenings",
    href: "/courses/spokenEnglish",
    rating: 4.9,
    reviews: 128,
  },
  {
    image: "/images/card-item/pexels-photo-5699475.jpg",
    title: "Advance Writing — Batch C",
    desc: "Master Task 1 and Task 2 writing skills.",
    schedule: "Flexible",
    href: "/courses/writing",
    rating: 4.9,
    reviews: 128,
  },
  {
    image: "/images/card-item/pexels-photo-207756.jpg",
    title: "Academic IELTS — Batch A",
    desc: "Intensive prep for university admission goals.",
    schedule: "Weekends",
    href: "/courses/academic",
    rating: 4.9,
    reviews: 128,
  },
  {
    image: "/images/card-item/pexels-photo-5185074.jpg",
    title: "Spoken English — Batch B",
    desc: "Build fluency and confidence for speaking.",
    schedule: "Weekdays & Evenings",
    href: "/courses/spokenEnglish",
    rating: 4.9,
    reviews: 128,
  },
  {
    image: "/images/card-item/pexels-photo-5699475.jpg",
    title: "Advance Writing — Batch C",
    desc: "Master Task 1 and Task 2 writing skills.",
    schedule: "Flexible",
    href: "/courses/writing",
    rating: 4.9,
    reviews: 128,
  },
];

const VISIBLE = 3;

export default function IeltsPrep() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const pages = cardItem.length - VISIBLE + 1;

  const goTo = (index) => {
    setCurrent(index);
    const cardWidth = trackRef.current.children[0].offsetWidth + 16;
    trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
  };

  return (
    <section className="bg-[#f9fafb] py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header Row */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-700">
              IELTS Preparation
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Achieve your desired score with Bangladesh’s top IELTS exam
              coaching expert!
            </p>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
              aria-label="Previous"
            >
              <i className="ti ti-chevron-left text-base" aria-hidden="true" />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === pages - 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
              aria-label="Next"
            >
              <i className="ti ti-chevron-right text-base" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex flex-col md:flex-row gap-4 transition-transform duration-300 ease-in-out"
          >
            {cardItem.map((batch, index) => (
              <div
                key={index}
                className="w-full md:w-[calc((100%-32px)/3)] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                {/* Card Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={batch.image}
                    alt={batch.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
                    <span className="text-xs text-yellow-400">★</span>
                    <span className="text-xs font-semibold text-white">
                      {batch.rating}
                    </span>
                    <span className="text-xs text-white/70">
                      ({batch.reviews})
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="mb-1.5 text-lg font-semibold text-gray-700">
                    {batch.title}
                  </h3>
                  <p className="mb-3 leading-relaxed text-gray-500">
                    {batch.desc}
                  </p>

                  {/* Schedule */}
                  <div className="mb-4 flex items-center gap-2  text-gray-500">
                    <i
                      className="ti ti-calendar text-blue-600"
                      aria-hidden="true"
                    />
                    <span>{batch.schedule}</span>
                  </div>

                  {/* Button */}
                  <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-blue-600" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
