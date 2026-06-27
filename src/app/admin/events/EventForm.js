"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "../ImageUpload";

export default function EventForm({ event }) {
  const isEdit = !!event;
  const router = useRouter();
  const [form, setForm] = useState({
    title: event?.title || "",
    badge: event?.badge || "",
    para: event?.para || "",
    date: event?.date || "",
    time: event?.time || "",
    campus: event?.campus || "",
    image: event?.image || "",
    published: event?.published || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/events/${event.id}` : "/api/events";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin/events");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5"
    >
      {error && (
        <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Event Title *</label>
          <input
            type="text"
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Free IELTS Seminar"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Badge *</label>
          <input
            type="text"
            value={form.badge}
            required
            onChange={(e) => setForm({ ...form, badge: e.target.value })}
            placeholder="e.g. Free Event"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Campus *</label>
          <input
            type="text"
            value={form.campus}
            required
            onChange={(e) => setForm({ ...form, campus: e.target.value })}
            placeholder="e.g. Dhaka Campus"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Date *</label>
          <input
            type="text"
            value={form.date}
            required
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="e.g. January 15, 2026"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Time *</label>
          <input
            type="text"
            value={form.time}
            required
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            placeholder="e.g. 10:00 AM – 12:00 PM"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            value={form.para}
            required
            rows={4}
            onChange={(e) => setForm({ ...form, para: e.target.value })}
            placeholder="Brief description of the event..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>
            Image{" "}
            <span className="text-slate-400 normal-case font-normal">
              (optional)
            </span>
          </label>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
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
        <span className="text-sm font-bold text-slate-700">
          {form.published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          <i
            className={`${loading ? "ti ti-loader-2 animate-spin" : "ti ti-check"} text-sm`}
          />
          {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
