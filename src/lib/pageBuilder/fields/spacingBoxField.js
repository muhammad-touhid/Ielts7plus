// src/lib/pageBuilder/fields/spacingBoxField.js
"use client";

import { usePuck } from "@measured/puck";
import { withLabel } from "./withLabel";
import { getActiveDevice, DEVICE_LABELS } from "./breakpoints";

const UNITS = ["px", "rem", "%"];

// Value shape:
//   {
//     top:    { desktop: "64", mobile: "32" },
//     right:  { desktop: "24" },
//     bottom: { desktop: "64" },
//     left:   { desktop: "24" },
//     linked: false,
//     unit: "px"
//   }
// Sides store plain numbers (no unit baked in) — `unit` is a single
// box-wide setting, converted to real CSS values in spacingBoxToEntries.

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
          : {
              top: {},
              right: {},
              bottom: {},
              left: {},
              linked: false,
              unit: "px",
            };
      const linked = !!obj.linked;
      const unit = obj.unit || "px";

      // Controlled — fires on every keystroke, so the canvas updates
      // live instead of waiting for blur. This also fixes the old
      // linked-toggle sync bug as a side effect: a controlled input
      // always reflects the current value, no remount trick needed.
      function handleInput(side, e) {
        const val = e.target.value;
        const next = linked
          ? writeAllSides(obj, device, val)
          : writeSide(obj, side, device, val);
        onChange(next);
      }

      function handleKeyDown(side, e) {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        const current = parseFloat(readSide(obj, side, device)) || 0;
        const step = e.shiftKey ? 10 : 1;
        const nextVal = current + (e.key === "ArrowUp" ? step : -step);
        const next = linked
          ? writeAllSides(obj, device, String(nextVal))
          : writeSide(obj, side, device, String(nextVal));
        onChange(next);
      }

      function toggleLink(e) {
        e.stopPropagation();
        onChange({ ...obj, linked: !linked });
      }

      function handleUnitChange(e) {
        onChange({ ...obj, unit: e.target.value });
      }

      const cell =
        "w-full border border-gray-300 rounded px-1 py-1 text-xs text-center bg-white";

      return (
        <div className="border border-gray-200 rounded-md p-2 bg-gray-50/60">
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
              {DEVICE_LABELS[device]}
            </span>
            <div className="flex items-center gap-1">
              <select
                value={unit}
                onChange={handleUnitChange}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] border border-gray-300 rounded px-1 py-0.5 bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={toggleLink}
                title={
                  linked
                    ? "Sides linked — click to unlink"
                    : "Sides unlinked — click to link"
                }
                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  linked
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {linked ? "🔗 Linked" : "⛓️‍💥 Unlinked"}
              </button>
            </div>
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
                value={readSide(obj, "top", device)}
                onChange={(e) => handleInput("top", e)}
                onKeyDown={(e) => handleKeyDown("top", e)}
                key={`top-${device}`}
              />
            </div>
            <div style={{ gridArea: "left" }}>
              <input
                className={cell}
                placeholder="Left"
                value={readSide(obj, "left", device)}
                onChange={(e) => handleInput("left", e)}
                onKeyDown={(e) => handleKeyDown("left", e)}
                key={`left-${device}`}
              />
            </div>
            <div
              style={{ gridArea: "mid" }}
              className="text-center text-gray-300 text-base select-none"
            >
              ▦
            </div>
            <div style={{ gridArea: "right" }}>
              <input
                className={cell}
                placeholder="Right"
                value={readSide(obj, "right", device)}
                onChange={(e) => handleInput("right", e)}
                onKeyDown={(e) => handleKeyDown("right", e)}
                key={`right-${device}`}
              />
            </div>
            <div style={{ gridArea: "bottom" }}>
              <input
                className={cell}
                placeholder="Bottom"
                value={readSide(obj, "bottom", device)}
                onChange={(e) => handleInput("bottom", e)}
                onKeyDown={(e) => handleKeyDown("bottom", e)}
                key={`bottom-${device}`}
              />
            </div>
          </div>

          {!isDesktop && (
            <div className="text-[10px] text-gray-400 italic mt-1">
              Blank = inherits a larger breakpoint
            </div>
          )}
        </div>
      );
    }),
  };
}

function withUnit(perDeviceObj, unit) {
  if (!perDeviceObj) return perDeviceObj;
  const out = {};
  Object.entries(perDeviceObj).forEach(([device, val]) => {
    if (val === "" || val === undefined || val === null) return;
    const isNumeric = /^-?\d+(\.\d+)?$/.test(String(val).trim());
    out[device] = isNumeric ? `${val}${unit}` : val;
  });
  return out;
}

export function spacingBoxToEntries(prefix, value) {
  if (!value) return [];
  const unit = value.unit || "px";
  return [
    { property: `${prefix}-top`, value: withUnit(value.top, unit) },
    { property: `${prefix}-right`, value: withUnit(value.right, unit) },
    { property: `${prefix}-bottom`, value: withUnit(value.bottom, unit) },
    { property: `${prefix}-left`, value: withUnit(value.left, unit) },
  ];
}
