// src/app/admin/site-theme/SiteThemeForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FONT_TOKENS,
  FONT_OPTIONS,
} from "@/lib/pageBuilder/theme/ThemeColorsContext";
import { useGoogleFont } from "@/lib/pageBuilder/theme/useGoogleFont";

const COLOR_TOKENS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
];

function FontRow({ token, value, onChange }) {
  const isKnown = FONT_OPTIONS.includes(value);
  const [customMode, setCustomMode] = useState(!isKnown);
  useGoogleFont(value);

  return (
    <div className="flex items-start gap-3">
      <label className="w-24 text-sm text-gray-700 pt-1.5">{token.label}</label>
      <div className="flex-1 space-y-1">
        <select
          value={customMode ? "__custom__" : value}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setCustomMode(true);
            } else {
              setCustomMode(false);
              onChange(e.target.value);
            }
          }}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
          <option value="__custom__">
            Custom (type a Google Font name)...
          </option>
        </select>
        {customMode && (
          <input
            type="text"
            placeholder="e.g. Bebas Neue"
            defaultValue={!isKnown ? value || "" : ""}
            onBlur={(e) => onChange(e.target.value.trim())}
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
          />
        )}
      </div>
      <span
        className="text-sm text-gray-500 w-24 shrink-0 truncate text-right pt-1.5"
        style={{ fontFamily: `'${value}', sans-serif` }}
      >
        Aa Preview
      </span>
    </div>
  );
}

export default function SiteThemeForm({ initialColors, initialFonts }) {
  const router = useRouter();
  const [colors, setColors] = useState(initialColors);
  const [fonts, setFonts] = useState(initialFonts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedOk(false);
    try {
      const res = await fetch("/api/site-theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors, fonts }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          `Save failed (${res.status}): ${body.error || "Unknown error"}`,
        );
      } else {
        setSavedOk(true);
        router.refresh();
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Colors
        </h2>
        {COLOR_TOKENS.map((t) => (
          <div key={t.key} className="flex items-center gap-3">
            <label className="w-24 text-sm text-gray-700">{t.label}</label>
            <input
              type="color"
              value={colors[t.key] || "#000000"}
              onChange={(e) =>
                setColors({ ...colors, [t.key]: e.target.value })
              }
              className="w-9 h-9 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={colors[t.key] || ""}
              onChange={(e) =>
                setColors({ ...colors, [t.key]: e.target.value })
              }
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm w-28"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Fonts
        </h2>
        {FONT_TOKENS.map((t) => (
          <FontRow
            key={t.key}
            token={t}
            value={fonts[t.key] || FONT_OPTIONS[0]}
            onChange={(val) => setFonts({ ...fonts, [t.key]: val })}
          />
        ))}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {savedOk && !error && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Saved successfully.
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}
