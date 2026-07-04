"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const VISIBLE = 3;

const moduleBadgeColor = {
  Academic: "bg-blue-50 text-blue-600",
  General: "bg-emerald-50 text-emerald-600",
  "Spoken English": "bg-violet-50 text-violet-600",
  Writing: "bg-amber-50 text-amber-600",
  Grammar: "bg-rose-50 text-rose-600",
};

const batchBadgeColor = {
  Open: "bg-emerald-500",
  "Filling Fast": "bg-amber-500",
  New: "bg-blue-500",
  Closed: "bg-slate-400",
};

export default function BatchCarouselClient({ batches }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const total = batches.length;
  const pages = Math.max(1, total - VISIBLE + 1);

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(index, pages - 1));
    setCurrent(clamped);
    if (trackRef.current?.children[0]) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 24;
      trackRef.current.style.transform = `translateX(-${clamped * cardWidth}px)`;
    }
  };

  return (
    <section className="bg-slate-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
              Upcoming Batches
            </span>
            <h2 className="text-3xl font-bold text-slate-800">
              Find the Right{" "}
              <span className="relative inline-block text-blue-600">
                Batch for You
                <span className="absolute bottom-1 left-0 w-full h-2 bg-sky-200 rounded-full -z-10" />
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Join one of our upcoming batches and start your IELTS journey with
              expert guidance.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all"
              >
                <i className="ti ti-chevron-left text-base" />
              </button>
              <button
                onClick={() => goTo(current + 1)}
                disabled={current >= pages - 1}
                className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-30 transition-all"
              >
                <i className="ti ti-chevron-right text-base" />
              </button>
            </div>

            {/* See More */}
            <Link
              href="/batch-schedule"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-blue-600 border-2 border-blue-200 hover:border-blue-600 px-5 py-2 rounded-xl transition-all"
            >
              See All Batches
              <i className="ti ti-arrow-right text-sm" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-300 ease-in-out"
          >
            {batches.map((batch, i) => (
              <div
                key={batch.id}
                className="w-full md:w-[calc((100%-48px)/3)] shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card top — gradient header */}
                <div className="relative bg-gradient-to-br from-[#354e98] to-[#4a71df] p-5 pb-8">
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div className="relative z-10 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-extrabold text-base leading-snug">
                        {batch.name}
                      </p>
                      {batch.course && (
                        <p className="text-blue-200 text-xs mt-1">
                          {batch.course.name}
                        </p>
                      )}
                    </div>
                    {batch.badge && (
                      <span
                        className={`text-xs font-bold text-white px-2.5 py-1 rounded-full flex-shrink-0 ${batchBadgeColor[batch.badge] || "bg-slate-500"}`}
                      >
                        {batch.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Module badge overlap */}
                <div className="mt-4 px-5">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${moduleBadgeColor[batch.module] || "bg-slate-100 text-slate-600"}`}
                  >
                    {batch.module}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 flex flex-col gap-3 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <i className="ti ti-calendar text-blue-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Start Date</p>
                        <p className="text-xs font-bold text-slate-700">
                          {batch.startDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <i className="ti ti-clock text-blue-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Time</p>
                        <p className="text-xs font-bold text-slate-700">
                          {batch.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <i className="ti ti-calendar-week text-blue-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Schedule</p>
                        <p className="text-xs font-bold text-slate-700">
                          {batch.schedule}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <i className="ti ti-hourglass text-blue-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Duration</p>
                        <p className="text-xs font-bold text-slate-700">
                          {batch.duration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Available Seats
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        batch.seats <= 5
                          ? "bg-rose-50 text-rose-600"
                          : batch.seats <= 10
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {batch.seats} seats left
                    </span>
                  </div>

                  {/* Enroll button */}
                  <Link
                    href={
                      batch.course?.slug
                        ? `/courses/${batch.course.slug}`
                        : "/batch-schedule"
                    }
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-100"
                  >
                    <i className="ti ti-pencil-plus text-sm" />
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots + mobile See More */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-blue-600"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <Link
            href="/batch-schedule"
            className="sm:hidden inline-flex items-center gap-2 text-sm font-bold text-blue-600 border-2 border-blue-200 hover:border-blue-600 px-5 py-2.5 rounded-xl transition-all"
          >
            See All Batches
            <i className="ti ti-arrow-right text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
