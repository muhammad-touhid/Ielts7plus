"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateEnrollmentStatus({ id, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus) {
    setLoading(true);
    await fetch(`/api/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setLoading(false);
    router.refresh();
  }

  if (status === "confirmed") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-600">
          Confirmed
        </span>
        <button
          onClick={() => handleChange("cancelled")}
          disabled={loading}
          className="text-xs font-bold px-3 py-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-600">
          Cancelled
        </span>
        <button
          onClick={() => handleChange("pending")}
          disabled={loading}
          className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
        >
          Revert
        </button>
      </div>
    );
  }

  // pending
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleChange("confirmed")}
        disabled={loading}
        className="text-xs font-bold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
      >
        {loading ? "..." : "Confirm"}
      </button>
      <button
        onClick={() => handleChange("cancelled")}
        disabled={loading}
        className="text-xs font-bold px-3 py-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
