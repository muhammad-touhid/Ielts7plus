// src/lib/pageBuilder/fields/borderWidthBoxField.js
"use client";

import { withLabel } from "./withLabel";

const UNITS = ["px", "rem", "%"];

// Value shape:
//   { top: "1", right: "0", bottom: "1", left: "0", linked: false, unit: "px" }
// Sides store plain numbers (no unit baked in) — `unit` is a single
// box-wide setting, converted to real CSS values in borderWidthBoxToEntries.
// A side of "0" (or blank) means no border on that side — border-width: 0
// naturally suppresses the border regardless of style/color, so no extra
// on/off flag is needed.
//
// Unlike spacingBoxField, this has NO per-device layer — border width is
// deliberately desktop-only across this codebase (a border rarely needs
// to change between breakpoints).

// Handles both the new object shape AND the old flat string shape
// (e.g. "2px", "0px") that every widget saved before this feature
// existed. Existing saved widgets keep rendering identically: the old
// single value becomes the same number on all four linked sides.
export function normalizeBorderWidth(value) {
  if (value && typeof value === "object") {
    return {
      top: value.top ?? "0",
      right: value.right ?? "0",
      bottom: value.bottom ?? "0",
      left: value.left ?? "0",
      linked: value.linked !== undefined ? !!value.linked : true,
      unit: value.unit || "px",
    };
  }
  const legacy = typeof value === "string" ? value.trim() : "0px";
  const match = /^(-?\d*\.?\d+)\s*(px|rem|%)?$/.exec(legacy);
  const num = match ? match[1] : "0";
  const unit = (match && match[2]) || "px";
  return { top: num, right: num, bottom: num, left: num, linked: true, unit };
}

function readSide(obj, side) {
  const v = obj?.[side];
  return v !== undefined && v !== null ? v : "";
}

function writeAllSides(obj, val) {
  return { ...obj, top: val, right: val, bottom: val, left: val };
}

function writeSide(obj, side, val) {
  return { ...obj, [side]: val };
}

export function borderWidthBoxField(label) {
  return {
    type: "custom",
    label,
    render: withLabel(function BorderWidthBox({ value, onChange }) {
      const obj = normalizeBorderWidth(value);
      const linked = obj.linked;
      const unit = obj.unit;

      function handleInput(side, e) {
        const val = e.target.value;
        const next = linked
          ? writeAllSides(obj, val)
          : writeSide(obj, side, val);
        onChange(next);
      }

      function handleKeyDown(side, e) {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        const current = parseFloat(readSide(obj, side)) || 0;
        const step = e.shiftKey ? 10 : 1;
        const nextVal = current + (e.key === "ArrowUp" ? step : -step);
        const next = linked
          ? writeAllSides(obj, String(nextVal))
          : writeSide(obj, side, String(nextVal));
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
          <div className="flex items-center justify-end mb-1.5 gap-1">
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
                value={readSide(obj, "top")}
                onChange={(e) => handleInput("top", e)}
                onKeyDown={(e) => handleKeyDown("top", e)}
              />
            </div>
            <div style={{ gridArea: "left" }}>
              <input
                className={cell}
                placeholder="Left"
                value={readSide(obj, "left")}
                onChange={(e) => handleInput("left", e)}
                onKeyDown={(e) => handleKeyDown("left", e)}
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
                value={readSide(obj, "right")}
                onChange={(e) => handleInput("right", e)}
                onKeyDown={(e) => handleKeyDown("right", e)}
              />
            </div>
            <div style={{ gridArea: "bottom" }}>
              <input
                className={cell}
                placeholder="Bottom"
                value={readSide(obj, "bottom")}
                onChange={(e) => handleInput("bottom", e)}
                onKeyDown={(e) => handleKeyDown("bottom", e)}
              />
            </div>
          </div>
        </div>
      );
    }),
  };
}

function withUnit(val, unit) {
  if (val === "" || val === undefined || val === null) return "0px";
  const isNumeric = /^-?\d+(\.\d+)?$/.test(String(val).trim());
  return isNumeric ? `${val}${unit}` : val;
}

// A side value of 0 naturally renders no border on that side — no
// separate on/off flag needed, CSS handles it.
export function borderWidthBoxToEntries(value) {
  const obj = normalizeBorderWidth(value);
  const unit = obj.unit;
  return {
    top: withUnit(obj.top, unit),
    right: withUnit(obj.right, unit),
    bottom: withUnit(obj.bottom, unit),
    left: withUnit(obj.left, unit),
  };
}
