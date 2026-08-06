// src/lib/pageBuilder/fields/cornerBoxField.js
"use client";

import { usePuck } from "@measured/puck";
import { withLabel } from "./withLabel";
import { getActiveDevice, DEVICE_LABELS } from "./breakpoints";

// Same pattern as spacingBoxField, for border-radius corners instead of
// padding/margin sides. Value shape:
//   {
//     topLeft:     { desktop: "8px" },
//     topRight:    { desktop: "8px" },
//     bottomRight: { desktop: "8px" },
//     bottomLeft:  { desktop: "8px" },
//     linked: true
//   }

function readCorner(obj, corner, device) {
  const v = obj?.[corner]?.[device];
  return v !== undefined && v !== null ? v : "";
}

function writeAllCorners(obj, device, val) {
  let next = { ...obj };
  ["topLeft", "topRight", "bottomRight", "bottomLeft"].forEach((corner) => {
    next = { ...next, [corner]: { ...(next[corner] || {}), [device]: val } };
  });
  return next;
}

function writeCorner(obj, corner, device, val) {
  return { ...obj, [corner]: { ...(obj[corner] || {}), [device]: val } };
}

export function cornerBoxField(label) {
  return {
    type: "custom",
    label,
    render: withLabel(function CornerBox({ value, onChange }) {
      const { appState } = usePuck();
      const width = appState?.ui?.viewports?.current?.width ?? 1440;
      const device = getActiveDevice(width);
      const isDesktop = device === "desktop";

      const obj =
        value && typeof value === "object"
          ? value
          : { topLeft: {}, topRight: {}, bottomRight: {}, bottomLeft: {}, linked: true };
      const linked = !!obj.linked;

      function handleBlur(corner, e) {
        const val = e.target.value.trim();
        const next = linked ? writeAllCorners(obj, device, val) : writeCorner(obj, corner, device, val);
        onChange(next);
      }

      function toggleLink() {
        onChange({ ...obj, linked: !linked });
      }

      const cell = "w-full border border-gray-300 rounded px-1 py-1 text-xs text-center bg-white";

      return (
        <div className="border border-gray-200 rounded-md p-2 bg-gray-50/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              {DEVICE_LABELS[device]}
            </span>
            <button
              type="button"
              onClick={toggleLink}
              title={linked ? "Corners linked — click to unlink" : "Corners unlinked — click to link"}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                linked ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {linked ? "🔗 Linked" : "⛓️‍💥 Unlinked"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            <input
              className={`${cell} rounded-tl-lg`}
              placeholder="⌐"
              title="Top Left"
              defaultValue={readCorner(obj, "topLeft", device)}
              onBlur={(e) => handleBlur("topLeft", e)}
              key={`tl-${device}`}
            />
            <input
              className={`${cell} rounded-tr-lg`}
              placeholder="¬"
              title="Top Right"
              defaultValue={readCorner(obj, "topRight", device)}
              onBlur={(e) => handleBlur("topRight", e)}
              key={`tr-${device}`}
            />
            <input
              className={`${cell} rounded-bl-lg`}
              placeholder="L"
              title="Bottom Left"
              defaultValue={readCorner(obj, "bottomLeft", device)}
              onBlur={(e) => handleBlur("bottomLeft", e)}
              key={`bl-${device}`}
            />
            <input
              className={`${cell} rounded-br-lg`}
              placeholder="⌐"
              title="Bottom Right"
              defaultValue={readCorner(obj, "bottomRight", device)}
              onBlur={(e) => handleBlur("bottomRight", e)}
              key={`br-${device}`}
            />
          </div>

          {!isDesktop && (
            <div className="text-[10px] text-gray-400 italic mt-1">Blank = inherits a larger breakpoint</div>
          )}
        </div>
      );
    }),
  };
}

// Converts a cornerBoxField value into the 4 entries buildResponsiveCSS
// expects — real CSS logical corner property names.
export function cornerBoxToEntries(value) {
  if (!value) return [];
  return [
    { property: "border-top-left-radius", value: value.topLeft },
    { property: "border-top-right-radius", value: value.topRight },
    { property: "border-bottom-right-radius", value: value.bottomRight },
    { property: "border-bottom-left-radius", value: value.bottomLeft },
  ];
}
