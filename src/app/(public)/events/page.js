"use client";

import { useState } from "react";

const events = [
  {
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    badge: "Seminar",
    title: "IELTS Band 7+ Masterclass: Strategies That Actually Work",
    para: "Join our senior instructor for a power-packed seminar on proven techniques to boost your overall band score fast.",
    date: "July 5, 2025",
    time: "10:00 AM – 12:00 PM",
    campus: "Dhaka Main Centre",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    badge: "Workshop",
    title: "Writing Task 2 Workshop: Essay Planning in 5 Minutes",
    para: "A hands-on workshop where you will practise structuring high-scoring essays under timed conditions with live feedback.",
    date: "July 10, 2025",
    time: "2:00 PM – 5:00 PM",
    campus: "Online (Zoom)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80",
    badge: "Club Meeting",
    title: "English Speaking Club — Monthly Meetup",
    para: "Practice your spoken English in a relaxed, supportive group environment with fellow IELTS7+ students.",
    date: "July 15, 2025",
    time: "5:00 PM – 7:00 PM",
    campus: "Dhaka Main Centre",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    badge: "Seminar",
    title: "Study Abroad Info Session: UK, Canada & Australia",
    para: "Learn about visa requirements, university applications, and how your IELTS score impacts your admission chances.",
    date: "July 20, 2025",
    time: "11:00 AM – 1:00 PM",
    campus: "Online (Zoom)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=600&q=80",
    badge: "Workshop",
    title: "Listening Skills Workshop: Cracking Every Question Type",
    para: "A focused workshop on multiple choice, map labelling, and sentence completion strategies for IELTS Listening.",
    date: "July 25, 2025",
    time: "3:00 PM – 5:30 PM",
    campus: "Dhaka Main Centre",
  },
  {
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80",
    badge: "Club Meeting",
    title: "Reading Circle: Tackling Academic Texts with Confidence",
    para: "Join our reading club session where students work through real IELTS Reading passages together with instructor guidance.",
    date: "August 2, 2025",
    time: "4:00 PM – 6:00 PM",
    campus: "Dhaka Main Centre",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80",
    badge: "Seminar",
    title: "Parent & Student Orientation Seminar — August Batch",
    para: "An informational session for new students and their families to understand our teaching approach, schedule, and expectations.",
    date: "August 5, 2025",
    time: "10:00 AM – 11:30 AM",
    campus: "Dhaka Main Centre",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
    badge: "Workshop",
    title: "Speaking Part 2 Bootcamp: Cue Card Confidence",
    para: "Practice delivering fluent, well-structured cue card responses with real-time feedback from a certified IELTS examiner.",
    date: "August 12, 2025",
    time: "2:00 PM – 4:30 PM",
    campus: "Online (Zoom)",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    badge: "Club Meeting",
    title: "Debate & Discussion Club — Monthly Session",
    para: "Sharpen your critical thinking and spoken fluency through structured debates on real-world topics.",
    date: "August 18, 2025",
    time: "5:30 PM – 7:30 PM",
    campus: "Dhaka Main Centre",
  },
];

const categories = ["All", "Seminar", "Workshop", "Club Meeting"];

const ITEMS_PER_PAGE = 6;

const badgeStyles = {
  Seminar: "bg-blue-600 text-white",
  Workshop: "bg-emerald-500 text-white",
  "Club Meeting": "bg-amber-400 text-amber-900",
};

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = events.filter(
    (e) => activeCategory === "All" || e.badge === activeCategory,
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
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

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            What's On
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Upcoming Events
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            Stay engaged beyond the classroom. Join our seminars, workshops, and
            club meetings designed to accelerate your IELTS preparation and keep
            you motivated throughout your journey.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-16 flex flex-col gap-10">
        {/* Filter + count row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200
                  ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400 flex-shrink-0">
            <span className="font-bold text-slate-600">{filtered.length}</span>{" "}
            events found
          </p>
        </div>

        {/* Events Grid */}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((event, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Badge */}
                  <span
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${badgeStyles[event.badge]}`}
                  >
                    {event.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1">
                    {event.para}
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-slate-100" />

                  {/* Meta */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <i className="ti ti-calendar-event text-blue-500 text-base flex-shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <i className="ti ti-clock text-blue-500 text-base flex-shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <i className="ti ti-map-pin text-blue-500 text-base flex-shrink-0" />
                      {event.campus}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="#register"
                    className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl
                      shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register Now
                    <i className="ti ti-arrow-right text-sm" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-calendar-off" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-2">
              No events found
            </h3>
            <p className="text-sm text-slate-400">
              Try selecting a different category.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400
                hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i className="ti ti-chevron-left text-base" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-200
                    ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "border-2 border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600"
                    }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400
                hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i className="ti ti-chevron-right text-base" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
