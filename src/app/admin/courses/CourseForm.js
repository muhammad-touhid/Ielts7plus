"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const defaultForm = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  icon: "ti ti-certificate",
  price: "",
  duration: "",
  batchSize: "",
  classes: "",
  level: "",
  badge: "",
  features: [""],
  highlights: [{ icon: "ti ti-star", label: "" }],
  whatYouWillLearn: [{ icon: "ti ti-book", title: "", desc: "" }],
  published: false,
};

export default function CourseForm({ course }) {
  const router = useRouter();
  const isEdit = !!course;

  const [form, setForm] = useState(
    course
      ? {
          ...course,
          features: course.features ?? [""],

          highlights: course.highlights ?? [{ icon: "ti ti-star", label: "" }],
          whatYouWillLearn: course.whatYouWillLearn ?? [
            { icon: "ti ti-book", title: "", desc: "" },
          ],
        }
      : defaultForm,

    console.log(course.features),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto generate slug from name
  const handleNameChange = (val) => {
    const slug = val
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, name: val, slug }));
  };

  // Features
  const updateFeature = (i, val) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm((f) => ({ ...f, features: updated }));
  };
  const addFeature = () =>
    setForm((f) => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i) =>
    setForm((f) => ({
      ...f,
      features: f.features.filter((_, idx) => idx !== i),
    }));

  // Highlights
  const updateHighlight = (i, key, val) => {
    const updated = [...form.highlights];
    updated[i] = { ...updated[i], [key]: val };
    setForm((f) => ({ ...f, highlights: updated }));
  };
  const addHighlight = () =>
    setForm((f) => ({
      ...f,
      highlights: [...f.highlights, { icon: "ti ti-star", label: "" }],
    }));
  const removeHighlight = (i) =>
    setForm((f) => ({
      ...f,
      highlights: f.highlights.filter((_, idx) => idx !== i),
    }));

  // What You Will Learn
  const updateLearn = (i, key, val) => {
    const updated = [...form.whatYouWillLearn];
    updated[i] = { ...updated[i], [key]: val };
    setForm((f) => ({ ...f, whatYouWillLearn: updated }));
  };
  const addLearn = () =>
    setForm((f) => ({
      ...f,
      whatYouWillLearn: [
        ...f.whatYouWillLearn,
        { icon: "ti ti-book", title: "", desc: "" },
      ],
    }));
  const removeLearn = (i) =>
    setForm((f) => ({
      ...f,
      whatYouWillLearn: f.whatYouWillLearn.filter((_, idx) => idx !== i),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/courses/${course.id}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/courses");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Course Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. IELTS Preparation"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              required
              placeholder="e.g. ielts-preparation"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tagline *</label>
          <input
            type="text"
            required
            placeholder="Short catchy line about the course"
            value={form.tagline}
            onChange={(e) =>
              setForm((f) => ({ ...f, tagline: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea
            required
            rows={4}
            placeholder="Full description of the course..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Icon Class *</label>
            <input
              type="text"
              required
              placeholder="e.g. ti ti-certificate"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Badge (optional)</label>
            <input
              type="text"
              placeholder="e.g. Most Popular"
              value={form.badge}
              onChange={(e) =>
                setForm((f) => ({ ...f, badge: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-list text-blue-600" />
          Course Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <label className={labelClass}>Price *</label>
            <input
              type="text"
              required
              placeholder="e.g. ৳ 8,500"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Duration *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2 Months"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Batch Size *</label>
            <input
              type="text"
              required
              placeholder="e.g. 15–20 Students"
              value={form.batchSize}
              onChange={(e) =>
                setForm((f) => ({ ...f, batchSize: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Classes Per Week *</label>
            <input
              type="text"
              required
              placeholder="e.g. 3 Classes / Week"
              value={form.classes}
              onChange={(e) =>
                setForm((f) => ({ ...f, classes: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Level *</label>
            <input
              type="text"
              required
              placeholder="e.g. Beginner to Advanced"
              value={form.level}
              onChange={(e) =>
                setForm((f) => ({ ...f, level: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-list-check text-blue-600" />
            Course Features
          </h2>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all"
          >
            <i className="ti ti-plus text-sm" />
            Add Feature
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Feature ${i + 1}`}
                value={f}
                onChange={(e) => updateFeature(i, e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="w-9 h-9 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* What You Will Learn */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-bulb text-blue-600" />
            What You Will Learn
          </h2>
          <button
            type="button"
            onClick={addLearn}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all"
          >
            <i className="ti ti-plus text-sm" />
            Add Item
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {form.whatYouWillLearn.map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3 border border-slate-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Item {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeLearn(i)}
                  className="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                >
                  <i className="ti ti-x text-xs" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Icon (e.g. ti ti-book)"
                  value={item.icon}
                  onChange={(e) => updateLearn(i, "icon", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => updateLearn(i, "title", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.desc}
                  onChange={(e) => updateLearn(i, "desc", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-star text-blue-600" />
            Course Highlights
          </h2>
          <button
            type="button"
            onClick={addHighlight}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all"
          >
            <i className="ti ti-plus text-sm" />
            Add Highlight
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {form.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Icon (e.g. ti ti-star)"
                value={h.icon}
                onChange={(e) => updateHighlight(i, "icon", e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                placeholder="Label (e.g. 96% Success Rate)"
                value={h.label}
                onChange={(e) => updateHighlight(i, "label", e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                className="w-9 h-9 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
              >
                <i className="ti ti-x text-sm" />
              </button>
            </div>
          ))}
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
            onClick={() => router.push("/admin/courses")}
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
                {isEdit ? "Update Course" : "Create Course"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
