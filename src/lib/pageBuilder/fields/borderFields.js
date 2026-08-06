// src/lib/pageBuilder/fields/borderFields.js
"use client";

import { flexibleSizeField, BORDER_WIDTH_PRESETS } from "./flexibleSize";
import { colorField } from "./colorField";
import { cornerBoxField, cornerBoxToEntries } from "./cornerBoxField";

// Spread into any widget's `fields` object for a consistent
// Elementor-style border + radius control set. Border width/style/color
// are deliberately NOT per-device (a border rarely needs to change
// between mobile and desktop) — border-radius IS per-device via
// cornerBoxField, since rounding sometimes does want to differ
// (e.g. a card that's fully rounded on desktop, less so on mobile).
export function borderFieldSet() {
  return {
    borderWidth: flexibleSizeField("Border Width", BORDER_WIDTH_PRESETS),
    borderStyle: {
      type: "select",
      label: "Border Style",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
      ],
    },
    borderColor: colorField("Border Color", [
      { label: "Light gray", value: "#e5e7eb" },
      { label: "Gray", value: "#9ca3af" },
      { label: "Dark", value: "#111827" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "White", value: "#ffffff" },
    ]),
    borderRadius: cornerBoxField("Corner Radius"),
  };
}

export function borderDefaultProps() {
  return {
    borderWidth: "0px",
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

// Converts the border field values into ResponsiveStyle entries. Border
// style/color only actually render if width is non-zero, but there's no
// harm setting them unconditionally — a 0px border is invisible regardless.
export function borderToEntries({ borderWidth, borderStyle, borderColor, borderRadius }) {
  return [
    { property: "border-width", value: borderWidth },
    { property: "border-style", value: borderStyle },
    { property: "border-color", value: borderColor },
    ...cornerBoxToEntries(borderRadius),
  ];
}
