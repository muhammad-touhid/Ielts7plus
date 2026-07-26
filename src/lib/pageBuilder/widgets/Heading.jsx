// src/lib/pageBuilder/widgets/Heading.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

export const Heading = {
  label: "Heading",
  fields: {
    text: { type: "text", label: "Text" },
    tag: {
      type: "select",
      label: "HTML Tag",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "H4", value: "h4" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "text-xl md:text-2xl" },
        { label: "Medium", value: "text-2xl md:text-3xl" },
        { label: "Large", value: "text-3xl md:text-4xl" },
        { label: "X-Large", value: "text-4xl md:text-5xl" },
        { label: "XX-Large", value: "text-5xl md:text-6xl" },
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
        { label: "Dark", value: "#111827" },
        { label: "White", value: "#ffffff" },
        { label: "Brand blue", value: "#2563eb" },
        { label: "Gray", value: "#6b7280" },
      ],
    },
    weight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Bold", value: "font-bold" },
        { label: "Extra Bold", value: "font-extrabold" },
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
    text: "Your Heading Here",
    tag: "h2",
    size: "text-3xl md:text-4xl",
    align: "text-left",
    color: "#111827",
    weight: "font-bold",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    text,
    tag: Tag,
    size,
    align,
    color,
    weight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => (
    <Tag
      className={`${size} ${align} ${weight}`}
      style={{ color, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }}
    >
      {text}
    </Tag>
  ),
};
