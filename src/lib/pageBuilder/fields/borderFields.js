"use client";

import { colorField, resolveColor } from "./colorField";
import { cornerBoxField, cornerBoxToEntries } from "./cornerBoxField";
import {
  borderWidthBoxField,
  borderWidthBoxToEntries,
} from "./borderWidthBoxField";

const BORDER_COLOR_PRESETS = [
  { label: "Light gray", value: "#e5e7eb" },
  { label: "Gray", value: "#9ca3af" },
  { label: "Dark", value: "#111827" },
  { label: "Brand blue", value: "#2563eb" },
  { label: "White", value: "#ffffff" },
];

// Module-level const field objects — NEVER rebuild these inside a widget's
// resolveFields. resolveFields runs on every keystroke, and calling a
// field-builder function there recreates the field object's identity,
// which makes Puck remount the input and drop focus after one character.
export const borderWidthField = borderWidthBoxField("Border Width");
export const borderStyleField = {
  type: "select",
  label: "Border Style",
  options: [
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
  ],
};
export const borderColorField = colorField(
  "Border Color",
  BORDER_COLOR_PRESETS,
);
export const borderRadiusField = cornerBoxField("Corner Radius");

// Spread into any widget's `fields` object for a consistent
// Elementor-style border + radius control set. Border width now uses a
// mini top/right/bottom/left box (like Padding/Margin) — a side set to
// 0 simply shows no border on that side, since border-width:0 is
// naturally invisible regardless of style/color. Style/color stay
// shared across all four sides. Border radius is per-device via
// cornerBoxField; border width/style/color are deliberately NOT
// per-device (a border rarely needs to change between breakpoints).
export function borderFieldSet() {
  return {
    borderWidth: borderWidthField,
    borderStyle: borderStyleField,
    borderColor: borderColorField,
    borderRadius: borderRadiusField,
  };
}

export function borderDefaultProps() {
  return {
    borderWidth: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
      linked: true,
      unit: "px",
    },
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: {
      topLeft: { desktop: "0px" },
      topRight: { desktop: "0px" },
      bottomRight: { desktop: "0px" },
      bottomLeft: { desktop: "0px" },
      linked: true,
    },
  };
}

// Converts the border field values into ResponsiveStyle entries.
//
// `themeColors` is required to resolve borderColor's {type, value|token}
// shape (from colorField) into a real CSS color string — passing the raw
// field value straight through sends an object into a CSS color property,
// which the browser silently drops.
//
// Backward compatible: existing saved widgets have borderWidth as a flat
// string (e.g. "0px") from before per-side widths existed.
// borderWidthBoxToEntries() (via normalizeBorderWidth) treats that as a
// single linked value applied to all four sides, so old widgets render
// identically to before. Call sites that already do
// `borderToEntries(props, themeColors)` need no changes.
export function borderToEntries(props, themeColors) {
  const { borderWidth, borderStyle, borderColor, borderRadius } = props;

  const resolvedColor = resolveColor(borderColor, themeColors);
  const widths = borderWidthBoxToEntries(borderWidth);

  return [
    { property: "border-top-width", value: widths.top },
    { property: "border-top-style", value: borderStyle },
    { property: "border-top-color", value: resolvedColor },
    { property: "border-right-width", value: widths.right },
    { property: "border-right-style", value: borderStyle },
    { property: "border-right-color", value: resolvedColor },
    { property: "border-bottom-width", value: widths.bottom },
    { property: "border-bottom-style", value: borderStyle },
    { property: "border-bottom-color", value: resolvedColor },
    { property: "border-left-width", value: widths.left },
    { property: "border-left-style", value: borderStyle },
    { property: "border-left-color", value: resolvedColor },
    ...cornerBoxToEntries(borderRadius),
  ];
}
