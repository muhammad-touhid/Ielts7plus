// src/app/admin/pages/DeletePageButton.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePageButton({ pageId, pageTitle }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${pageTitle}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      alert(`Delete failed: ${body.error || "Unknown error"}`);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
