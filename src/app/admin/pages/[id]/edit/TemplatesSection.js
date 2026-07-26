// src/app/admin/pages/[id]/edit/TemplatesSection.js
"use client";

import { templates } from "@/lib/pageBuilder/templates";

// Rendered INSIDE Puck's own native left sidebar (via overrides.drawer),
// not as a separate column — this is what keeps everything to one sidebar
// with collapsible sections instead of two side-by-side panels.
export default function TemplatesSection({ onInsert }) {
  return (
    <div className="p-2 space-y-1">
      {templates.map((t) => (
        <button
          key={t.key}
          onClick={() => onInsert(t.build())}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
        >
          <span className="block text-sm font-medium text-gray-800">{t.label}</span>
          <span className="block text-[11px] text-gray-400">{t.description}</span>
        </button>
      ))}
    </div>
  );
}
