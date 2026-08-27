// src/app/admin/pages/NewPageForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RESERVED_SLUGS } from "@/lib/pageBuilder/reservedSlugs";

// Cleans each "/"-separated segment on its own, then rejoins with "/" —
// preserves nested paths like "courses/ielts-preparation" instead of
// collapsing the slash into a dash. Empty segments (from stray/double
// slashes) are dropped.
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .split("/")
    .map((segment) =>
      segment.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    )
    .filter(Boolean)
    .join("/");
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

    const finalSlug = slug || slugify(title);

    // Client-side check for fast feedback — the server enforces this
    // too (it's the actual guarantee, this is just nicer UX).
    if (RESERVED_SLUGS.includes(finalSlug)) {
      setError(
        `"${finalSlug}" is reserved and can't be used as a page slug (it already belongs to a real route).`,
      );
      return;
    }

    setLoading(true);
    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug: finalSlug }),
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
    <form
      onSubmit={handleCreate}
      className="flex flex-wrap items-end gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
    >
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Page title
        </label>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(slugify(e.target.value));
          }}
          placeholder="About Us"
          className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-gray-600 font-medium  mb-1">
          URL slug (Use a slash for nested)
        </label>
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="about-us or courses/ielts-preparation"
          className="w-full border border-gray-300 text-gray-500 rounded-md px-3 py-2 text-sm"
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
