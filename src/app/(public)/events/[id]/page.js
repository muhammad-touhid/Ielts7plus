import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id, published: true },
  });
  if (!event) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero — same pattern as batch schedule */}
      <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            {event.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            {event.title}
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-calendar" /> {event.date}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-clock" /> {event.time}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-map-pin" /> {event.campus}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors self-start"
        >
          <i className="ti ti-arrow-left text-base" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Image inside content block */}
          {event.image && (
            <div className="h-64 sm:h-80 overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-7 flex flex-col gap-5">
            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "ti ti-calendar", label: "Date", value: event.date },
                { icon: "ti ti-clock", label: "Time", value: event.time },
                { icon: "ti ti-map-pin", label: "Campus", value: event.campus },
              ].map((d, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3"
                >
                  <i className={`${d.icon} text-blue-500 text-lg`} />
                  <div>
                    <p className="text-xs text-slate-400">{d.label}</p>
                    <p className="text-sm font-bold text-slate-700">
                      {d.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100" />

            <div>
              <h2 className="text-sm font-extrabold text-slate-700 mb-2">
                About this Event
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                {event.para}
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all text-sm"
            >
              <i className="ti ti-phone" />
              Contact Us to Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
