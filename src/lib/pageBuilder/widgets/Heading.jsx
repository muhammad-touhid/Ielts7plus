// src/lib/pageBuilder/widgets/Heading.jsx
"use client";

import {
  HEADING_SIZE_PRESETS,
  TEXT_ALIGN_PRESETS,
  MAX_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor } from "../fields/colorField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import {
  ResponsiveStyle,
  alignToJustifyEntries,
} from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import { useThemeColors } from "../theme/ThemeColorsContext";

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
    textCase: {
      type: "select",
      label: "Text Case",
      options: [
        { label: "None", value: "none" },
        { label: "UPPERCASE", value: "uppercase" },
        { label: "lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ],
    },
    size: responsiveField("Size", HEADING_SIZE_PRESETS),
    align: responsiveField("Text Alignment", TEXT_ALIGN_PRESETS),
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    blockAlign: responsiveField(
      "Block Alignment (position within column)",
      TEXT_ALIGN_PRESETS,
    ),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "heading-default",
    text: "Your Heading Here",
    tag: "h2",
    color: "#111827",
    weight: "font-bold",
    textCase: "none",
    size: { desktop: "2.25rem", tablet: "1.875rem", mobile: "1.5rem" },
    align: { desktop: "left" },
    maxWidth: { desktop: "none" },
    blockAlign: { desktop: "left" },
    padding: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "0" },
      left: { desktop: "0" },
      linked: true,
      unit: "px",
    },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "0" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
    ...borderDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: ({
    id,
    text,
    tag: Tag,
    color,
    weight,
    textCase,
    size,
    align,
    maxWidth,
    blockAlign,
    padding,
    margin,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    hoverEnabled,
    hoverBgColor,
    hoverTextColor,
    hoverBorderColor,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverTranslateY,
    hoverRotate,
    hoverShadow,
    hoverGrayscaleToColor,
    hoverTransitionMs,
  }) => {
    const { themeColors } = useThemeColors();
    const scopedClass = `pb-heading-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const resolvedColor = resolveColor(color, themeColors);

    const hoverCss = buildHoverCss(
      scopedClass,
      {
        hoverEnabled,
        hoverBgColor,
        hoverTextColor,
        hoverBorderColor,
        hoverOpacity,
        hoverScale,
        hoverTranslateX,
        hoverTranslateY,
        hoverRotate,
        hoverShadow,
        hoverGrayscaleToColor,
        hoverTransitionMs,
      },
      themeColors,
    );

    return (
      <>
        <ResponsiveStyle
          className={wrapClass}
          entries={alignToJustifyEntries(blockAlign)}
        />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "font-size", value: size },
            { property: "text-align", value: align },
            { property: "max-width", value: maxWidth },
            ...spacingBoxToEntries("padding", padding),
            ...spacingBoxToEntries("margin", margin),
            ...borderToEntries({
              borderWidth,
              borderStyle,
              borderColor,
              borderRadius,
            }),
          ]}
        />
        {hoverCss && <style>{hoverCss}</style>}
        <div className={wrapClass}>
          <Tag
            className={`${weight} ${scopedClass}`}
            style={{
              color: resolvedColor,
              lineHeight: 1.2,
              textTransform: textCase,
            }}
          >
            {text}
          </Tag>
        </div>
      </>
    );
  },
};
