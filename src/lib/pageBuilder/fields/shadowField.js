// src/lib/pageBuilder/fields/shadowField.js
"use client";

import { useState } from "react";
import { withLabel } from "./withLabel";

// Matches Tailwind's real shadow scale exactly, so "Soft"/"Medium"/
// "Strong" here render identically to Tailwind's shadow-sm/shadow-md/
// shadow-lg utility classes — kept as inline CSS strings (not the
// Tailwind classes themselves) since these values are injected via
// ResponsiveStyle's dynamically-generated <style> tags, which Tailwind's
// JIT scanner never sees (same reasoning as every other dynamic-value
// field in this project). Keep in sync with the identical copy in
// hoverField.js (hoverShadowField) — two separate files, same values.
const SHADOW_PRESETS = {
  soft: "0 1px 2px 0 rgb(0 0 0 / 0.05)", // = Tailwind shadow-sm
  medium:
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // = Tailwind shadow-md
  strong:
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // = Tailwind shadow-lg
};

const SHADOW_PRESET_OPTIONS = [
  { label: "None", value: "" },
  { label: "Soft (shadow-sm)", value: "soft" },
  { label: "Medium (shadow-md)", value: "medium" },
  { label: "Strong (shadow-lg)", value: "strong" },
];

export function shadowField(label = "Box Shadow") {
  return {
    type: "custom",
    label,
    render: withLabel(function ShadowInput({ value, onChange }) {
      const isCustom =
        value && typeof value === "object" && value.type === "custom";
      const [forceCustom, setForceCustom] = useState(isCustom);
      const selectValue = forceCustom
        ? "__custom__"
        : typeof value === "string"
          ? value
          : "";

      return (
        <div className="space-y-1">
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            value={selectValue}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setForceCustom(true);
                onChange({
                  type: "custom",
                  value: isCustom ? value.value : "",
                });
              } else {
                setForceCustom(false);
                onChange(e.target.value);
              }
            }}
          >
            {SHADOW_PRESET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
            <option value="__custom__">Custom...</option>
          </select>
          {forceCustom && (
            <input
              type="text"
              placeholder="0 12px 28px rgba(0,0,0,0.15)"
              defaultValue={isCustom ? value.value || "" : ""}
              onBlur={(e) =>
                onChange({ type: "custom", value: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm font-mono"
            />
          )}
        </div>
      );
    }),
  };
}

export function shadowDefaultProps() {
  return { shadow: "" };
}

// Resolves a shadowField value to a real CSS box-shadow string (or "").
export function resolveShadow(value) {
  if (!value) return "";
  if (typeof value === "string" && SHADOW_PRESETS[value])
    return SHADOW_PRESETS[value];
  if (typeof value === "object" && value.type === "custom")
    return value.value || "";
  return "";
}