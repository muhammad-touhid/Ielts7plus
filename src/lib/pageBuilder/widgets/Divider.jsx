"use client";

import { useThemeColors } from "../theme/ThemeColorsContext";
import { colorField, resolveColor } from "../fields/colorField";
import {
  flexibleSizeField,
  BORDER_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import { ResponsiveStyle } from "../fields/responsiveStyle";

const LINE_STYLE_OPTIONS = [
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
  { label: "Double", value: "double" },
];

const LENGTH_OPTIONS = [
  { label: "25%", value: "25%" },
  { label: "50%", value: "50%" },
  { label: "75%", value: "75%" },
  { label: "100% (Full)", value: "100%" },
];

const ALIGN_OPTIONS = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const DIVIDER_COLOR_PRESETS = [
  { label: "Light gray", value: "#e5e7eb" },
  { label: "Gray", value: "#9ca3af" },
  { label: "Dark", value: "#111827" },
  { label: "Brand blue", value: "#2563eb" },
];

const STATIC_FIELDS = {
  orientation: {
    type: "radio",
    label: "Orientation",
    options: [
      { label: "Horizontal", value: "horizontal" },
      { label: "Vertical", value: "vertical" },
    ],
  },
  lineStyle: {
    type: "select",
    label: "Line Style",
    options: LINE_STYLE_OPTIONS,
  },
  // Reusing BORDER_WIDTH_PRESETS since a divider line is the same kind
  // of value as a border width (a thin px measurement) — same field
  // already proven to work for borderWidth elsewhere.
  thickness: flexibleSizeField("Thickness", BORDER_WIDTH_PRESETS),
  color: colorField("Divider Color", DIVIDER_COLOR_PRESETS),
  length: {
    type: "select",
    label: "Length (Width for Horizontal / Height for Vertical)",
    options: LENGTH_OPTIONS,
  },
  align: {
    type: "select",
    label: "Alignment (only applies when Length is under 100%)",
    options: ALIGN_OPTIONS,
  },
  spacing: spacingBoxField("Spacing"),
};

export const Divider = {
  label: "Divider",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "divider-default",
    orientation: "horizontal",
    lineStyle: "solid",
    thickness: "1px",
    color: "#e5e7eb",
    length: "100%",
    align: "center",
    spacing: {
      top: { desktop: "16" },
      right: { desktop: "0" },
      bottom: { desktop: "16" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
  },
  render: function DividerRender({
    id,
    orientation,
    lineStyle,
    thickness,
    color,
    length,
    align,
    spacing,
  }) {
    const { themeColors } = useThemeColors();
    const resolvedColor = resolveColor(color, themeColors);
    const scopedClass = `pb-divider-${id}`;
    const isVertical = orientation === "vertical";

    // Alignment via margin:auto only makes sense for a horizontal line
    // sitting in a full-width block — a vertical divider's own height
    // isn't affected by left/right margins the same way, so this is
    // skipped for vertical.
    const alignMargin = isVertical
      ? {}
      : align === "left"
        ? { marginLeft: 0, marginRight: "auto" }
        : align === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

    // The line itself: zero-thickness box with a single border edge,
    // same trick as an <hr> but with full control over color/style
    // independent of Tailwind. "Double" style needs at least 3px of
    // thickness to actually render as two visible lines — that's a
    // CSS rendering quirk, not a bug here, worth knowing if a 1px
    // double divider looks identical to solid.
    const lineStyleProps = isVertical
      ? {
          width: 0,
          height: length,
          borderLeftWidth: thickness,
          borderLeftStyle: lineStyle,
          borderLeftColor: resolvedColor,
        }
      : {
          height: 0,
          width: length,
          borderTopWidth: thickness,
          borderTopStyle: lineStyle,
          borderTopColor: resolvedColor,
        };

    return (
      <div className={`relative ${scopedClass}`}>
        <ResponsiveStyle
          className={scopedClass}
          entries={spacingBoxToEntries("margin", spacing)}
        />
        <div style={{ ...lineStyleProps, ...alignMargin }} />
      </div>
    );
  },
};
