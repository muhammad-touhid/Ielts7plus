// src/lib/pageBuilder/widgets/Text.jsx
"use client";

import {
  TEXT_SIZE_PRESETS,
  TEXT_ALIGN_PRESETS,
  MAX_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor } from "../fields/colorField";
import { fontField, resolveFont } from "../fields/fontField";
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
import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";
import { useThemeColors } from "../theme/ThemeColorsContext";

export const Text = {
  label: "Text",
  fields: {
    text: { type: "textarea", label: "Text" },
    font: fontField("Font", "paragraph"),
    color: colorField("Color", [
      { label: "Gray (default)", value: "#4b5563" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "Blue-100 (light, for gradients)", value: "#dbeafe" },
    ]),
    weight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Semibold", value: "font-semibold" },
        { label: "Bold", value: "font-bold" },
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
    size: responsiveField("Size", TEXT_SIZE_PRESETS),
    align: responsiveField("Text Alignment", TEXT_ALIGN_PRESETS),
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    blockAlign: responsiveField(
      "Block Alignment (position within column)",
      TEXT_ALIGN_PRESETS,
    ),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    shadow: shadowField(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "text-default",
    text: "Write your paragraph content here.",
    font: { type: "theme", token: "paragraph" },
    color: "#4b5563",
    weight: "font-normal",
    textCase: "none",
    size: { desktop: "1rem" },
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
    ...shadowDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: ({
    id,
    text,
    font,
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
    shadow,
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
    const { themeColors, themeFonts } = useThemeColors();
    const scopedClass = `pb-text-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const resolvedColor = resolveColor(color, themeColors);
    const resolvedFont = resolveFont(font, themeFonts);

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
          <p
            className={`leading-relaxed ${weight} ${scopedClass}`}
            style={{
              color: resolvedColor,
              textTransform: textCase,
              fontFamily: resolvedFont
                ? `'${resolvedFont}', sans-serif`
                : undefined,
              boxShadow: resolveShadow(shadow) || undefined,
            }}
          >
            {text}
          </p>
        </div>
      </>
    );
  },
};
