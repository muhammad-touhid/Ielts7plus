// src/lib/pageBuilder/widgets/Badge.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

// Small pill/eyebrow label — "★ #1 IELTS Preparation Platform" style tags
// often used above a hero heading.
export const Badge = {
  label: "Badge",
  fields: {
    text: { type: "text", label: "Text" },
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Translucent (for dark backgrounds)", value: "translucent" },
        { label: "Light (for light backgrounds)", value: "light" },
        { label: "Solid Brand Blue", value: "solid" },
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
    text: "★ #1 IELTS Preparation Platform",
    style: "translucent",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: "0px",
    marginBottom: "20px",
  },
  render: ({ text, style, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }) => {
    const styleClasses = {
      translucent: "text-white/80 bg-white/15 border border-white/20",
      light: "text-gray-600 bg-gray-100 border border-gray-200",
      solid: "text-white bg-blue-600 border border-blue-600",
    };
    return (
      <div
        className={`inline-block text-xs font-bold tracking-widest uppercase rounded-full ${styleClasses[style]}`}
        style={{ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }}
      >
        {text}
      </div>
    );
  },
};
