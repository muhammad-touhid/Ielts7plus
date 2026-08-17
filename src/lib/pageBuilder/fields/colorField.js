// src/lib/pageBuilder/fields/colorField.js
"use client";

import { useState, useRef } from "react";
import { withLabel } from "./withLabel";
import { useThemeColors } from "../theme/ThemeColorsContext";

export function hexToRgba(hex, opacityPercent) {
  if (!hex) return "transparent";
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.substring(0, 2), 16) || 0;
  const g = parseInt(full.substring(2, 4), 16) || 0;
  const b = parseInt(full.substring(4, 6), 16) || 0;
  const a = Math.max(0, Math.min(100, opacityPercent ?? 100)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Resolves a colorField value to an actual CSS color string. Widgets
// should call this (with themeColors from useThemeColors()) instead of
// using the raw field value directly, so theme tokens stay live.
export function resolveColor(value, themeColors) {
  if (!value) return "transparent";
  if (typeof value === "string") return value; // legacy plain-hex pages
  if (value.type === "theme") return themeColors?.[value.token] || "#000000";
  if (value.type === "custom") return value.value || "#000000";
  return "transparent";
}

// `extraPresets`: optional fixed hex swatches shown alongside the theme
// tokens (e.g. brand blue-100 for text on a gradient). Selecting a theme
// token stores a live reference; selecting a preset or typing a custom
// hex stores a fixed value.
export function colorField(label, extraPresets = []) {
  return {
    type: "custom",
    label,
    render: withLabel(function ColorInput({ value, onChange }) {
      const { themeColors, tokens, refetch } = useThemeColors();
      const [open, setOpen] = useState(false);
      const [forceCustom, setForceCustom] = useState(false);
      const wrapperRef = useRef(null);

      const normalized =
        value && typeof value === "object"
          ? value
          : value
            ? { type: "custom", value }
            : { type: "theme", token: tokens[0]?.key || "primary" };

      const isTheme = normalized.type === "theme";
      const isPreset =
        normalized.type === "custom" &&
        extraPresets.some((p) => p.value === normalized.value);
      const showCustomInputs =
        forceCustom || (normalized.type === "custom" && !isPreset);
      const preview = resolveColor(normalized, themeColors);

      function selectTheme(token) {
        setForceCustom(false);
        onChange({ type: "theme", token });
        setOpen(false);
      }
      function selectPreset(hex) {
        setForceCustom(false);
        onChange({ type: "custom", value: hex });
        setOpen(false);
      }
      function selectCustom() {
        setForceCustom(true);
        onChange({
          type: "custom",
          value: normalized.type === "custom" ? normalized.value : "#000000",
        });
        setOpen(false);
      }

      function currentLabel() {
        if (isTheme)
          return (
            tokens.find((t) => t.key === normalized.token)?.label ||
            normalized.token
          );
        if (isPreset)
          return (
            extraPresets.find((p) => p.value === normalized.value)?.label ||
            normalized.value
          );
        return "Custom";
      }

      return (
        <div className="space-y-1" ref={wrapperRef}>
          <div className="flex items-center gap-1">
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                onBlur={() => setTimeout(() => setOpen(false), 120)}
                className="w-full flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1.5 text-sm bg-white text-left"
              >
                <span
                  className="w-4 h-4 rounded border border-gray-300 shrink-0"
                  style={{ background: preview }}
                />
                <span className="truncate">{currentLabel()}</span>
              </button>

              {open && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                  <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase">
                    Theme
                  </div>
                  {tokens.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onMouseDown={() => selectTheme(t.key)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 text-left"
                    >
                      <span
                        className="w-4 h-4 rounded border border-gray-300 shrink-0"
                        style={{ background: themeColors?.[t.key] || "#000" }}
                      />
                      {t.label}
                    </button>
                  ))}

                  {extraPresets.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase">
                        Presets
                      </div>
                      {extraPresets.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onMouseDown={() => selectPreset(p.value)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 text-left"
                        >
                          <span
                            className="w-4 h-4 rounded border border-gray-300 shrink-0"
                            style={{ background: p.value }}
                          />
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}

                  <div className="border-t border-gray-100">
                    <button
                      type="button"
                      onMouseDown={selectCustom}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 text-left"
                    >
                      <span className="w-4 h-4 rounded border border-dashed border-gray-400 shrink-0" />
                      Custom...
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              title="Refresh theme colors"
              onClick={() => refetch?.()}
              className="text-gray-400 hover:text-gray-600 text-xs border border-gray-300 rounded px-1.5 py-1.5"
            >
              ↻
            </button>
          </div>

          {showCustomInputs && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(normalized.value)
                    ? normalized.value
                    : "#000000"
                }
                onChange={(e) =>
                  onChange({ type: "custom", value: e.target.value })
                }
                className="w-[20%] border border-gray-300 rounded cursor-pointer shrink-0"
              />
              <input
                type="text"
                placeholder="#2563eb"
                defaultValue={
                  normalized.type === "custom" ? normalized.value || "" : ""
                }
                onBlur={(e) =>
                  onChange({ type: "custom", value: e.target.value })
                }
                className="w-[80%] border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
            </div>
          )}
        </div>
      );
    }),
  };
}
