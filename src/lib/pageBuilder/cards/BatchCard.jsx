// src/lib/pageBuilder/cards/BatchCard.jsx
"use client";

import Link from "next/link";

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

// Title (header, on the gradient) and body detail values are visually
// separate elements on separate backgrounds — the header stays fixed
// white (it's locked to the gradient, same as the header background
// itself isn't affected by "Card Background"), and detail values keep
// their own fixed slate color rather than following Title Color.
export function BatchCard({ item: batch }) {
  return (
    <div
      className="rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full"
      style={{ background: "var(--card-bg, #ffffff)" }}
    >
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
            <p
              className="text-white font-extrabold leading-snug"
              style={{ fontSize: "var(--card-title-size, 1rem)" }}
            >
              {batch.name}
            </p>
            {batch.course && (
              <p className="text-blue-200 text-xs mt-1">{batch.course.name}</p>
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

      <div className="mt-4 px-5">
        <span
          className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${moduleBadgeColor[batch.module] || "bg-slate-100 text-slate-600"}`}
        >
          {batch.module}
        </span>
      </div>

      <div
        className="flex flex-col gap-3 flex-1"
        style={{ padding: "var(--card-padding, 16px 20px)" }}
      >
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
              <p className="text-xs font-bold text-slate-700">{batch.time}</p>
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

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">Available Seats</span>
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

        <Link
          href={
            batch.course?.slug
              ? `/courses/${batch.course.slug}`
              : "/batch-schedule"
          }
          className="mt-auto w-full inline-flex items-center justify-center gap-2 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all duration-200 shadow-md shadow-blue-100"
          style={{
            background: "var(--card-accent, #2563eb)",
            fontSize: "var(--card-button-size, 0.875rem)",
          }}
        >
          <i className="ti ti-pencil-plus text-sm" />
          Enroll Now
        </Link>
      </div>
    </div>
  );
}
