export const revalidate = 300;
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function UpcomingEvents() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      para: true,
      image: true,
      badge: true,
      date: true,
      time: true,
      campus: true,
    },
  });

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 tracking-widest uppercase">
            Join us
          </span>
          <h2 className="mb-3 text-3xl font-bold text-slate-800">
            Upcoming Events
          </h2>
          <p className="mx-auto max-w-xl leading-relaxed text-slate-500">
            Join our free seminars, workshops, and mock test sessions to boost
            your IELTS preparation.
          </p>
        </div>

        {/* Cards Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Cover image */}
                {event.image ? (
                  <div className="w-full aspect-video overflow-hidden">
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

                {/* Card body */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Badge */}
                  {event.badge && (
                    <span className="self-start text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {event.badge}
                    </span>
                  )}

                  {/* Title + excerpt */}
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {event.para
                        .replace(/<[^>]*>/g, "")
                        .replace(/&[a-z]+;/g, " ")
                        .trim()}
                    </p>
                  </div>

                  {/* Meta */}
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

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-map-pin text-blue-400" />
                      {event.campus}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                      Details
                      <i className="ti ti-arrow-right text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No upcoming events yet.</p>
          </div>
        )}

        {/* See All button */}
        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
          >
            See All Events
            <i className="ti ti-arrow-right text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
