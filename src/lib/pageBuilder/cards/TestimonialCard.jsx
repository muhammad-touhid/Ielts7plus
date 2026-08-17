// src/lib/pageBuilder/cards/TestimonialCard.jsx
"use client";

export function TestimonialCard({ item }) {
  return (
    <div
      className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      style={{
        background: "var(--card-bg, #ffffff)",
        padding: "var(--card-padding, 28px)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
        style={{
          background:
            "color-mix(in srgb, var(--card-accent, #2563eb) 12%, transparent)",
        }}
      >
        <i
          className="ti ti-quote text-base"
          style={{ color: "var(--card-accent, #2563eb)" }}
        />
      </div>
      <p
        className="leading-relaxed flex-1 mb-6"
        style={{
          color: "var(--card-text-color, #64748b)",
          fontSize: "var(--card-text-size, 0.875rem)",
        }}
      >
        &quot;{item.review}&quot;
      </p>
      <div className="w-full h-px bg-slate-100 mb-5" />
      <div className="flex items-center gap-4">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-100"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg ring-2 ring-sky-100"
            style={{
              background:
                "color-mix(in srgb, var(--card-accent, #2563eb) 12%, transparent)",
              color: "var(--card-accent, #2563eb)",
            }}
          >
            {item.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className="font-bold truncate"
            style={{
              color: "var(--card-title-color, #1e293b)",
              fontSize: "var(--card-title-size, 0.875rem)",
            }}
          >
            {item.name}
          </p>
          <p
            className="text-xs opacity-60 truncate"
            style={{ color: "var(--card-text-color, #64748b)" }}
          >
            {item.designation}
          </p>
        </div>
        <div
          className="text-sm"
          style={{ color: "var(--card-title-color, #1e293b)" }}
        >
          <span className="text-yellow-500">★</span> {item.rating}
        </div>
      </div>
    </div>
  );
}
