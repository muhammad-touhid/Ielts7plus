"use client";

import { useState } from "react";

const faqs = [
  {
    category: "General",
    question: "What is IELTS7+ and who is it for?",
    answer:
      "IELTS7+ is a premium IELTS preparation institute based in Dhaka, Bangladesh. We offer structured, expert-led courses for students, professionals, and anyone planning to study or migrate abroad who needs to achieve a Band 7 or above in the IELTS exam.",
  },
  {
    category: "General",
    question: "Do I need prior English knowledge to join?",
    answer:
      "It depends on the course. Our Grammar & Writing and Spoken English courses are suitable for beginners. For IELTS Preparation and Advanced Writing, an intermediate level of English is recommended. We offer a free assessment to help you choose the right course.",
  },
  {
    category: "General",
    question: "Are classes held online or in-person?",
    answer:
      "We offer both in-person classes at our Dhaka centre and live online classes via Zoom. All live sessions are recorded so you can revisit them anytime through your student portal.",
  },
  {
    category: "Courses",
    question: "How many courses do you offer?",
    answer:
      "We currently offer four courses: IELTS Preparation, Spoken English, Advanced Writing, and Grammar & Writing. Each course is designed for a specific learning goal and skill level.",
  },
  {
    category: "Courses",
    question: "Which course is best for achieving Band 7+?",
    answer:
      "Our IELTS Preparation course is specifically designed to help students reach Band 7 and above. It covers all four modules — Listening, Reading, Writing, and Speaking — with mock tests, personalised feedback, and exam strategies.",
  },
  {
    category: "Courses",
    question: "Can I take more than one course at a time?",
    answer:
      "Yes, you can. However, we recommend completing one course at a time to get the most out of each programme. Our advisors can help you plan a study schedule that fits your goals and timeline.",
  },
  {
    category: "Enrollment",
    question: "How do I enroll in a course?",
    answer:
      "You can enroll by clicking the Enroll Now button on any course or batch page, or by contacting us directly via phone or WhatsApp. Our team will guide you through the registration and payment process.",
  },
  {
    category: "Enrollment",
    question: "Is there a registration fee?",
    answer:
      "No separate registration fee is charged. The course fee covers everything including study materials, mock tests, and access to recorded sessions.",
  },
  {
    category: "Enrollment",
    question: "Can I switch batches after enrolling?",
    answer:
      "Yes, batch transfers are possible subject to seat availability. Please contact us at least one week before your current batch starts to request a transfer.",
  },
  {
    category: "Fees & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept cash payments at our centre, as well as bKash, Nagad, bank transfer, and card payments. Full payment is required at the time of enrollment.",
  },
  {
    category: "Fees & Payment",
    question: "Is there an installment option available?",
    answer:
      "Yes, for select courses we offer a two-installment payment plan. The first installment is due at enrollment and the second within the first two weeks of the course. Contact us for details.",
  },
  {
    category: "Fees & Payment",
    question: "Do you offer any discounts or scholarships?",
    answer:
      "We offer early bird discounts for students who enroll before the batch start date, as well as group discounts for three or more students enrolling together. Limited merit-based scholarships are also available — contact us to apply.",
  },
  {
    category: "Mock Tests",
    question: "How many mock tests are included in the course?",
    answer:
      "The IELTS Preparation course includes 10 full-length mock tests conducted under real exam conditions. Additional module-specific mini tests are held weekly throughout the course.",
  },
  {
    category: "Mock Tests",
    question: "Will I receive feedback on my mock test performance?",
    answer:
      "Yes. After every mock test you will receive a detailed performance report with band score predictions, error analysis, and personalised improvement tips from your instructor.",
  },
];

const categories = [
  "All",
  "General",
  "Courses",
  "Enrollment",
  "Fees & Payment",
  "Mock Tests",
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
        ${open ? "border-blue-200 shadow-md shadow-blue-50" : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
      >
        <span
          className={`text-sm font-bold leading-snug transition-colors duration-200 ${open ? "text-blue-600" : "text-slate-800"}`}
        >
          {faq.question}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300
          ${open ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-400"}`}
        >
          <i className="ti ti-chevron-down text-sm" />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-7 pb-6">
          <div className="w-full h-px bg-slate-100 mb-4" />
          <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    const matchCategory =
      activeCategory === "All" || f.category === activeCategory;
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-10">
            Find quick answers to the most common questions about our courses,
            enrollment, fees, and more.
          </p>

          {/* Search */}
          <div className="relative">
            <i className="ti ti-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
            <input
              type="text"
              placeholder="Search your question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-slate-700 text-sm placeholder-slate-400 pl-12 pr-5 py-4 rounded-2xl outline-none shadow-xl shadow-blue-900/20 focus:ring-2 focus:ring-blue-300 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="ti ti-x text-base" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16 flex flex-col gap-10">
        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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

        {/* Results count */}
        <p className="text-sm text-slate-400 -mt-4">
          Showing{" "}
          <span className="font-bold text-slate-600">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "result" : "results"}
          {activeCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="font-bold text-blue-600">{activeCategory}</span>
            </span>
          )}
          {search && (
            <span>
              {" "}
              for <span className="font-bold text-blue-600">"{search}"</span>
            </span>
          )}
        </p>

        {/* FAQ List */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-search-off" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-2">
              No results found
            </h3>
            <p className="text-sm text-slate-400">
              Try a different keyword or browse by category.
            </p>
          </div>
        )}

        {/* Still have questions */}
        <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-10 text-center">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/15 border border-white/20 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-5">
              <i className="ti ti-message-question" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-3">
              Still have a question?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto mb-7">
              Can't find what you're looking for? Our team is happy to help —
              reach out and we'll get back to you quickly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/8801700000000"
                className="inline-flex items-center gap-2 bg-white text-blue-600 text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <i className="ti ti-brand-whatsapp text-base" />
                WhatsApp Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-900/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                <i className="ti ti-mail text-base" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
