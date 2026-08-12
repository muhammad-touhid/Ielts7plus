// src/lib/pageBuilder/widgets/Badge.jsx
"use client";

import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
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
import { useThemeColors } from "../theme/ThemeColorsContext";

export const Badge = {
  label: "Badge",
  fields: {
    text: { type: "text", label: "Text" },
    font: fontField("Font", "badge"),
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Translucent (for dark backgrounds)", value: "translucent" },
        { label: "Light (for light backgrounds)", value: "light" },
        { label: "Solid Brand Blue", value: "solid" },
      ],
    },
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
    id: "badge-default",
    text: "★ #1 IELTS Preparation Platform",
    font: { type: "theme", token: "badge" },
    style: "translucent",
    blockAlign: { desktop: "left" },
    padding: {
      top: { desktop: "8" },
      right: { desktop: "20" },
      bottom: { desktop: "8" },
      left: { desktop: "20" },
      linked: false,
      unit: "px",
    },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "20" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
    ...borderDefaultProps(),
    borderRadius: {
      topLeft: { desktop: "9999px" },
      topRight: { desktop: "9999px" },
      bottomRight: { desktop: "9999px" },
      bottomLeft: { desktop: "9999px" },
      linked: true,
    },
    ...hoverDefaultProps(),
  },
  render: ({
    id,
    text,
    font,
    style,
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
    const { themeColors, themeFonts } = useThemeColors();
    const scopedClass = `pb-badge-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const resolvedFont = resolveFont(font, themeFonts);
    const styleClasses = {
      translucent: "text-white/80 bg-white/15",
      light: "text-gray-600 bg-gray-100",
      solid: "text-white bg-blue-600",
    };

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
          <div
            className={`text-xs font-bold tracking-widest uppercase ${styleClasses[style]} ${scopedClass}`}
            style={{
              fontFamily: resolvedFont
                ? `'${resolvedFont}', sans-serif`
                : undefined,
            }}
          >
            {text}
          </div>
        </div>
      </>
    );
  },
};
