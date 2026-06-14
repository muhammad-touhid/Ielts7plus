import Link from "next/link";

const courses = [
  {
    icon: "ti-book",
    title: "IELTS Regular Batch",
    desc: "Offline classes with intensive practice sessions, mock tests, and performance tracking.",
    href: "#",
  },
  {
    icon: "ti-brand-parsinta",
    title: "IELTS Online Batch",
    desc: "Interactive online classes for students across Bangladesh with live Q&A support.",
    href: "/courses/general",
  },
  {
    icon: "ti-bolt",
    title: "IELTS Crash Course",
    desc: "Perfect for last-minute prep. Covers all modules with tips & tricks in just 3 weeks.",
    href: "/courses/writing",
  },
  {
    icon: "ti-microphone",
    title: "Spoken English",
    desc: "Expert guidance for enhancing your spoken English through interactive sessions.",
    href: "/courses/spokenEnglish",
  },
  {
    icon: "ti-pencil",
    title: "Grammar & Writing",
    desc: "Special sessions aimed at enhancing English grammar and writing skills.",
    href: "/courses/mock-tests",
  },
  {
    icon: "ti-abc",
    title: "Mock Test",
    desc: "Prepare for the real test with our comprehensive mock tests and assessments.",
    href: "/courses/grammar",
  },
];

export default function OurCourses() {
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.title}
              href={course.href}
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
                <h3 className="mb-1  font-semibold text-gray-700">
                  {course.title}
                </h3>
                <p className=" leading-relaxed text-gray-500">{course.desc}</p>
              </div>

              {/* Arrow */}
              <i
                className="ti ti-arrow-right mt-0.5 shrink-0 text-base text-gray-300 transition-colors group-hover:text-blue-500"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
