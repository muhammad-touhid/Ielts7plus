// src/lib/pageBuilder/cards/EventCard.jsx
"use client";

import Link from "next/link";

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, " ")
    .trim();
}

export function EventCard({ item: event }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full"
      style={{ background: "var(--card-bg, #ffffff)" }}
    >
      {event.image ? (
        <div className="w-full aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-[#354e98] to-[#4a71df] flex items-center justify-center">
          <i className="ti ti-calendar-event text-white/50 text-5xl" />
        </div>
      )}

      <div
        className="flex flex-col gap-3 flex-1"
        style={{ padding: "var(--card-padding, 20px)" }}
      >
        {event.badge && (
          <span className="self-start text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {event.badge}
          </span>
        )}

        <div>
          <h3
            className="font-extrabold group-hover:opacity-80 transition-opacity"
            style={{
              color: "var(--card-title-color, #1e293b)",
              fontSize: "var(--card-title-size, 1.125rem)",
            }}
          >
            {event.title}
          </h3>
          <p
            className="mt-1 line-clamp-2"
            style={{
              color: "var(--card-text-color, #64748b)",
              fontSize: "var(--card-text-size, 0.875rem)",
            }}
          >
            {stripHtml(event.para)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <i className="ti ti-calendar text-blue-400" />
            {event.date}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <i className="ti ti-clock text-blue-400" />
            {event.time}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <i className="ti ti-map-pin text-blue-400" />
            {event.campus}
          </span>
          <span
            className="inline-flex items-center gap-1 font-bold group-hover:gap-2 transition-all"
            style={{
              color: "var(--card-accent, #2563eb)",
              fontSize: "var(--card-button-size, 0.75rem)",
            }}
          >
            Details
            <i className="ti ti-arrow-right text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
