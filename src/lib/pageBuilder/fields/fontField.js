// src/lib/pageBuilder/fields/fontField.js
"use client";

import { useState } from "react";
import { withLabel } from "./withLabel";
import { useThemeColors } from "../theme/ThemeColorsContext";
import { useGoogleFont } from "../theme/useGoogleFont";

export function resolveFont(value, themeFonts) {
  if (!value) return undefined;
  if (typeof value === "string") return value; // legacy plain font name
  if (value.type === "theme") return themeFonts?.[value.token];
  if (value.type === "custom") return value.value;
  return undefined;
}

export function fontField(label, defaultToken = "paragraph") {
  return {
    type: "custom",
    label,
    render: withLabel(function FontInput({ value, onChange }) {
      const { themeFonts, fontTokens, fontOptions } = useThemeColors();
      const [forceCustom, setForceCustom] = useState(false);

      const normalized =
        value && typeof value === "object"
          ? value
          : value
            ? { type: "custom", value }
            : { type: "theme", token: defaultToken };

      const isKnownCustom =
        normalized.type === "custom" && fontOptions.includes(normalized.value);
      const showCustomInput =
        forceCustom || (normalized.type === "custom" && !isKnownCustom);

      const selectValue = showCustomInput
        ? "__custom__"
        : normalized.type === "theme"
          ? `theme:${normalized.token}`
          : `custom:${normalized.value}`;

      const preview = resolveFont(normalized, themeFonts) || "inherit";
      useGoogleFont(showCustomInput ? normalized.value : preview);

      function handleSelectChange(e) {
        const v = e.target.value;
        if (v === "__custom__") {
          setForceCustom(true);
          onChange({
            type: "custom",
            value: normalized.type === "custom" ? normalized.value : "",
          });
          return;
        }
        setForceCustom(false);
        const [kind, val] = v.split(":");
        if (kind === "theme") onChange({ type: "theme", token: val });
        else onChange({ type: "custom", value: val });
      }

      return (
        <div className="space-y-1">
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            value={selectValue}
            onChange={handleSelectChange}
          >
            <optgroup label="Theme">
              {fontTokens.map((t) => (
                <option key={t.key} value={`theme:${t.key}`}>
                  {t.label} ({themeFonts?.[t.key] || "default"})
                </option>
              ))}
            </optgroup>
            <optgroup label="Fonts">
              {fontOptions.map((f) => (
                <option key={f} value={`custom:${f}`}>
                  {f}
                </option>
              ))}
            </optgroup>
            <option value="__custom__">
              Custom (type a Google Font name)...
            </option>
          </select>

          {showCustomInput && (
            <input
              type="text"
              placeholder="e.g. Bebas Neue"
              defaultValue={
                normalized.type === "custom" && !isKnownCustom
                  ? normalized.value || ""
                  : ""
              }
              onBlur={(e) =>
                onChange({ type: "custom", value: e.target.value.trim() })
              }
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
          )}

          <div
            className="border border-gray-200 rounded px-2 py-1.5 text-sm text-gray-600 bg-gray-50"
            style={{ fontFamily: `'${preview}', sans-serif` }}
          >
            Aa — The quick brown fox
          </div>
        </div>
      );
    }),
  };
}
