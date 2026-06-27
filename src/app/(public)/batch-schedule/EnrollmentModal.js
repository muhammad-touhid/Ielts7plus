"use client";

import { useState } from "react";

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: "ti ti-device-mobile" },
  { id: "nagad", label: "Nagad", icon: "ti ti-device-mobile" },
  { id: "bank", label: "Bank Transfer", icon: "ti ti-building-bank" },
  { id: "cash", label: "Cash at Centre", icon: "ti ti-cash" },
];

export default function EnrollmentModal({ batch, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
    transactionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          batchId: batch.id,
          paymentMethod: form.paymentMethod,
          transactionId: form.transactionId,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit enrollment.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="sticky top-0 bg-white px-7 pt-7 pb-5 border-b border-slate-100 rounded-t-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-500 bg-sky-100 px-3 py-1 rounded-full mb-2">
                Enrollment Form
              </span>
              <h2 className="text-lg font-extrabold text-slate-800 leading-snug">
                {batch.name}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <i className="ti ti-clock text-blue-400" />
                  {batch.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <i className="ti ti-calendar text-blue-400" />
                  {batch.startDate}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <i className="ti ti-users text-blue-400" />
                  {batch.seats} seats left
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all flex-shrink-0"
            >
              <i className="ti ti-x text-base" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <i className="ti ti-alert-circle flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Personal Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Your Details
            </h3>

            <div>
              <label className={labelClass}>Full Name *</label>
              <div className="relative">
                <i className="ti ti-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative">
                <i className="ti ti-mail absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="relative">
                <i className="ti ti-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+880 1700-000000"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-100" />

          {/* Payment Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Payment Details
            </h3>

            {/* Payment method */}
            <div>
              <label className={labelClass}>Payment Method *</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, paymentMethod: pm.id }))
                    }
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                      ${
                        form.paymentMethod === pm.id
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                      }`}
                  >
                    <i className={`${pm.icon} text-base`} />
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction ID — only for digital payments */}
            {["bkash", "nagad", "bank"].includes(form.paymentMethod) && (
              <div>
                <label className={labelClass}>
                  Transaction ID *
                  <span className="ml-1 text-slate-400 normal-case font-normal">
                    (
                    {form.paymentMethod === "bank"
                      ? "last 6 digits"
                      : "bKash/Nagad ref no."}
                    )
                  </span>
                </label>
                <div className="relative">
                  <i className="ti ti-receipt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                  <input
                    type="text"
                    name="transactionId"
                    required
                    placeholder="e.g. 8TX7Y2"
                    value={form.transactionId}
                    onChange={handleChange}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            )}

            {/* Cash note */}
            {form.paymentMethod === "cash" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-amber-700">
                <i className="ti ti-info-circle flex-shrink-0 mt-0.5" />
                <p>
                  Please visit our centre to complete your payment. Your seat
                  will be reserved for 48 hours after enrollment.
                </p>
              </div>
            )}

            {/* Payment info box */}
            {form.paymentMethod && form.paymentMethod !== "cash" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-blue-700">
                <i className="ti ti-info-circle flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Send payment to:</p>
                  <p className="text-xs text-blue-500">
                    {form.paymentMethod === "bkash" &&
                      "bKash: 01700-000000 (Personal)"}
                    {form.paymentMethod === "nagad" &&
                      "Nagad: 01700-000000 (Personal)"}
                    {form.paymentMethod === "bank" &&
                      "Bank: IELTS7+ Ltd — A/C: 1234567890 — BRAC Bank"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.paymentMethod}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <i className="ti ti-check" />
                Confirm Enrollment
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            By enrolling you agree to our terms. We will confirm your seat
            within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
