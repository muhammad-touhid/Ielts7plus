// src/lib/pageBuilder/widgets/CourseGrid.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COLUMN_OPTIONS = {
  "2": { label: "2 Columns", className: "sm:grid-cols-2" },
  "3": { label: "3 Columns", className: "sm:grid-cols-2 lg:grid-cols-3" },
  "4": { label: "4 Columns", className: "sm:grid-cols-2 lg:grid-cols-4" },
};

function CourseCard({ course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
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
          <i className={`${course.icon || "ti ti-book"} text-white/50 text-5xl`} />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {course.badge && (
          <span className="self-start text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {course.badge}
          </span>
        )}

        <div>
          <h3 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.tagline}</p>
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
          <span className="text-base font-extrabold text-blue-600">{course.price}</span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
            Learn More
            <i className="ti ti-arrow-right text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Just the cards — no header text, no "See All" button. Build the
// eyebrow/heading/subheading with Badge/Heading/Text and the button with
// ButtonBlock, placed before/after this in a Section however you like.
export const CourseGrid = {
  label: "Course Grid (Live Data)",
  fields: {
    limit: {
      type: "select",
      label: "Number of Courses",
      options: [
        { label: "3", value: "3" },
        { label: "6", value: "6" },
        { label: "9", value: "9" },
        { label: "12", value: "12" },
      ],
    },
    columns: {
      type: "select",
      label: "Columns",
      options: Object.entries(COLUMN_OPTIONS).map(([value, { label }]) => ({ label, value })),
    },
  },
  defaultProps: {
    id: "coursegrid-default",
    limit: "6",
    columns: "3",
  },
  render: function CourseGridRender({ limit, columns }) {
    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
      let cancelled = false;
      fetch(`/api/public/courses?limit=${limit}`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setCourses(data.courses || []);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
      return () => {
        cancelled = true;
      };
    }, [limit]);

    const columnClass = (COLUMN_OPTIONS[columns] || COLUMN_OPTIONS["3"]).className;

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-sm text-slate-400">Couldn&apos;t load courses right now.</p>
        </div>
      );
    }

    if (courses === null) {
      return (
        <div className={`grid grid-cols-1 ${columnClass} gap-6`}>
          {Array.from({ length: parseInt(limit, 10) }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="w-full aspect-video bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-sm text-slate-400">No courses available yet.</p>
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-1 ${columnClass} gap-6`}>
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    );
  },
};
