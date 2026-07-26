// src/lib/pageBuilder/widgets/Icon.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

export const IconBlock = {
  label: "Icon",
  fields: {
    icon: { type: "text", label: "Icon Class (e.g. ti-star)" },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "Small", value: "text-2xl" },
        { label: "Medium", value: "text-3xl" },
        { label: "Large", value: "text-4xl" },
        { label: "X-Large", value: "text-5xl" },
      ],
    },
    color: {
      type: "select",
      label: "Color",
      options: [
        { label: "Brand blue", value: "#2563eb" },
        { label: "Dark", value: "#111827" },
        { label: "White", value: "#ffffff" },
        { label: "Gray", value: "#6b7280" },
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
    paddingTop: flexibleSizeField("Padding Top", SPACING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SPACING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    icon: "ti-star",
    size: "text-4xl",
    color: "#2563eb",
    align: "text-left",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    icon,
    size,
    color,
    align,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => (
    <div className={align} style={{ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }}>
      <i className={`ti ${icon} ${size}`} style={{ color }} />
    </div>
  ),
};
