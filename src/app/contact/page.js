"use client";

import { useState } from "react";

const contactDetails = [
  {
    icon: "ti ti-map-pin",
    label: "Our Address",
    value: "Level 4, Arcadia, Dorshon Deuri, Amberkhana, Sylhet, Bangladesh",
    link: null,
  },
  {
    icon: "ti ti-phone-call",
    label: "Phone Number",
    value: "+880 1711-153678",
    link: "tel:+8801711153678",
  },
  {
    icon: "ti ti-mail",
    label: "Email Address",
    value: "info@ielts7plus.co.uk",
    link: "mailto:info@ielts7plus.co.uk",
  },
  {
    icon: "ti ti-clock",
    label: "Office Hours",
    value: "Saturday – Thursday, 10:00 AM – 7:00 PM",
    link: null,
  },
];

const socials = [
  {
    icon: "ti ti-brand-facebook",
    href: "https://www.facebook.com/ielts7plus",
    label: "Facebook",
  },
  {
    icon: "ti ti-brand-instagram",
    href: "https://www.instagram.com/ielts.7plus",
    label: "Instagram",
  },
  { icon: "ti ti-brand-youtube", href: "#", label: "YouTube" },
  { icon: "ti ti-brand-whatsapp", href: "#", label: "WhatsApp" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            We'd Love to Hear{" "}
            <span className="relative inline-block">
              From You
              <span className="absolute bottom-1 left-0 w-full h-2 bg-white/20 rounded-full -z-10" />
            </span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            Have a question about our courses, batch schedules, or fees? Fill
            out the form below or reach us directly — our team responds within
            24 hours.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16 flex flex-col gap-10">
        {/* Top: Contact Details + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Contact Details */}
          <div className="flex flex-col gap-6">
            {/* Detail cards */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                  Contact Info
                </span>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Reach Us Directly
                </h2>
              </div>

              <ul className="flex flex-col gap-5">
                {contactDetails.map((d, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg flex-shrink-0 mt-0.5">
                      <i className={d.icon} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {d.label}
                      </p>
                      {d.link ? (
                        <a
                          href={d.link}
                          className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-slate-700">
                          {d.value}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100" />

              {/* Socials */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-2">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      aria-label={s.label}
                      className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-base
                        hover:bg-blue-600 hover:text-white transition-all duration-200"
                    >
                      <i className={s.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick response card */}
            <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-7">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
                <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center text-xl text-white mb-4">
                  <i className="ti ti-brand-whatsapp" />
                </div>
                <h4 className="text-sm font-extrabold text-white mb-2">
                  Need a Quick Reply?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed mb-5">
                  Message us on WhatsApp for the fastest response — we usually
                  reply within minutes.
                </p>
                <a
                  href="https://wa.me/8801700000000"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl
                    w-full justify-center hover:bg-blue-700 shadow-lg shadow-blue-900/30 transition-all duration-200"
                >
                  <i className="ti ti-brand-whatsapp" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
            {!submitted ? (
              <>
                <div className="mb-8">
                  <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                    Send a Message
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-800">
                    Fill Out the Form Below
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <i className="ti ti-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Your full name"
                          value={form.name}
                          onChange={handleChange}
                          className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <i className="ti ti-mail absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <div className="relative">
                        <i className="ti ti-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+880 1700-000000"
                          value={form.phone}
                          onChange={handleChange}
                          className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <i className="ti ti-tag absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                        <select
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full bg-slate-50 text-slate-700 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>
                            Select a subject
                          </option>
                          <option value="Course Inquiry">Course Inquiry</option>
                          <option value="Batch Schedule">Batch Schedule</option>
                          <option value="Fees & Payment">Fees & Payment</option>
                          <option value="Free Consultation">
                            Free Consultation
                          </option>
                          <option value="Other">Other</option>
                        </select>
                        <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl
                      shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed
                      transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <i className="ti ti-loader-2 animate-spin text-base" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-send text-base" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl text-emerald-500">
                  <i className="ti ti-circle-check" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl
                    shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
                >
                  <i className="ti ti-refresh text-sm" />
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-5">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
              Our Location
            </span>
            <h2 className="text-xl font-extrabold text-slate-800">
              Find Us on the Map
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Level 4, Arcadia, Dorshon Deuri, Amberkhana, Sylhet, Bangladesh
            </p>
          </div>
          <div className="w-full h-80 md:h-96">
            <iframe
              title="IELTS7+ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7237.781051812657!2d91.86177224549796!3d24.90171554302532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37505521ef38d845%3A0x73a5b1a7fba07536!2sCentre%20For%20Education%20-%20Sylhet!5e0!3m2!1sen!2sbd!4v1781699565395!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
