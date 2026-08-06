// src/lib/pageBuilder/fields/hoverField.js
"use client";

import { useState } from "react";
import { colorField, resolveColor } from "./colorField";
import { withLabel } from "./withLabel";

const SHADOW_PRESETS = {
  soft: "0 8px 20px rgba(0,0,0,0.10)",
  medium: "0 12px 28px rgba(0,0,0,0.15)",
  strong: "0 20px 45px rgba(0,0,0,0.25)",
};

const SHADOW_PRESET_OPTIONS = [
  { label: "None", value: "" },
  { label: "Soft", value: "soft" },
  { label: "Medium", value: "medium" },
  { label: "Strong", value: "strong" },
];

function hoverShadowField() {
  return {
    type: "custom",
    label: "Hover Shadow",
    render: withLabel(function ShadowInput({ value, onChange }) {
      const isCustom =
        value && typeof value === "object" && value.type === "custom";
      const [forceCustom, setForceCustom] = useState(isCustom);
      const selectValue = forceCustom
        ? "__custom__"
        : typeof value === "string"
          ? value
          : "";

      return (
        <div className="space-y-1">
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            value={selectValue}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setForceCustom(true);
                onChange({
                  type: "custom",
                  value: isCustom ? value.value : "",
                });
              } else {
                setForceCustom(false);
                onChange(e.target.value);
              }
            }}
          >
            {SHADOW_PRESET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
            <option value="__custom__">Custom...</option>
          </select>
          {forceCustom && (
            <input
              type="text"
              placeholder="0 12px 28px rgba(0,0,0,0.15)"
              defaultValue={isCustom ? value.value || "" : ""}
              onBlur={(e) =>
                onChange({ type: "custom", value: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm font-mono"
            />
          )}
        </div>
      );
    }),
  };
}

export function hoverFieldSet() {
  return {
    hoverEnabled: {
      type: "radio",
      label: "Hover Effect",
      options: [
        { label: "Off", value: false },
        { label: "On", value: true },
      ],
    },
    hoverBgColor: colorField("Hover Background"),
    hoverTextColor: colorField("Hover Text Color"),
    hoverBorderColor: colorField("Hover Border Color"),
    hoverOpacity: {
      type: "number",
      label: "Hover Opacity (0–1, blank = no change)",
    },
    hoverScale: {
      type: "number",
      label: "Hover Scale (e.g. 1.05 grow, 0.95 shrink)",
    },
    hoverTranslateX: {
      type: "number",
      label: "Hover Move X (px, negative = left)",
    },
    hoverTranslateY: {
      type: "number",
      label: "Hover Move Y (px, negative = up)",
    },
    hoverRotate: { type: "number", label: "Hover Rotate (deg)" },
    hoverShadow: hoverShadowField(),
    hoverGrayscaleToColor: {
      type: "radio",
      label: "Grayscale → Color on Hover",
      options: [
        { label: "Off", value: false },
        { label: "On", value: true },
      ],
    },
    hoverTransitionMs: { type: "number", label: "Transition Speed (ms)" },
  };
}

export function hoverDefaultProps() {
  return {
    hoverEnabled: false,
    hoverBgColor: null,
    hoverTextColor: null,
    hoverBorderColor: null,
    hoverOpacity: "",
    hoverScale: "",
    hoverTranslateX: "",
    hoverTranslateY: "",
    hoverRotate: "",
    hoverShadow: "",
    hoverGrayscaleToColor: false,
    hoverTransitionMs: "200",
  };
}

function resolveShadow(value) {
  if (!value) return "";
  if (typeof value === "string" && SHADOW_PRESETS[value])
    return SHADOW_PRESETS[value];
  if (typeof value === "object" && value.type === "custom")
    return value.value || "";
  return "";
}

// Builds a complete, ready-to-render CSS string scoped to the widget's
// own class. Returns "" when hover is off or nothing is actually set.
export function buildHoverCss(scopedClass, props, themeColors) {
  if (!props?.hoverEnabled) return "";

  const hoverDecls = [];
  const transformParts = [];

  if (props.hoverBgColor)
    hoverDecls.push(
      `background-color: ${resolveColor(props.hoverBgColor, themeColors)} !important;`,
    );
  if (props.hoverTextColor)
    hoverDecls.push(
      `color: ${resolveColor(props.hoverTextColor, themeColors)} !important;`,
    );
  if (props.hoverBorderColor)
    hoverDecls.push(
      `border-color: ${resolveColor(props.hoverBorderColor, themeColors)} !important;`,
    );
  if (
    props.hoverOpacity !== "" &&
    props.hoverOpacity !== undefined &&
    props.hoverOpacity !== null
  ) {
    hoverDecls.push(`opacity: ${props.hoverOpacity};`);
  }
  if (props.hoverScale) transformParts.push(`scale(${props.hoverScale})`);
  if (props.hoverTranslateX)
    transformParts.push(`translateX(${props.hoverTranslateX}px)`);
  if (props.hoverTranslateY)
    transformParts.push(`translateY(${props.hoverTranslateY}px)`);
  if (props.hoverRotate) transformParts.push(`rotate(${props.hoverRotate}deg)`);
  if (transformParts.length)
    hoverDecls.push(`transform: ${transformParts.join(" ")};`);

  const shadowCss = resolveShadow(props.hoverShadow);
  if (shadowCss) hoverDecls.push(`box-shadow: ${shadowCss};`);

  if (hoverDecls.length === 0 && !props.hoverGrayscaleToColor) return "";

  const ms = props.hoverTransitionMs || "200";
  const baseFilter = props.hoverGrayscaleToColor ? "filter: grayscale(1);" : "";
  const hoverFilter = props.hoverGrayscaleToColor
    ? "filter: grayscale(0);"
    : "";

  return `
.${scopedClass} {
  transition: background-color ${ms}ms ease, color ${ms}ms ease, border-color ${ms}ms ease, transform ${ms}ms ease, box-shadow ${ms}ms ease, opacity ${ms}ms ease, filter ${ms}ms ease;
  ${baseFilter}
}
.${scopedClass}:hover {
  ${hoverDecls.join("\n  ")}
  ${hoverFilter}
}
`;
}
