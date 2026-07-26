// src/app/admin/pages/[id]/edit/TemplatesPanel.js
"use client";

import { templates } from "@/lib/pageBuilder/templates";

// Not a Puck component — this is a plain toolbar of buttons. Clicking one
// builds a template fragment (real Section/Heading/Text/Button/Icon
// component data, see src/lib/pageBuilder/templates.js) and hands it to
// the parent editor, which merges it into the page and forces Puck to
// pick up the new layers.
export default function TemplatesPanel({ onInsert }) {
  return (
    <div className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Insert Template</p>
        <p className="text-[11px] text-gray-400 mt-1">
          Adds real, separate elements you can edit or delete individually.
        </p>
      </div>
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
    </div>
  );
}
