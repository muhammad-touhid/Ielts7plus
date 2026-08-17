// src/app/admin/pages/[id]/edit/RenamePageForm.js
"use client";

import { useState } from "react";
import { RESERVED_SLUGS } from "@/lib/pageBuilder/reservedSlugs";

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function RenamePageForm({
  pageId,
  initialTitle,
  initialSlug,
  onRenamed,
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");

    if (RESERVED_SLUGS.includes(slug)) {
      setError(`"${slug}" is reserved and can't be used as a page slug`);
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setEditing(false);
    onRenamed?.(data);
  }

  function handleCancel() {
    setEditing(false);
    setTitle(initialTitle);
    setSlug(initialSlug);
    setError("");
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-center gap-1"
        title="Click to rename"
      >
        {title}
        <span className="text-gray-400 font-normal">
          /{slug === "home" ? "" : slug}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
        placeholder="Page title"
      />
      <input
        value={slug}
        onChange={(e) => setSlug(slugify(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
        placeholder="url-slug"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="text-sm px-3 py-1 text-gray-500 hover:text-gray-800"
      >
        Cancel
      </button>
      {error && <p className="text-xs text-red-600 ml-2">{error}</p>}
    </div>
  );
}
