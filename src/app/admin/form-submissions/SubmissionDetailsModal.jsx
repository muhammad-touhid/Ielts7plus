"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

function prettifyKey(key) {
  const withoutIndex = key.replace(/-\d+$/, "");
  return withoutIndex
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SubmissionDetailsModal({ submission }) {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(submission.data || {});

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
      >
        View All
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-extrabold text-slate-800">
                  Submission Details
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className="ti ti-x text-lg" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {entries.length > 0 ? (
                  entries.map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {prettifyKey(key)}
                      </p>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {String(value) || "—"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No data submitted.</p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-0.5 text-xs text-slate-400">
                {submission.formLabel && <p>Form: {submission.formLabel}</p>}
                {(submission.pageTitle || submission.pageSlug) && (
                  <p>
                    Page: {submission.pageTitle || "—"}{" "}
                    {submission.pageSlug ? `(${submission.pageSlug})` : ""}
                  </p>
                )}
                <p>
                  Submitted:{" "}
                  {new Date(submission.createdAt).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
