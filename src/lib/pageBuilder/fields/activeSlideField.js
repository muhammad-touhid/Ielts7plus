// src/lib/pageBuilder/fields/activeSlideField.js
"use client";

import { withLabel } from "./withLabel";

// A small navigation helper that lives in Puck's field sidebar rather
// than on the canvas — since the canvas is covered by Puck's own
// selection/drag overlay, buttons rendered *inside* a widget's canvas
// output can get intercepted by that overlay. Fields in the sidebar are
// outside that overlay, so these buttons stay reliably clickable.
// Storing a plain incrementing/decrementing number; CarouselShell wraps
// it with the same modulo logic goTo() already uses, so it doesn't need
// to know the slide count here.
export function activeSlideField(label = "Active Slide (editing helper)") {
  return {
    type: "custom",
    label,
    render: withLabel(function ActiveSlideInput({ value, onChange }) {
      const current = typeof value === "number" ? value : 0;

      return (
        <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-md p-2 bg-gray-50/60">
          <button
            type="button"
            onClick={() => onChange(current - 1)}
            className="w-8 h-8 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center"
            title="Previous slide"
          >
            <i className="ti ti-chevron-left text-sm" />
          </button>
          <span className="text-xs text-gray-500">Slide {current + 1}</span>
          <button
            type="button"
            onClick={() => onChange(current + 1)}
            className="w-8 h-8 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center"
            title="Next slide"
          >
            <i className="ti ti-chevron-right text-sm" />
          </button>
        </div>
      );
    }),
  };
}
