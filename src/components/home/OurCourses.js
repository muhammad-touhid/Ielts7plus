import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function OurCourses() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      slug: true,
      name: true,
      tagline: true,
      icon: true,
      coverImage: true,
      duration: true,
      level: true,
      price: true,
      badge: true,
    },
  });

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 tracking-widest uppercase">
            What we offer
          </span>
          <h2 className="mb-3 text-3xl font-bold text-slate-800">
            Our Courses
          </h2>
          <p className="mx-auto max-w-xl leading-relaxed text-slate-500">
            We have designed our program to ensure your IELTS success.
          </p>
        </div>

        {/* Cards Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
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
                    <i className={`${course.icon} text-white/50 text-5xl`} />
                  </div>
                )}

                {/* Card body */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Badge */}
                  {course.badge && (
                    <span className="self-start text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {course.badge}
                    </span>
                  )}

                  {/* Title + tagline */}
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-clock text-blue-400" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-signal text-blue-400" />
                      {course.level}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                    <span className="text-base font-extrabold text-blue-600">
                      {course.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
                      Learn More
                      <i className="ti ti-arrow-right text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400">No courses available yet.</p>
          </div>
        )}

        {/* See All button */}
        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
          >
            See All Courses
            <i className="ti ti-arrow-right text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}
