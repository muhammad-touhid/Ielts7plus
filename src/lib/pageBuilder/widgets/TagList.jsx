// src/lib/pageBuilder/widgets/TagList.jsx
"use client";

import Link from "next/link";
import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
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

// Shadow, like hover, applies per-pill (pillClass) — same reasoning as
// border/radius already working this way here.
export const TagList = {
  label: "Tag List",
  fields: {
    items: {
      type: "array",
      label: "Tags",
      arrayFields: {
        text: { type: "text", label: "Tag Text" },
        href: { type: "text", label: "Link" },
      },
      defaultItemProps: { text: "Tag", href: "/search?q=Tag" },
      getItemSummary: (item) => item.text || "Tag",
    },
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Translucent (for dark backgrounds)", value: "translucent" },
        { label: "Light (for light backgrounds)", value: "light" },
      ],
    },
    blockAlign: responsiveField(
      "Block Alignment (position within column)",
      TEXT_ALIGN_PRESETS,
    ),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    shadow: shadowField(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "taglist-default",
    items: [
      { text: "Writing Task 2", href: "/search?q=Writing Task 2" },
      { text: "Speaking Band 7", href: "/search?q=Speaking Band 7" },
      { text: "Listening Tips", href: "/search?q=Listening Tips" },
      { text: "Reading Strategies", href: "/search?q=Reading Strategies" },
      { text: "Mock Tests", href: "/search?q=Mock Tests" },
    ],
    style: "translucent",
    blockAlign: { desktop: "left" },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "0" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderRadius: {
      topLeft: { desktop: "9999px" },
      topRight: { desktop: "9999px" },
      bottomRight: { desktop: "9999px" },
      bottomLeft: { desktop: "9999px" },
      linked: true,
    },
    ...shadowDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: ({
    id,
    items,
    style,
    blockAlign,
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
    const { themeColors } = useThemeColors();
    const scopedClass = `pb-taglist-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const pillClass = `${scopedClass}-pill`;
    const styleClasses =
      style === "translucent"
        ? "text-white/85 bg-white/10 hover:bg-white/20"
        : "text-gray-600 bg-gray-50 hover:bg-gray-100";
    const resolvedShadow = resolveShadow(shadow) || undefined;

    const hoverCss = buildHoverCss(
      pillClass,
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
          entries={spacingBoxToEntries("margin", margin)}
        />
        <ResponsiveStyle
          className={pillClass}
          entries={borderToEntries({
            borderWidth,
            borderStyle,
            borderColor,
            borderRadius,
          })}
        />
        {hoverCss && <style>{hoverCss}</style>}
        <div className={wrapClass}>
          <div className={`flex flex-wrap gap-2 ${scopedClass}`}>
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href || "#"}
                className={`px-4 py-1.5 text-sm transition-colors ${hoverEnabled ? "" : styleClasses} ${pillClass}`}
                style={{ boxShadow: resolvedShadow }}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  },
};
