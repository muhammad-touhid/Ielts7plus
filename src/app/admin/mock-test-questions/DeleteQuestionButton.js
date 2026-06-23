"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteQuestionButton({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/mock-test-questions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete question.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 disabled:opacity-50"
    >
      <i
        className={`${loading ? "ti ti-loader-2 animate-spin" : "ti ti-trash"} text-sm`}
      />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
