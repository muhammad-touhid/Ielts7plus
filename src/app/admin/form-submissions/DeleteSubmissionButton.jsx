"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSubmissionButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/form-submissions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete submission.");
      }
    } catch {
      alert("Failed to delete submission.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete submission"
    >
      <i className="ti ti-trash text-base" />
    </button>
  );
}
