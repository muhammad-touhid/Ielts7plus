import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#354e98] to-[#4a71df] px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-200 bg-white/10 px-4 py-1.5 rounded-full mb-4">
            Upcoming Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            IELTS7+ Events
          </h1>
          <p className="text-blue-200 text-sm max-w-xl mx-auto">
            Join our free seminars, workshops, and mock test sessions to boost
            your IELTS preparation.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
              >
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3">
                  <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start">
                    {event.badge}
                  </span>
                  <h2 className="font-extrabold text-slate-800 text-lg leading-snug">
                    {event.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {event.para}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-calendar text-blue-400" />{" "}
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-clock text-blue-400" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-map-pin text-blue-400" />{" "}
                      {event.campus}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-calendar" />
            </div>
            <p className="font-bold text-slate-600 mb-1">No upcoming events</p>
            <p className="text-sm text-slate-400">
              Check back soon for new events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
