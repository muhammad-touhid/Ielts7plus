"use client";

import { useState } from "react";

export default function EventRegistrationForm({ eventId, eventTitle }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/event-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, ...form }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 text-center sticky top-24">
        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ti ti-circle-check text-emerald-500 text-2xl" />
        </div>
        <h3 className="font-extrabold text-slate-800 mb-1.5">
          You're Registered!
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          We've received your registration for{" "}
          <span className="font-semibold text-slate-700">{eventTitle}</span>.
          We'll be in touch with further details.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Register another person
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 sticky top-24">
      <h3 className="font-extrabold text-slate-800 text-lg mb-1">
        Register for this Event
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Fill in your details below and we'll save your spot.
      </p>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
          <i className="ti ti-alert-circle flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Event name — auto-filled, read-only */}
        <div>
          <label className={labelClass}>Event</label>
          <div className="w-full bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-3 rounded-xl border border-blue-100 flex items-center gap-2">
            <i className="ti ti-calendar-event text-blue-400" />
            {eventTitle}
          </div>
        </div>

        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email Address *</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="01XXXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Message (optional)</label>
          <textarea
            rows={3}
            placeholder="Any questions or notes..."
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <>
              <i className="ti ti-loader-2 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <i className="ti ti-send" />
              Register Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}
