"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: "ti ti-device-mobile" },
  { id: "nagad", label: "Nagad", icon: "ti ti-device-mobile" },
  { id: "bank", label: "Bank Transfer", icon: "ti ti-building-bank" },
  { id: "cash", label: "Cash at Centre", icon: "ti ti-cash" },
];

export default function EnrollmentModal({ batch, onClose, onSuccess }) {
  const { data: session, status } = useSession();

  // Auth step state
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup"
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Enrollment form state
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    paymentMethod: "",
    transactionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  // ── Auth handlers ──────────────────────────────────────
  function handleAuthChange(e) {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await signIn("credentials", {
      email: authForm.email,
      password: authForm.password,
      redirect: false,
    });
    setAuthLoading(false);
    if (res?.error) return setAuthError("Invalid email or password.");
    // session will update automatically via useSession
    setForm((f) => ({ ...f, email: authForm.email }));
  }

  async function handleSignup(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthLoading(false);
      return setAuthError(data.error || "Signup failed.");
    }
    // Auto login after signup
    await signIn("credentials", {
      email: authForm.email,
      password: authForm.password,
      redirect: false,
    });
    setAuthLoading(false);
    setForm((f) => ({
      ...f,
      name: authForm.name,
      email: authForm.email,
      phone: authForm.phone,
    }));
  }

  // ── Enrollment handler ─────────────────────────────────
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
          userId: session?.user?.id || null,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit enrollment.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Modal header (shared) ──────────────────────────────
  const ModalHeader = () => (
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
              <i className="ti ti-clock text-blue-400" /> {batch.time}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <i className="ti ti-calendar text-blue-400" /> {batch.startDate}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <i className="ti ti-users text-blue-400" /> {batch.seats} seats
              left
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
  );

  // ── Loading session ────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10 flex items-center justify-center z-10">
          <i className="ti ti-loader-2 animate-spin text-2xl text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        <ModalHeader />

        {/* ── STEP 1: Not logged in → show auth ── */}
        {!session ? (
          <div className="px-7 py-6 flex flex-col gap-4">
            <p className="text-xs text-slate-500 text-center">
              Please log in or sign up to continue enrollment.
            </p>

            {/* Google */}
            <button
              onClick={() =>
                signIn("google", { callbackUrl: window.location.href })
              }
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <img
                src="https://www.google.com/favicon.ico"
                className="w-4 h-4"
              />
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setAuthTab(t);
                    setAuthError("");
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authTab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
                >
                  {t === "login" ? "Log In" : "Sign Up"}
                </button>
              ))}
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
                {authError}
              </div>
            )}

            {authTab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  className={inputClass}
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className={inputClass}
                  required
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {authLoading ? "Logging in..." : "Log In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col gap-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={authForm.name}
                  onChange={handleAuthChange}
                  className={inputClass}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                  className={inputClass}
                  required
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  value={authForm.phone}
                  onChange={handleAuthChange}
                  className={inputClass}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  className={inputClass}
                  required
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {authLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* ── STEP 2: Logged in → show enrollment form ── */
          <form
            onSubmit={handleSubmit}
            className="px-7 py-6 flex flex-col gap-5"
          >
            {/* Logged in as */}
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-700">
                  {session.user.name}
                </p>
                <p className="text-xs text-emerald-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <i className="ti ti-circle-check text-emerald-500 text-lg" />
            </div>

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

            <div className="w-full h-px bg-slate-100" />

            {/* Payment */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Payment Details
              </h3>
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

              {form.paymentMethod === "cash" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-amber-700">
                  <i className="ti ti-info-circle flex-shrink-0 mt-0.5" />
                  <p>
                    Please visit our centre to complete your payment. Your seat
                    will be reserved for 48 hours after enrollment.
                  </p>
                </div>
              )}

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

            <button
              type="submit"
              disabled={loading || !form.paymentMethod}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <i className="ti ti-check" /> Confirm Enrollment
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              By enrolling you agree to our terms. We will confirm your seat
              within 24 hours.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
