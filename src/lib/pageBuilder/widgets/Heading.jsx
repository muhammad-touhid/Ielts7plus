// src/lib/pageBuilder/widgets/Heading.jsx
"use client";

import { HEADING_SIZE_PRESETS, TEXT_ALIGN_PRESETS, MAX_WIDTH_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField } from "../fields/colorField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

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
    color: colorField("Color", [
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "Gray", value: "#6b7280" },
    ]),
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
    size: responsiveField("Size", HEADING_SIZE_PRESETS),
    align: responsiveField("Text Alignment", TEXT_ALIGN_PRESETS),
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "heading-default",
    text: "Your Heading Here",
    tag: "h2",
    color: "#111827",
    weight: "font-bold",
    size: { desktop: "2.25rem", tablet: "1.875rem", mobile: "1.5rem" },
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
  render: ({ id, text, tag: Tag, color, weight, size, align, maxWidth, blockAlign, padding, margin }) => {
    const scopedClass = `pb-heading-${id}`;
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
          <Tag className={`${weight} ${scopedClass}`} style={{ color, lineHeight: 1.2 }}>
            {text}
          </Tag>
        </div>
      </>
    );
  },
};
