"use client";

import { useState } from "react";

export default function ContactForm() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-5">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl text-emerald-500">
          <i className="ti ti-circle-check" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">
            Message Sent!
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            Thank you for reaching out. Our team will get back to you within 24
            hours.
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
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          <i className="ti ti-refresh text-sm" />
          Send Another Message
        </button>
      </div>
    );
  }

  return (
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
              <option value="Free Consultation">Free Consultation</option>
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
        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
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
  );
}
