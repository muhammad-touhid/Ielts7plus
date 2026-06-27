"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    if (res?.error) return setError("Invalid email or password");
    router.push("/dashboard");
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
      return setError(data.error || "Signup failed");
    }
    // Auto login after signup
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/">
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
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
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
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl mb-4">
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
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
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
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
