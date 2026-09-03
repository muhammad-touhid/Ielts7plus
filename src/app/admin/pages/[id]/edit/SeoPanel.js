"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const TITLE_RECOMMENDED_MAX = 60;
const DESCRIPTION_RECOMMENDED_MAX = 160;

export default function SeoPanel({
  pageId,
  open,
  onClose,
  initialMetaTitle,
  initialMetaDescription,
  initialMetaKeywords,
  onSaved,
}) {
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialMetaDescription || "",
  );
  const [metaKeywords, setMetaKeywords] = useState(initialMetaKeywords || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metaTitle, metaDescription, metaKeywords }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save SEO settings.");
        setSaving(false);
        return;
      }
      setSaving(false);
      onSaved?.({ metaTitle, metaDescription, metaKeywords });
      onClose();
    } catch {
      setError("Failed to save SEO settings.");
      setSaving(false);
    }
  }

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  return typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 p-4"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">SEO Settings</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-3 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                  <span>Meta Title</span>
                  <span
                    className={
                      titleLen > TITLE_RECOMMENDED_MAX
                        ? "text-amber-600"
                        : "text-gray-400"
                    }
                  >
                    {titleLen}/{TITLE_RECOMMENDED_MAX}
                  </span>
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Leave blank to use the page title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Shown as the clickable headline in Google search results. Aim
                  for under {TITLE_RECOMMENDED_MAX} characters — longer titles
                  usually get cut off.
                </p>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-medium text-gray-600 mb-1">
                  <span>Meta Description</span>
                  <span
                    className={
                      descLen > DESCRIPTION_RECOMMENDED_MAX
                        ? "text-amber-600"
                        : "text-gray-400"
                    }
                  >
                    {descLen}/{DESCRIPTION_RECOMMENDED_MAX}
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="A short summary shown under the title in search results"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Aim for under {DESCRIPTION_RECOMMENDED_MAX} characters. This
                  doesn't directly affect ranking, but a good description
                  improves click-through from the search results page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Meta Keywords (optional)
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="ielts course, band 7, dhaka ielts"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Comma-separated. Modern search engines (Google, Bing) largely
                  ignore this now — included for completeness, not expected to
                  move rankings.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save SEO Settings"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
}
