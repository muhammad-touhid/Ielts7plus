// src/lib/pageBuilder/fields/spacingBoxField.js
"use client";

import { usePuck } from "@measured/puck";
import { withLabel } from "./withLabel";
import { getActiveDevice, DEVICE_LABELS } from "./breakpoints";

// Value shape:
//   {
//     top:    { desktop: "64px", mobile: "32px" },
//     right:  { desktop: "24px" },
//     bottom: { desktop: "64px" },
//     left:   { desktop: "24px" },
//     linked: false
//   }
// Each side is itself a responsive value (same per-device shape as
// responsiveField), and `linked` is a plain UI toggle (not per-device) —
// when on, typing into any one side sets all four at once, same as
// Elementor's chain-link icon.

function readSide(obj, side, device) {
  const v = obj?.[side]?.[device];
  return v !== undefined && v !== null ? v : "";
}

function writeAllSides(obj, device, val) {
  let next = { ...obj };
  ["top", "right", "bottom", "left"].forEach((side) => {
    next = { ...next, [side]: { ...(next[side] || {}), [device]: val } };
  });
  return next;
}

function writeSide(obj, side, device, val) {
  return { ...obj, [side]: { ...(obj[side] || {}), [device]: val } };
}

export function spacingBoxField(label) {
  return {
    type: "custom",
    label,
    render: withLabel(function SpacingBox({ value, onChange }) {
      const { appState } = usePuck();
      const width = appState?.ui?.viewports?.current?.width ?? 1440;
      const device = getActiveDevice(width);
      const isDesktop = device === "desktop";

      const obj =
        value && typeof value === "object"
          ? value
          : { top: {}, right: {}, bottom: {}, left: {}, linked: false };
      const linked = !!obj.linked;

      function handleBlur(side, e) {
        const val = e.target.value.trim();
        const next = linked ? writeAllSides(obj, device, val) : writeSide(obj, side, device, val);
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
              title={linked ? "Sides linked — click to unlink" : "Sides unlinked — click to link"}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                linked ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {linked ? "🔗 Linked" : "⛓️‍💥 Unlinked"}
            </button>
          </div>

          <div
            className="grid gap-1 items-center"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateAreas: '". top ." "left mid right" ". bottom ."',
            }}
          >
            <div style={{ gridArea: "top" }}>
              <input
                className={cell}
                placeholder="Top"
                defaultValue={readSide(obj, "top", device)}
                onBlur={(e) => handleBlur("top", e)}
                key={`top-${device}`}
              />
            </div>
            <div style={{ gridArea: "left" }}>
              <input
                className={cell}
                placeholder="Left"
                defaultValue={readSide(obj, "left", device)}
                onBlur={(e) => handleBlur("left", e)}
                key={`left-${device}`}
              />
            </div>
            <div style={{ gridArea: "mid" }} className="text-center text-gray-300 text-base select-none">
              ▦
            </div>
            <div style={{ gridArea: "right" }}>
              <input
                className={cell}
                placeholder="Right"
                defaultValue={readSide(obj, "right", device)}
                onBlur={(e) => handleBlur("right", e)}
                key={`right-${device}`}
              />
            </div>
            <div style={{ gridArea: "bottom" }}>
              <input
                className={cell}
                placeholder="Bottom"
                defaultValue={readSide(obj, "bottom", device)}
                onBlur={(e) => handleBlur("bottom", e)}
                key={`bottom-${device}`}
              />
            </div>
          </div>

          {!isDesktop && (
            <div className="text-[10px] text-gray-400 italic mt-1">Blank = inherits a larger breakpoint</div>
          )}
        </div>
      );
    }),
  };
}

// Converts a spacingBoxField value into the 4 entries buildResponsiveCSS
// expects, prefixed with whatever CSS property base you need
// ("padding" or "margin").
export function spacingBoxToEntries(prefix, value) {
  if (!value) return [];
  return [
    { property: `${prefix}-top`, value: value.top },
    { property: `${prefix}-right`, value: value.right },
    { property: `${prefix}-bottom`, value: value.bottom },
    { property: `${prefix}-left`, value: value.left },
  ];
}
