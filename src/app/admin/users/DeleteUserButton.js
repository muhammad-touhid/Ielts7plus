"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteUserButton({ id, name }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/users");
      else alert("Failed to delete user.");
    } catch {
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
