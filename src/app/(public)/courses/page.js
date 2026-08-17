export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-20 px-5">
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
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-200 bg-white/10 px-4 py-1.5 rounded-full mb-4">
            Our Courses
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            Find the Right Course for You
          </h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Expert-led courses designed to help you achieve your target band
            score and beyond.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <div className="container mx-auto px-5 py-16">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Cover image */}
                {course.coverImage ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={course.coverImage}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-[#354e98] to-[#4a71df] flex items-center justify-center">
                    <i className={`${course.icon} text-white/60 text-5xl`} />
                  </div>
                )}

                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Badge */}
                  {course.badge && (
                    <span className="self-start text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {course.badge}
                    </span>
                  )}

                  {/* Info */}
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h2>
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-clock text-blue-400" />{" "}
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-signal text-blue-400" />{" "}
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-calendar-event text-blue-400" />{" "}
                      {course.classes}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    {course.salePrice ? (
                      <span className="flex items-baseline gap-2">
                        <span className="text-sm text-slate-400 line-through">
                          {course.price}
                        </span>
                        <span className="text-lg font-extrabold text-blue-600">
                          {course.salePrice}
                        </span>
                      </span>
                    ) : (
                      <span className="text-lg font-extrabold text-blue-600">
                        {course.price}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:gap-2.5 transition-all">
                      View Course <i className="ti ti-arrow-right text-sm" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-books" />
            </div>
            <p className="font-bold text-slate-600 mb-1">
              No courses available
            </p>
            <p className="text-sm text-slate-400">Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
