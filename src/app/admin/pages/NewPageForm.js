// src/app/admin/pages/NewPageForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPageForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug: slug || slugify(title) }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    router.refresh();
    router.push(`/admin/pages/${data.id}/edit`);
  }

  return (
    <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Page title</label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(slugify(e.target.value));
          }}
          placeholder="About Us"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">URL slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="about-us"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Page"}
      </button>
      {error && <p className="text-sm text-red-600 w-full">{error}</p>}
    </form>
  );
}
