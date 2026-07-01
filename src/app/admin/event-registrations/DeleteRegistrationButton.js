"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteRegistrationButton({ id, name }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/event-registrations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-bold px-3 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-all disabled:opacity-60"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white transition-all duration-200"
      title={`Delete registration from ${name}`}
    >
      <i className="ti ti-trash text-sm" />
      Delete
    </button>
  );
}
