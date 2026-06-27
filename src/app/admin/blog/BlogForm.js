"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import ImageUpload from "../ImageUpload";

export default function BlogForm({ post }) {
  const isEdit = !!post;
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    image: post?.image || "",
    author: post?.author || "",
    readTime: post?.readTime || "",
    published: post?.published || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  // Auto-generate slug from title
  function generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function handleTitleChange(e) {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: isEdit ? f.slug : generateSlug(title),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/blog/${post.id}` : "/api/blog";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700">Post Details</h2>

        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={form.title}
            required
            onChange={handleTitleChange}
            placeholder="e.g. How to Score Band 7 in IELTS Writing"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text"
            value={form.slug}
            required
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="how-to-score-band-7-ielts-writing"
            className={inputClass}
          />
          <p className="text-xs text-slate-400 mt-1">
            URL: /blog/{form.slug || "your-slug"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Category *</label>
            <input
              type="text"
              value={form.category}
              required
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Writing Tips"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Author *</label>
            <input
              type="text"
              value={form.author}
              required
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="e.g. John Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Read Time *</label>
            <input
              type="text"
              value={form.readTime}
              required
              onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              placeholder="e.g. 5 min read"
              className={inputClass}
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

        <div>
          <label className={labelClass}>Excerpt *</label>
          <textarea
            value={form.excerpt}
            required
            rows={2}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Short summary shown on blog listing page..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
        <h2 className="text-sm font-extrabold text-slate-700">Content *</h2>
        <QuillEditor
          value={form.content}
          onChange={(val) => setForm({ ...form, content: val })}
        />
      </div>

      {/* Published toggle */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
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
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
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
          {loading ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}

// Separate client component for Quill to avoid SSR
function QuillEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [ReactQuill, setReactQuill] = useState(null);

  useEffect(() => {
    import("react-quill-new").then((mod) => {
      setReactQuill(() => mod.default);
      setMounted(true);
    });
  }, []);

  if (!mounted || !ReactQuill) {
    return (
      <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
        <p className="text-xs text-slate-400">Loading editor...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="quill-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Write your blog post content here..."
        style={{ minHeight: "300px" }}
      />
    </div>
  );
}
