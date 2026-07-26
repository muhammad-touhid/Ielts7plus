// src/app/admin/pages/[id]/edit/HeaderActions.js
"use client";

import { usePuck } from "@measured/puck";

// Rendered via Puck's `overrides.headerActions`, inside Puck's own
// context, so it can read live editor state with usePuck(). Two buttons:
//
// - "Save Draft"     -> writes to draftData only. The live published page
//                        (what /p/[slug] shows) is untouched.
// - "Publish"/"Update" -> writes to the published `data` field, clears
//                        any pending draft, sets status to published.
export default function HeaderActions({ status, saving, lastSavedRef, onSaveDraft, onPublish }) {
  const { appState } = usePuck();
  const currentJson = JSON.stringify(appState.data);
  const isDirty = currentJson !== lastSavedRef.current;

  let publishLabel = "Publish";
  let publishDisabled = false;
  let publishClasses = "bg-blue-600 hover:bg-blue-700 text-white";

  if (saving) {
    publishLabel = "Saving...";
    publishDisabled = true;
    publishClasses = "bg-blue-400 text-white cursor-wait";
  } else if (status === "published") {
    if (isDirty) {
      publishLabel = "Update";
    } else {
      publishLabel = "Published";
      publishDisabled = true;
      publishClasses = "bg-green-100 text-green-700 cursor-default";
    }
  }

  const draftDisabled = saving || !isDirty;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={draftDisabled}
        onClick={() => onSaveDraft(appState.data)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
          draftDisabled
            ? "border-gray-200 text-gray-400 cursor-default"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Save Draft
      </button>
      <button
        type="button"
        disabled={publishDisabled}
        onClick={() => onPublish(appState.data)}
        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${publishClasses}`}
      >
        {publishLabel}
      </button>
    </div>
  );
}
