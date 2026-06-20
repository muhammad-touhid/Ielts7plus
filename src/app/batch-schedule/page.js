"use client";

const batches = [
  {
    name: "IELTS Academic — Intensive Batch",
    module: "Academic",
    time: "7:00 AM – 9:00 AM",
    schedule: "Sat, Mon & Wed",
    startDate: "July 5, 2025",
    seats: 8,
    duration: "8 Weeks",
    badge: "Filling Fast",
    badgeColor: "bg-rose-100 text-rose-600",
  },
  {
    name: "IELTS General Training — Morning Batch",
    module: "General",
    time: "9:30 AM – 11:30 AM",
    schedule: "Sun, Tue & Thu",
    startDate: "July 10, 2025",
    seats: 15,
    duration: "10 Weeks",
    badge: "Open",
    badgeColor: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "IELTS Academic — Evening Batch",
    module: "Academic",
    time: "6:00 PM – 8:00 PM",
    schedule: "Sat, Mon & Wed",
    startDate: "July 18, 2025",
    seats: 20,
    duration: "8 Weeks",
    badge: "Open",
    badgeColor: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "IELTS Crash Course — Weekend Batch",
    module: "Academic",
    time: "10:00 AM – 1:00 PM",
    schedule: "Fri & Sat",
    startDate: "August 2, 2025",
    seats: 12,
    duration: "6 Weeks",
    badge: "New",
    badgeColor: "bg-sky-100 text-sky-600",
  },
  {
    name: "IELTS General Training — Night Batch",
    module: "General",
    time: "9:00 PM – 11:00 PM",
    schedule: "Sun, Tue & Thu",
    startDate: "August 8, 2025",
    seats: 18,
    duration: "10 Weeks",
    badge: "Open",
    badgeColor: "bg-emerald-100 text-emerald-600",
  },
];

function SeatBar({ seats }) {
  const max = 20;
  const filled = max - seats;
  const percent = Math.round((filled / max) * 100);
  const color =
    seats <= 5
      ? "bg-rose-500"
      : seats <= 10
        ? "bg-amber-400"
        : "bg-emerald-500";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {seats} seats left
      </span>
    </div>
  );
}

export default function UpcomingBatches() {
  return (
    <section className="w-full bg-gradient-to-r from-[#354e98] to-[#4a71df] py-24 px-5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 mx-auto container">
        <div className="container mx-auto mt-15">
          {/* Page Header */}
          <div className="mb-14 px-3 md:px-0">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
              Our all
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 ">
              Upcoming Batches
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl">
              Choose a batch that fits your schedule and start your journey to
              Band 7+ with expert-led coaching and structured practice.
            </p>
          </div>

          {/* Batch List */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {batches.map((batch, i) => (
              <div key={i}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 px-8 py-8">
                  {/* Left Side */}
                  <div className="flex-1 flex flex-col gap-3">
                    {/* Badge + Module tag */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${batch.badgeColor}`}
                      >
                        {batch.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {batch.module}
                      </span>
                      <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                        {batch.duration}
                      </span>
                    </div>

                    {/* Batch Name */}
                    <h2 className="text-lg font-bold text-slate-800 leading-snug">
                      {batch.name}
                    </h2>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <i className="ti ti-clock text-blue-600 text-base" />
                        {batch.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <i className="ti ti-calendar-week text-blue-600 text-base" />
                        {batch.schedule}
                      </span>
                    </div>

                    {/* Seat bar */}
                    <div className="max-w-xs">
                      <SeatBar seats={batch.seats} />
                    </div>
                  </div>

                  {/* Divider (mobile horizontal, desktop vertical) */}
                  <div className="hidden md:block w-px h-20 bg-slate-100 flex-shrink-0" />
                  <div className="block md:hidden w-full h-px bg-slate-100" />

                  {/* Right Side */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:gap-4 flex-shrink-0 md:min-w-[180px]">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Starts On
                      </p>
                      <p className="text-lg font-extrabold text-blue-600">
                        {batch.startDate}
                      </p>
                    </div>
                    <a
                      href="#enroll"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl
                      shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200
                      transition-all duration-200 whitespace-nowrap"
                    >
                      Enroll Now
                      <i className="ti ti-arrow-right text-sm" />
                    </a>
                  </div>
                </div>

                {/* Row divider */}
                {i < batches.length - 1 && (
                  <div className="mx-8 h-px bg-slate-100" />
                )}
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-white py-8 px-3 flex items-center justify-center gap-2">
            <i className="ti ti-info-circle text-[#f87171] text-base" />
            Can't find a suitable time?
            <a
              href="#contact"
              className="text-[#f87171] font-semibold hover:underline"
            >
              Contact us
            </a>
            for a custom schedule.
          </p>
        </div>
      </div>
    </section>
  );
}
