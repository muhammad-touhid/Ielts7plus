"use client";

import CTASection from "@/components/shared/CTASection";
import SuccessStats from "@/components/shared/SuccessStats";
import Link from "next/link";

const team = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Md. Rafiqul Islam",
    role: "Founder & Lead Instructor",
    bio: "British Council certified IELTS trainer with over 10 years of experience helping students achieve Band 7+.",
    social: { linkedin: "#", facebook: "#" },
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Nadia Rahman",
    role: "Head of Writing & Grammar",
    bio: "MA in Applied Linguistics from Dhaka University. Specialist in academic writing and IELTS Task 2 strategies.",
    social: { linkedin: "#", facebook: "#" },
  },
  {
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Tanvir Ahmed",
    role: "Speaking & Listening Coach",
    bio: "Experienced communication trainer with a focus on fluency, pronunciation, and IELTS Speaking band descriptors.",
    social: { linkedin: "#", facebook: "#" },
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Sabrina Hossain",
    role: "Student Support Manager",
    bio: "Dedicated to ensuring every student has the resources, guidance, and motivation to reach their target score.",
    social: { linkedin: "#", facebook: "#" },
  },
];

const values = [
  {
    icon: "ti ti-heart",
    title: "Student First",
    desc: "Every decision we make is guided by what is best for our students — their success is our success.",
  },
  {
    icon: "ti ti-shield-check",
    title: "Integrity",
    desc: "We are honest, transparent, and consistent in everything we do — from pricing to feedback.",
  },
  {
    icon: "ti ti-bulb",
    title: "Excellence",
    desc: "We hold ourselves to the highest standard of teaching quality, materials, and student outcomes.",
  },
  {
    icon: "ti ti-users",
    title: "Community",
    desc: "We build a supportive learning environment where every student feels welcomed and motivated.",
  },
  {
    icon: "ti ti-refresh",
    title: "Continuous Growth",
    desc: "We constantly evolve our methods, content, and approach to stay ahead of exam trends.",
  },
  {
    icon: "ti ti-target",
    title: "Results Driven",
    desc: "We measure our success by one thing — the band scores our students achieve on exam day.",
  },
];

export default function AboutPage() {
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
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            Built for One Purpose —{" "}
            <span className="relative inline-block">
              Your Band 7+
              <span className="absolute bottom-1 left-0 w-full h-2 bg-white/20 rounded-full -z-10" />
            </span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            IELTS7+ was founded in Dhaka with a simple belief — every student
            deserves access to world-class IELTS coaching that is structured,
            affordable, and genuinely effective. Since day one, we have helped
            thousands of students achieve the scores they need to study, work,
            and build their futures abroad.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16 flex flex-col gap-16">
        <SuccessStats />
        {/* Mission & Vision */}
        <section>
          <div className="mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              What Drives Us
            </span>
            <h2 className="text-3xl font-bold text-gray-700">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
                <i className="ti ti-rocket" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-3">
                  Our Mission
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To provide every IELTS aspirant in Bangladesh with access to
                  expert-led, structured, and result-oriented coaching that
                  empowers them to achieve their target band score and unlock
                  global opportunities in education, work, and immigration.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
                <i className="ti ti-eye" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-3">
                  Our Vision
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To become Bangladesh's most trusted IELTS preparation
                  institute — recognised not just for the band scores we help
                  students achieve, but for the confidence, skills, and global
                  mindset we build in every learner who walks through our doors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section>
          <div className="mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl font-bold text-gray-700 mb-3">
              Our Values
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-xl">
              These are the principles that guide how we teach, support, and
              grow alongside every student at IELTS7+.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                  <i className={v.icon} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section>
          <div className="mb-10">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              The People Behind IELTS7+
            </span>
            <h2 className="text-3xl font-bold text-gray-700 mb-3">
              Meet Our Team
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-xl">
              Our instructors and staff are passionate about one thing — helping
              you reach your Band 7+ goal as efficiently as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center gap-4"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-1">
                    {member.name}
                  </h3>
                  <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                    {member.role}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
                <div className="w-full h-px bg-slate-100" />
                <div className="flex items-center gap-3">
                  <a
                    href={member.social.linkedin}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <i className="ti ti-brand-linkedin text-sm" />
                  </a>
                  <a
                    href={member.social.facebook}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <i className="ti ti-brand-facebook text-sm" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CTASection />
    </main>
  );
}
