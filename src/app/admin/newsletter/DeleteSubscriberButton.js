"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteSubscriberButton({ id }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this subscriber?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to delete subscriber.");
        setIsDeleting(false);
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete subscriber error:", error);
      alert("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
