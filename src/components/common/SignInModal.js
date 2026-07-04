"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInModal({ onClose }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    // Fetch session to check role and redirect
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    onClose();

    if (role === "admin" || role === "teacher" || role === "moderator") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Signup failed.");
      return;
    }

    // Auto login after signup
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    onClose();
    router.push("/dashboard");
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-x text-sm" />
        </button>

        {/* Logo + Title */}
        <div className="text-center mb-6">
          <Link href="/" onClick={onClose}>
            <img
              src="/images/IELTS7.jpeg"
              alt="IELTS7+"
              className="h-12 mx-auto rounded-xl"
            />
          </Link>
          <h1 className="text-xl font-extrabold text-slate-800 mt-3">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {tab === "login"
              ? "Log in to your student account"
              : "Sign up to get started"}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all mb-4"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-4 h-4"
            alt="Google"
          />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                tab === t
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400"
              }`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            <i className="ti ti-alert-circle flex-shrink-0" />
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Logging in...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-5">
          Admin?{" "}
          <Link
            href="/admin/login"
            onClick={onClose}
            className="text-blue-600 font-bold hover:underline"
          >
            Go to Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}
