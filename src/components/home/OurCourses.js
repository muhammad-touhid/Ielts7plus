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
    },
  });

  return (
    <section className="bg-white py-16">
      <div className="mx-auto container px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
            What we offer
          </span>
          <h2 className="mb-3 text-3xl font-bold text-gray-700">Our Courses</h2>
          <p className="mx-auto max-w-xl leading-relaxed text-gray-500">
            We have designed our program to ensure your IELTS success.
          </p>
        </div>

        {/* Cards Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-sm"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <i
                    className={`ti ${course.icon} text-xl text-blue-600`}
                    aria-hidden="true"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 font-semibold text-gray-700">
                    {course.name}
                  </h3>
                  <p className="leading-relaxed text-gray-500 text-sm line-clamp-2">
                    {course.tagline}
                  </p>
                </div>

                {/* Arrow */}
                <i
                  className="ti ti-arrow-right mt-0.5 shrink-0 text-base text-gray-300 transition-colors group-hover:text-blue-500"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No courses available yet.</p>
          </div>
        )}

        {/* See More button */}
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
