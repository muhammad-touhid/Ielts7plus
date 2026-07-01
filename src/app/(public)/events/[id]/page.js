import prisma from "@/lib/prisma";
import EventRegistrationForm from "../EventRegistrationForm";

export default async function SingleEventPage({ params }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-20 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {event.badge && (
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
              {event.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-7">
            {event.title}
          </h1>

          {/* Date / Time / Campus */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-2.5">
              <i className="ti ti-calendar text-white/70" />
              <div className="text-left">
                <p className="text-xs text-blue-100/70">Date</p>
                <p className="text-sm font-bold text-white">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <i className="ti ti-clock text-white/70" />
              <div className="text-left">
                <p className="text-xs text-blue-100/70">Time</p>
                <p className="text-sm font-bold text-white">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <i className="ti ti-map-pin text-white/70" />
              <div className="text-left">
                <p className="text-xs text-blue-100/70">Campus</p>
                <p className="text-sm font-bold text-white">{event.campus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2:1 layout */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left — event details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {event.image && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <i className="ti ti-calendar text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm font-bold text-slate-700">
                      {event.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="ti ti-clock text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="text-sm font-bold text-slate-700">
                      {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="ti ti-map-pin text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-400">Campus</p>
                    <p className="text-sm font-bold text-slate-700">
                      {event.campus}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="text-slate-600 text-sm leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: event.para }}
              />
            </div>
          </div>

          {/* Right — registration form */}
          <div className="w-full lg:w-1/3">
            <EventRegistrationForm
              eventId={event.id}
              eventTitle={event.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
