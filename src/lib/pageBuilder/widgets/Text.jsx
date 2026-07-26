// src/lib/pageBuilder/widgets/Text.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

export const Text = {
  label: "Text",
  fields: {
    text: { type: "textarea", label: "Text" },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "text-sm" },
        { label: "Base", value: "text-base" },
        { label: "Large", value: "text-lg" },
        { label: "X-Large", value: "text-xl" },
      ],
    },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "text-left" },
        { label: "Center", value: "text-center" },
        { label: "Right", value: "text-right" },
      ],
    },
    color: {
      type: "select",
      label: "Color",
      options: [
        { label: "Gray (default)", value: "#4b5563" },
        { label: "Dark", value: "#111827" },
        { label: "White", value: "#ffffff" },
        { label: "Brand blue", value: "#2563eb" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: [
        { label: "None", value: "max-w-none" },
        { label: "Narrow", value: "max-w-md" },
        { label: "Medium", value: "max-w-2xl" },
        { label: "Wide", value: "max-w-4xl" },
      ],
    },
    paddingTop: flexibleSizeField("Padding Top", SPACING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SPACING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    text: "Write your paragraph content here.",
    size: "text-base",
    align: "text-left",
    color: "#4b5563",
    maxWidth: "max-w-none",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    text,
    size,
    align,
    color,
    maxWidth,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => (
    <p
      className={`${size} ${align} ${maxWidth} leading-relaxed`}
      style={{ color, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }}
    >
      {text}
    </p>
  ),
};
