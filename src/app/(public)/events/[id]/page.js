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
      {/* Hero Image or Gradient */}
      {event.image ? (
        <div className="h-64 sm:h-80 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-[#354e98] to-[#4a71df]" />
      )}

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* Back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors self-start"
        >
          <i className="ti ti-arrow-left text-base" />
          Back to Events
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start">
            {event.badge}
          </span>

          <h1 className="text-2xl font-extrabold text-slate-800 leading-snug">
            {event.title}
          </h1>

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
                  <p className="text-sm font-bold text-slate-700">{d.value}</p>
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

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all text-sm mt-2"
          >
            <i className="ti ti-phone" />
            Contact Us to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
