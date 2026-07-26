// src/app/admin/pages/[id]/edit/CollapsibleSection.js
"use client";

// Plain <details>/<summary> — no extra dependency, gives native collapse/
// expand ("dropdown section") behavior with an arrow indicator.
export default function CollapsibleSection({ title, defaultOpen = true, children }) {
  return (
    <details open={defaultOpen} className="border-b border-gray-100">
      <summary className="cursor-pointer select-none px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:bg-gray-50 flex items-center justify-between">
        {title}
        <span className="text-gray-300">▾</span>
      </summary>
      <div>{children}</div>
    </details>
  );
}
