// src/lib/pageBuilder/fields/colorField.js
"use client";

import { useState } from "react";
import { withLabel } from "./withLabel";

// Same preset+custom pattern as flexibleSizeField, but for colors — a
// dropdown of common presets plus a "Custom..." option with a real color
// picker + hex input, for whenever a design needs a color outside the
// fixed preset list (e.g. `#dbeafe` / blue-100 body text on a gradient
// background). Not responsive (single value, not per-device) — colors
// rarely need to change per breakpoint, unlike spacing/size.
export function colorField(label, presets) {
  return {
    type: "custom",
    label,
    render: withLabel(function ColorInput({ value, onChange }) {
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
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="w-9 h-9 border border-gray-300 rounded cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="#dbeafe"
                defaultValue={!matched ? value || "" : ""}
                onBlur={(e) => onChange(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
            </div>
          )}
        </div>
      );
    }),
  };
}
