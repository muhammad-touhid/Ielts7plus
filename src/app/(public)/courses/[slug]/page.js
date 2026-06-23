import { getCourse, getAllSlugs } from "@/lib/coursesData";
import { notFound } from "next/navigation";
import Link from "next/link";

// Generate static pages at build time
export function generateStaticParams() {
  return getAllSlugs();
}

// Dynamic page metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourse(params.slug);
  if (!course) return {};
  return {
    title: `${course.name} — IELTS7+`,
    description: course.description,
  };
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = getCourse(slug);

  if (!course) notFound();

  const details = [
    { icon: "ti ti-clock", label: "Duration", value: course.duration },
    { icon: "ti ti-users", label: "Batch Size", value: course.batchSize },
    { icon: "ti ti-calendar-event", label: "Classes", value: course.classes },
    { icon: "ti ti-signal", label: "Level", value: course.level },
    { icon: "ti ti-tag", label: "Course Fee", value: course.price },
  ];

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
        {/* Grid pattern */}
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

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <i className="ti ti-chevron-right text-xs" />
            <Link
              href="/courses"
              className="hover:text-white transition-colors"
            >
              Courses
            </Link>
            <i className="ti ti-chevron-right text-xs" />
            <span className="text-white font-medium">{course.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl text-white flex-shrink-0">
              <i className={course.icon} />
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                {course.name}
              </h1>
              <p className="text-blue-100 text-lg">{course.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 py-16 flex flex-col gap-14">
        {/* Description + Details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
                About This Course
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                <i className="ti ti-list-check text-blue-600 text-xl" />
                Course Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <i className="ti ti-circle-check-filled text-emerald-500 text-base mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 sticky top-24">
              <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
                <i className="ti ti-info-circle text-blue-600 text-xl" />
                Course Details
              </h3>
              <ul className="flex flex-col gap-4">
                {details.map((d, i) => (
                  <li key={i}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-sm text-slate-500">
                        <i className={`${d.icon} text-blue-500 text-base`} />
                        {d.label}
                      </div>
                      <span className="text-sm font-bold text-slate-800 text-right">
                        {d.value}
                      </span>
                    </div>
                    {i < details.length - 1 && (
                      <div className="mt-4 h-px bg-slate-100" />
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#enroll"
                className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl
                  shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-300
                  transition-all duration-200"
              >
                <i className="ti ti-calendar-event" />
                Enroll Now
              </a>
              <p className="text-center text-xs text-slate-400 mt-3">
                No hidden fees. Seats are limited.
              </p>
            </div>
          </div>
        </div>

        {/* What You Will Learn */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            What You Will Learn
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Key skills and outcomes you will gain from this course.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {course.whatYouWillLearn.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                  <i className={item.icon} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Highlights */}
        <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-10">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white mb-8 text-center">
              Course Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {course.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-2xl text-white">
                    <i className={h.icon} />
                  </div>
                  <span className="text-sm font-bold text-white">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">
              Ready to get started?
            </h3>
            <p className="text-slate-500 text-sm">
              Enroll today and take the first step toward your Band 7+ goal.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/batch-schedule"
              className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 text-sm font-bold px-6 py-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            >
              <i className="ti ti-calendar" />
              View Batches
            </Link>
            <a
              href="#enroll"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
            >
              <i className="ti ti-arrow-right" />
              Enroll Now
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
