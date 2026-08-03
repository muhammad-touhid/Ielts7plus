// src/lib/pageBuilder/widgets/Badge.jsx
"use client";

import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

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
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "badge-default",
    text: "★ #1 IELTS Preparation Platform",
    style: "translucent",
    blockAlign: { desktop: "left" },
    padding: {
      top: { desktop: "8px" },
      right: { desktop: "20px" },
      bottom: { desktop: "8px" },
      left: { desktop: "20px" },
      linked: false,
    },
    margin: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "20px" },
      left: { desktop: "0px" },
      linked: false,
    },
  },
  render: ({ id, text, style, blockAlign, padding, margin }) => {
    const scopedClass = `pb-badge-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const styleClasses = {
      translucent: "text-white/80 bg-white/15 border border-white/20",
      light: "text-gray-600 bg-gray-100 border border-gray-200",
      solid: "text-white bg-blue-600 border border-blue-600",
    };
    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[...spacingBoxToEntries("padding", padding), ...spacingBoxToEntries("margin", margin)]}
        />
        <div className={wrapClass}>
          <div className={`text-xs font-bold tracking-widest uppercase rounded-full ${styleClasses[style]} ${scopedClass}`}>
            {text}
          </div>
        </div>
      </>
    );
  },
};
