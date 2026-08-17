"use client";

import Link from "next/link";

export function CourseCard({ item: course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full"
      style={{ background: "var(--card-bg, #ffffff)" }}
    >
      {course.coverImage ? (
        <div className="w-full aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.coverImage}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-[#354e98] to-[#4a71df] flex items-center justify-center">
          <i
            className={`${course.icon || "ti ti-book"} text-white/50 text-5xl`}
          />
        </div>
      )}

      <div
        className="flex flex-col gap-3 flex-1"
        style={{ padding: "var(--card-padding, 20px)" }}
      >
        {course.badge && (
          <span className="self-start text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {course.badge}
          </span>
        )}

        <div>
          <h3
            className="font-extrabold"
            style={{
              color: "var(--card-title-color, #1e293b)",
              fontSize: "var(--card-title-size, 1.125rem)",
            }}
          >
            {course.name}
          </h3>
          <p
            className="mt-1 line-clamp-2"
            style={{
              color: "var(--card-text-color, #64748b)",
              fontSize: "var(--card-text-size, 0.875rem)",
            }}
          >
            {course.tagline}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <i className="ti ti-clock text-blue-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <i className="ti ti-signal text-blue-400" />
            {course.level}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          {course.salePrice ? (
            <span className="flex items-baseline gap-2">
              <span
                className="line-through"
                style={{
                  color: "var(--card-text-color, #64748b)",
                  fontSize: "var(--card-text-size, 0.875rem)",
                }}
              >
                {course.price}
              </span>
              <span
                className="font-extrabold"
                style={{
                  color: "var(--card-accent, #2563eb)",
                  fontSize: "var(--card-button-size, 0.875rem)",
                }}
              >
                {course.salePrice}
              </span>
            </span>
          ) : (
            <span
              className="font-extrabold"
              style={{
                color: "var(--card-accent, #2563eb)",
                fontSize: "var(--card-button-size, 0.875rem)",
              }}
            >
              {course.price}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 font-bold group-hover:gap-2 transition-all"
            style={{
              color: "var(--card-accent, #2563eb)",
              fontSize: "var(--card-button-size, 0.75rem)",
            }}
          >
            Learn More
            <i className="ti ti-arrow-right text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
