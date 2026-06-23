"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const defaultForm = {
  name: "",
  courseId: "",
  module: "Academic",
  time: "",
  schedule: "",
  startDate: "",
  seats: "",
  duration: "",
  badge: "",
  published: false,
};

const moduleOptions = [
  "Academic",
  "General",
  "Spoken English",
  "Writing",
  "Grammar",
];
const badgeOptions = ["", "Open", "Filling Fast", "New", "Closed"];

export default function BatchForm({ batch, courses }) {
  const router = useRouter();
  const isEdit = !!batch;

  const [form, setForm] = useState(batch ?? defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/batches/${batch.id}` : "/api/batches";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/batches");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to save batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <i className="ti ti-alert-circle flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-info-circle text-blue-600" />
          Batch Information
        </h2>

        {/* Batch Name */}
        <div>
          <label className={labelClass}>Batch Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. IELTS Academic — Morning Batch"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Course */}
          <div>
            <label className={labelClass}>Linked Course (optional)</label>
            <div className="relative">
              <select
                value={form.courseId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, courseId: e.target.value }))
                }
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">— No linked course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>

          {/* Module */}
          <div>
            <label className={labelClass}>Module *</label>
            <div className="relative">
              <select
                required
                value={form.module}
                onChange={(e) =>
                  setForm((f) => ({ ...f, module: e.target.value }))
                }
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {moduleOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Time */}
          <div>
            <label className={labelClass}>Class Time *</label>
            <input
              type="text"
              required
              placeholder="e.g. 7:00 AM – 9:00 AM"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Schedule */}
          <div>
            <label className={labelClass}>Weekly Schedule *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sat, Mon & Wed"
              value={form.schedule}
              onChange={(e) =>
                setForm((f) => ({ ...f, schedule: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Start Date */}
          <div>
            <label className={labelClass}>Start Date *</label>
            <input
              type="text"
              required
              placeholder="e.g. July 5, 2025"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          {/* Seats */}
          <div>
            <label className={labelClass}>Available Seats *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 20"
              value={form.seats}
              onChange={(e) =>
                setForm((f) => ({ ...f, seats: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          {/* Duration */}
          <div>
            <label className={labelClass}>Duration *</label>
            <input
              type="text"
              required
              placeholder="e.g. 8 Weeks"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Badge */}
        <div>
          <label className={labelClass}>Badge</label>
          <div className="relative">
            <select
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({ ...f, badge: e.target.value }))
              }
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {badgeOptions.map((b) => (
                <option key={b} value={b}>
                  {b === "" ? "— No badge —" : b}
                </option>
              ))}
            </select>
            <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Publish + Submit */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className="relative"
            onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
          >
            <div
              className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer ${form.published ? "bg-blue-600" : "bg-slate-200"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.published ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">
              {form.published ? "Published" : "Draft"}
            </p>
            <p className="text-xs text-slate-400">
              {form.published
                ? "Visible on public site"
                : "Hidden from public site"}
            </p>
          </div>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/batches")}
            className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-600 text-sm font-bold px-6 py-3 rounded-xl hover:border-slate-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 transition-all duration-200"
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <i className="ti ti-check" />
                {isEdit ? "Update Batch" : "Create Batch"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
