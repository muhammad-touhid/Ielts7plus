// src/lib/pageBuilder/fields/flexibleSize.js
"use client";

import { useState } from "react";
import { withLabel } from "./withLabel";

// A reusable Puck custom field: a dropdown of preset values PLUS a
// "Custom..." option that reveals a free-text input for any CSS length
// (e.g. "24px", "2rem", "60vh", "10%"). Used everywhere spacing/height is
// configurable — Elementor-style "pick a size OR type your own".
//
// Usage: fields: { marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS) }
export function flexibleSizeField(label, presets) {
  return {
    type: "custom",
    label,
    render: withLabel(function FlexibleSizeInput({ value, onChange }) {
      const matched = presets.find((p) => p.value === value);
      const [forceCustom, setForceCustom] = useState(false);
      const showCustom = forceCustom || (!matched && value !== undefined && value !== "");

      return (
        <div className="space-y-1">
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            value={showCustom ? "__custom__" : value}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setForceCustom(true);
              } else {
                setForceCustom(false);
                onChange(e.target.value);
              }
            }}
          >
            {presets.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
            <option value="__custom__">Custom...</option>
          </select>
          {showCustom && (
            <input
              type="text"
              placeholder="e.g. 24px, 2rem, 60vh"
              defaultValue={value || ""}
              onBlur={(e) => onChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
          )}
        </div>
      );
    }),
  };
}

// Shared preset scales, reused across widgets so values stay consistent
// whether you're setting an element's margin or a Section's padding.
export const SPACING_PRESETS = [
  { label: "None", value: "0px" },
  { label: "Small (8px)", value: "8px" },
  { label: "Medium (16px)", value: "16px" },
  { label: "Large (32px)", value: "32px" },
  { label: "X-Large (64px)", value: "64px" },
];

export const SECTION_PADDING_PRESETS = [
  { label: "None", value: "0px" },
  { label: "Small (32px)", value: "32px" },
  { label: "Medium (64px)", value: "64px" },
  { label: "Large (96px)", value: "96px" },
  { label: "X-Large (128px)", value: "128px" },
];

export const HEIGHT_PRESETS = [
  { label: "Auto (fits content)", value: "auto" },
  { label: "Half screen (50vh)", value: "50vh" },
  { label: "Three-quarter screen (75vh)", value: "75vh" },
  { label: "Full screen (100vh)", value: "100vh" },
];

export const BLOCK_HEIGHT_PRESETS = [
  { label: "Auto", value: "auto" },
  { label: "Small (200px)", value: "200px" },
  { label: "Medium (400px)", value: "400px" },
  { label: "Large (600px)", value: "600px" },
];

export const GAP_PRESETS = [
  { label: "None", value: "0px" },
  { label: "Small (16px)", value: "16px" },
  { label: "Medium (32px)", value: "32px" },
  { label: "Large (48px)", value: "48px" },
];

export const MAX_WIDTH_PRESETS = [
  { label: "None (fills column)", value: "none" },
  { label: "Narrow (28rem / ~448px)", value: "28rem" },
  { label: "Medium (42rem / ~672px)", value: "42rem" },
  { label: "Wide (56rem / ~896px)", value: "56rem" },
  { label: "X-Wide (72rem / ~1152px)", value: "72rem" },
];

// For Section's overall content width. Same idea as MAX_WIDTH_PRESETS but
// with wider defaults suited to a whole section's content box rather than
// a single text block, plus a "Full width" option (maxWidth: none).
export const CONTENT_WIDTH_PRESETS = [
  { label: "Boxed — narrow (48rem / ~768px)", value: "48rem" },
  { label: "Boxed — medium (64rem / ~1024px)", value: "64rem" },
  { label: "Boxed — wide (72rem / ~1152px)", value: "72rem" },
  { label: "Full width", value: "none" },
];
