"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const defaultForm = {
  name: "",
  designation: "",
  image: "",
  rating: 5,
  review: "",
  published: false,
};

export default function ReviewForm({ review }) {
  const router = useRouter();
  const isEdit = !!review;
  const [form, setForm] = useState(review ?? defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit ? `/api/reviews/${review.id}` : "/api/reviews";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/reviews");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to save review. Please try again.");
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form fields */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
            <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <i className="ti ti-info-circle text-blue-600" />
              Student Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Jahan"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Undergraduate Student, BUET"
                  value={form.designation}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, designation: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Profile Image URL (optional)</label>
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm((f) => ({ ...f, image: e.target.value }))
                }
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1">
                Leave blank to show a default avatar. R2 upload coming soon.
              </p>
            </div>

            {/* Star rating selector */}
            <div>
              <label className={labelClass}>Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: s }))}
                    className="text-2xl transition-transform hover:scale-110"
                  >
                    <i
                      className={`ti ${s <= form.rating ? "ti-star text-amber-400" : "ti-star text-slate-300"}`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-slate-600 ml-2">
                  {form.rating} / 5
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Review Text *</label>
              <textarea
                required
                rows={5}
                placeholder="Write the student's review here..."
                value={form.review}
                onChange={(e) =>
                  setForm((f) => ({ ...f, review: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <i className="ti ti-eye text-blue-600" />
              Preview
            </h2>

            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <i className="ti ti-quote text-blue-600 text-base" />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed italic">
              "{form.review || "Review text will appear here..."}"
            </p>

            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <i
                  key={s}
                  className={`ti ${s <= form.rating ? "ti-star-filled text-amber-400" : "ti-star text-slate-200"} text-xs`}
                />
              ))}
            </div>

            <div className="w-full h-px bg-slate-100" />

            <div className="flex items-center gap-3">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <i className="ti ti-user text-base" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {form.name || "Student Name"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {form.designation || "Designation"}
                </p>
              </div>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="relative"
                onClick={() =>
                  setForm((f) => ({ ...f, published: !f.published }))
                }
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
                  {form.published ? "Visible on site" : "Hidden from site"}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/reviews")}
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
              {isEdit ? "Update Review" : "Create Review"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
