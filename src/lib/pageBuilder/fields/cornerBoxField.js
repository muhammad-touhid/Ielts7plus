// src/lib/pageBuilder/fields/cornerBoxField.js
"use client";

import { usePuck } from "@measured/puck";
import { withLabel } from "./withLabel";
import { getActiveDevice, DEVICE_LABELS } from "./breakpoints";

const UNITS = ["px", "rem", "%"];

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
          : {
              topLeft: {},
              topRight: {},
              bottomRight: {},
              bottomLeft: {},
              linked: true,
              unit: "px",
            };
      const linked = !!obj.linked;
      const unit = obj.unit || "px";

      function handleInput(corner, e) {
        const val = e.target.value;
        const next = linked
          ? writeAllCorners(obj, device, val)
          : writeCorner(obj, corner, device, val);
        onChange(next);
      }

      function handleKeyDown(corner, e) {
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        const current = parseFloat(readCorner(obj, corner, device)) || 0;
        const step = e.shiftKey ? 10 : 1;
        const nextVal = current + (e.key === "ArrowUp" ? step : -step);
        const next = linked
          ? writeAllCorners(obj, device, String(nextVal))
          : writeCorner(obj, corner, device, String(nextVal));
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
                    ? "Corners linked — click to unlink"
                    : "Corners unlinked — click to link"
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

          <div className="grid grid-cols-2 gap-1">
            <input
              className={`${cell} rounded-tl-lg`}
              placeholder="⌐"
              title="Top Left"
              value={readCorner(obj, "topLeft", device)}
              onChange={(e) => handleInput("topLeft", e)}
              onKeyDown={(e) => handleKeyDown("topLeft", e)}
              key={`tl-${device}`}
            />
            <input
              className={`${cell} rounded-tr-lg`}
              placeholder="¬"
              title="Top Right"
              value={readCorner(obj, "topRight", device)}
              onChange={(e) => handleInput("topRight", e)}
              onKeyDown={(e) => handleKeyDown("topRight", e)}
              key={`tr-${device}`}
            />
            <input
              className={`${cell} rounded-bl-lg`}
              placeholder="L"
              title="Bottom Left"
              value={readCorner(obj, "bottomLeft", device)}
              onChange={(e) => handleInput("bottomLeft", e)}
              onKeyDown={(e) => handleKeyDown("bottomLeft", e)}
              key={`bl-${device}`}
            />
            <input
              className={`${cell} rounded-br-lg`}
              placeholder="⌐"
              title="Bottom Right"
              value={readCorner(obj, "bottomRight", device)}
              onChange={(e) => handleInput("bottomRight", e)}
              onKeyDown={(e) => handleKeyDown("bottomRight", e)}
              key={`br-${device}`}
            />
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

export function cornerBoxToEntries(value) {
  if (!value) return [];
  const unit = value.unit || "px";
  return [
    {
      property: "border-top-left-radius",
      value: withUnit(value.topLeft, unit),
    },
    {
      property: "border-top-right-radius",
      value: withUnit(value.topRight, unit),
    },
    {
      property: "border-bottom-right-radius",
      value: withUnit(value.bottomRight, unit),
    },
    {
      property: "border-bottom-left-radius",
      value: withUnit(value.bottomLeft, unit),
    },
  ];
}
