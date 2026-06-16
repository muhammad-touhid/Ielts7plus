"use client";

import Link from "next/link";

const guides = [
  {
    icon: "ti ti-user-check",
    heading: "Getting Started",
    para: "Everything you need to know before your first class at IELTS7+.",
    list: [
      "Complete your enrollment form online",
      "Attend the free orientation session",
      "Download the student handbook",
      "Set up your student portal account",
      "Join your batch WhatsApp group",
    ],
  },
  {
    icon: "ti ti-book-2",
    heading: "Course Materials",
    para: "All study resources are provided to help you prepare effectively.",
    list: [
      "Printed materials given on day one",
      "Access recorded classes anytime",
      "Download practice worksheets",
      "Use the online vocabulary bank",
      "Request extra resources from instructors",
    ],
  },
  {
    icon: "ti ti-clipboard-list",
    heading: "Mock Tests & Assessments",
    para: "Regular testing keeps you on track and exam-ready throughout the course.",
    list: [
      "Weekly module-specific mini tests",
      "Full mock test every two weeks",
      "Timed under real exam conditions",
      "Detailed answer explanation after each test",
      "Personal score tracker provided",
    ],
  },
  {
    icon: "ti ti-award",
    heading: "Certification & Completion",
    para: "What you receive upon successfully completing your course.",
    list: [
      "Course completion certificate issued",
      "Final performance report provided",
      "Band score prediction from instructors",
      "Post-course support for 30 days",
      "Alumni community access granted",
    ],
  },
];

const quickLinks = [
  {
    icon: "ti ti-calendar-event",
    label: "Batch Schedule",
    desc: "View all upcoming batch dates and timings.",
    href: "/batch-schedule",
    hoverBorder: "hover:border-blue-600",
  },
  {
    icon: "ti ti-books",
    label: "Our Courses",
    desc: "Explore all available courses and their details.",
    href: "/courses",
    hoverBorder: "hover:border-blue-600",
  },
  {
    icon: "ti ti-tag",
    label: "Course Fees",
    desc: "Transparent pricing with no hidden charges.",
    href: "/course-fees",
    hoverBorder: "hover:border-blue-600",
  },
  {
    icon: "ti ti-file-text",
    label: "Free Resources",
    desc: "Download free IELTS practice materials.",
    href: "/resources",
    hoverBorder: "hover:border-blue-600",
  },
  {
    icon: "ti ti-messages",
    label: "Student Forum",
    desc: "Connect with fellow students and share tips.",
    href: "/forum",

    hoverBorder: "hover:border-blue-600",
  },
  {
    icon: "ti ti-help-circle",
    label: "FAQs",
    desc: "Answers to the most commonly asked questions.",
    href: "/faq",

    hoverBorder: "hover:border-blue-600",
  },
];

const helpOptions = [
  {
    icon: "ti ti-phone-call",
    label: "Call Us",
    value: "+880 1700-000000",
    desc: "Available Sun–Thu, 9AM – 6PM",
    href: "tel:+8801711153678",
    btnLabel: "Call Now",
  },
  {
    icon: "ti ti-brand-whatsapp",
    label: "WhatsApp",
    value: "+880 1700-000000",
    desc: "Chat with us anytime, we reply fast.",
    href: "https://wa.me/8801711153678",
    btnLabel: "Message Us",
  },
  {
    icon: "ti ti-mail",
    label: "Email Us",
    value: "hello@ielts7plus.com",
    desc: "We'll respond within 24 hours.",
    href: "mailto:info@ielts7plus.co.uk",
    btnLabel: "Send Email",
  },
];

export default function StudentGuidePage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Page Hero */}
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

        <div className="relative z-10 container mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            Student Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Student Guide
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Everything you need to make the most of your IELTS7+ experience —
            from day one to exam day and beyond.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16 flex flex-col gap-16">
        {/* Section 1 — Student Guide Cards */}
        <section>
          <div className="mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl font-semibold text-gray-700 mb-3">
              Your Complete Student Guide
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-xl">
              Follow these steps and guidelines to get the best results from
              your course at IELTS7+.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col gap-5"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
                  <i className={card.icon} />
                </div>

                {/* Heading & Para */}
                <div>
                  <h3 className="text-base font-bold text-gray-700 mb-2">
                    {card.heading}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {card.para}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-100" />

                {/* List */}
                <ul className="flex flex-col gap-2.5">
                  {card.list.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <i className="ti ti-checks text-[#ef4444] text-base mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 — Quick Links */}
        <section>
          <div className="mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              Navigate
            </span>
            <h2 className="text-3xl font-semibold text-gray-700 mb-3">
              Quick Links
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-xl">
              Jump straight to the section you need — no searching required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className={`group bg-white rounded-2xl border-2 border-slate-100 p-6 flex items-center gap-4
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${link.hoverBorder}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-sky-50 text-blue-600 } group-hover:scale-110 transition-transform duration-300`}
                >
                  <i className={link.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 mb-0.5">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
                <i className="ti ti-arrow-right text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3 — Need More Help */}
        <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-10 md:p-14">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/70 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-4">
                Support
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-3">
                Need More Help?
              </h2>
              <p className="text-blue-100 text-base leading-relaxed max-w-lg mx-auto">
                Our team is always here to help. Reach out through any of the
                channels below and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Help Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {helpOptions.map((opt, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-7 flex flex-col items-center text-center gap-4"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-sky-50 text-blue-600`}
                  >
                    <i className={opt.icon} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-700 mb-1">
                      {opt.label}
                    </p>
                    <p className={`text-sm font-bold mb-1 text-gray-500`}>
                      {opt.value}
                    </p>
                    <p className="text-xs text-slate-400">{opt.desc}</p>
                  </div>
                  <a
                    href={opt.href}
                    className={`w-full inline-flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 shadow-blue-200`}
                  >
                    {opt.btnLabel}
                    <i className="ti ti-arrow-right text-sm" />
                  </a>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <p className="text-center text-blue-200 text-sm mt-8 flex items-center justify-center gap-2">
              <i className="ti ti-clock text-[#ef4444] text-base" />
              Office hours: Sunday – Thursday, 9:00 AM – 6:00 PM (BD Time)
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
