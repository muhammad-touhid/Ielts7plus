// src/lib/pageBuilder/fields/responsiveField.js
"use client";

import { useRef, useState } from "react";
import { usePuck } from "@measured/puck";
import { withLabel } from "./withLabel";
import { getActiveDevice, DEVICE_LABELS } from "./breakpoints";

function resolveInherited(obj, device) {
  const order = ["mobile", "tablet", "laptop", "desktop"];
  let i = order.indexOf(device) + 1;
  while (i < order.length) {
    if (obj[order[i]]) return { value: obj[order[i]], from: order[i] };
    i++;
  }
  return { value: obj.desktop, from: "desktop" };
}

// The Elementor-style piece: this field reads Puck's CURRENTLY SELECTED
// viewport (via usePuck — Puck exposes appState.ui.viewports.current.width,
// which changes when you click the Mobile/Tablet/Laptop/Desktop icons in
// Puck's own header) and shows/edits ONLY that device's value. Click a
// different device icon in Puck's header and this field automatically
// switches to editing that device — no separate switcher needed here.
//
// Value shape: { desktop: "64px", laptop: "48px", tablet: null, mobile: "24px" }
// Desktop is always required (the base). The others are optional
// overrides — leave them unset and that device just inherits the next
// larger breakpoint's value.
export function responsiveField(label, presets) {
  return {
    type: "custom",
    label,
    render: withLabel(function ResponsiveInput({ value, onChange }) {
      const { appState } = usePuck();
      const width = appState?.ui?.viewports?.current?.width ?? 1440;
      const device = getActiveDevice(width);

      const obj = value && typeof value === "object" ? value : { desktop: value || presets[0].value };
      const isDesktop = device === "desktop";
      const rawCurrent = obj[device];
      const hasOverride = isDesktop || (rawCurrent !== undefined && rawCurrent !== null && rawCurrent !== "");
      const matched = presets.find((p) => p.value === rawCurrent);

      // Tracks "the person explicitly picked Custom... from the dropdown"
      // separately from "the current value happens to match a preset" —
      // without this, selecting Custom (which doesn't change the value by
      // itself) would immediately snap back to showing the dropdown,
      // since a still-matching value makes the custom input disappear.
      // Reset whenever the active device changes (render-phase state
      // adjustment — safe because it's guarded by the ref comparison).
      const [forceCustom, setForceCustom] = useState(false);
      const prevDeviceRef = useRef(device);
      if (prevDeviceRef.current !== device) {
        prevDeviceRef.current = device;
        if (forceCustom) setForceCustom(false);
      }

      const showCustomInput = hasOverride && (forceCustom || !matched);

      function setValue(v) {
        onChange({ ...obj, [device]: v });
      }
      function clearOverride() {
        const next = { ...obj };
        delete next[device];
        onChange(next);
        setForceCustom(false);
      }

      const inherited = !isDesktop && !hasOverride ? resolveInherited(obj, device) : null;

      return (
        <div className="space-y-1.5 border border-gray-100 rounded-md p-2 bg-gray-50/60">
          <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
            Editing: {DEVICE_LABELS[device]}
          </div>

          {!isDesktop && (
            <label className="flex items-center gap-1.5 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={hasOverride}
                onChange={(e) => (e.target.checked ? setValue(presets[0].value) : clearOverride())}
              />
              Override for {DEVICE_LABELS[device]}
            </label>
          )}

          {hasOverride && (
            <>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white"
                value={showCustomInput ? "__custom__" : rawCurrent}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setForceCustom(true);
                  } else {
                    setForceCustom(false);
                    setValue(e.target.value);
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
              {showCustomInput && (
                <input
                  type="text"
                  placeholder="e.g. 24px, 2rem, 60vh"
                  defaultValue={!matched ? rawCurrent || "" : ""}
                  onBlur={(e) => setValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white"
                />
              )}
            </>
          )}

          {inherited && (
            <div className="text-[11px] text-gray-400 italic">
              Inheriting {inherited.from}: {inherited.value}
            </div>
          )}
        </div>
      );
    }),
  };
}
