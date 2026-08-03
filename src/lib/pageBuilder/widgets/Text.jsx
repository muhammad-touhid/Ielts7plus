// src/lib/pageBuilder/widgets/Text.jsx
"use client";

import { TEXT_SIZE_PRESETS, TEXT_ALIGN_PRESETS, MAX_WIDTH_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField } from "../fields/colorField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

export const Text = {
  label: "Text",
  fields: {
    text: { type: "textarea", label: "Text" },
    color: colorField("Color", [
      { label: "Gray (default)", value: "#4b5563" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "Blue-100 (light, for gradients)", value: "#dbeafe" },
    ]),
    size: responsiveField("Size", TEXT_SIZE_PRESETS),
    align: responsiveField("Text Alignment", TEXT_ALIGN_PRESETS),
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "text-default",
    text: "Write your paragraph content here.",
    color: "#4b5563",
    size: { desktop: "1rem" },
    align: { desktop: "left" },
    maxWidth: { desktop: "none" },
    blockAlign: { desktop: "left" },
    padding: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "0px" },
      left: { desktop: "0px" },
      linked: true,
    },
    margin: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "0px" },
      left: { desktop: "0px" },
      linked: false,
    },
  },
  render: ({ id, text, color, size, align, maxWidth, blockAlign, padding, margin }) => {
    const scopedClass = `pb-text-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "font-size", value: size },
            { property: "text-align", value: align },
            { property: "max-width", value: maxWidth },
            ...spacingBoxToEntries("padding", padding),
            ...spacingBoxToEntries("margin", margin),
          ]}
        />
        <div className={wrapClass}>
          <p className={`leading-relaxed ${scopedClass}`} style={{ color }}>
            {text}
          </p>
        </div>
      </>
    );
  },
};
