// src/app/admin/site-theme/SiteThemeForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TOKENS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
];

export default function SiteThemeForm({ initialColors }) {
  const router = useRouter();
  const [colors, setColors] = useState(initialColors);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedOk(false);
    try {
      const res = await fetch("/api/site-theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          `Save failed (${res.status}): ${body.error || "Unknown error"}`,
        );
      } else {
        setSavedOk(true);
        router.refresh();
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {TOKENS.map((t) => (
        <div key={t.key} className="flex items-center gap-3">
          <label className="w-24 text-sm text-gray-700">{t.label}</label>
          <input
            type="color"
            value={colors[t.key] || "#000000"}
            onChange={(e) => setColors({ ...colors, [t.key]: e.target.value })}
            className="w-9 h-9 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={colors[t.key] || ""}
            onChange={(e) => setColors({ ...colors, [t.key]: e.target.value })}
            className="border border-gray-300 rounded-md px-2 py-1.5 text-sm w-28"
          />
        </div>
      ))}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {savedOk && !error && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Saved successfully.
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}
