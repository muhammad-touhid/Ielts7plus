// src/lib/pageBuilder/widgets/Section.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import {
  flexibleSizeField,
  HEIGHT_PRESETS,
  GAP_PRESETS,
  CONTENT_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import { colorField, resolveColor } from "../fields/colorField";
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

const COLUMN_LAYOUTS = {
  1: { label: "1 Column", className: "grid-cols-1", count: 1 },
  "2-equal": {
    label: "2 Columns (50 / 50)",
    className: "grid-cols-1 md:grid-cols-2",
    count: 2,
  },
  "2-narrow-wide": {
    label: "2 Columns (30 / 70)",
    className: "grid-cols-1 md:grid-cols-[3fr_7fr]",
    count: 2,
  },
  "2-wide-narrow": {
    label: "2 Columns (70 / 30)",
    className: "grid-cols-1 md:grid-cols-[7fr_3fr]",
    count: 2,
  },
  "3-equal": {
    label: "3 Columns (equal)",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    count: 3,
  },
  "4-equal": {
    label: "4 Columns (equal)",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    count: 4,
  },
};

const GRADIENT_DIRECTIONS = {
  "to right": "to right",
  "to bottom right": "to bottom right",
  "to bottom": "to bottom",
  "to bottom left": "to bottom left",
  "to left": "to left",
};

const BG_GRADIENT_DIRECTION_CLASS = {
  "to right": "bg-gradient-to-r",
  "to bottom right": "bg-gradient-to-br",
  "to bottom": "bg-gradient-to-b",
  "to bottom left": "bg-gradient-to-bl",
  "to left": "bg-gradient-to-l",
};

export const Section = {
  label: "Section",
  fields: {
    columns: {
      type: "select",
      label: "Column Layout",
      options: Object.entries(COLUMN_LAYOUTS).map(([value, { label }]) => ({
        label,
        value,
      })),
    },
    columnGap: flexibleSizeField("Column Gap", GAP_PRESETS),
    bgType: {
      type: "radio",
      label: "Background Type",
      options: [
        { label: "Color", value: "color" },
        { label: "Image", value: "image" },
        { label: "Brand Gradient", value: "gradient" },
      ],
    },
    bgColor: colorField("Background Color", [
      { label: "White", value: "#ffffff" },
      { label: "Light gray", value: "#f9fafb" },
      { label: "Dark", value: "#111827" },
      { label: "Brand blue", value: "#354e98" },
    ]),
    bgImage: {
      type: "custom",
      label: "Background Image",
      render: withLabel(({ value, onChange }) => (
        <ImageUpload value={value} onChange={(url) => onChange(url)} />
      )),
    },
    bgGradientDirection: {
      type: "select",
      label: "Background Gradient Direction",
      options: Object.keys(GRADIENT_DIRECTIONS).map((k) => ({
        label: k,
        value: k,
      })),
    },
    decorative: {
      type: "radio",
      label: "Decorative Background",
      options: [
        { label: "None", value: "none" },
        { label: "Grid Pattern", value: "grid" },
        { label: "Grid Pattern + Blobs", value: "grid-blobs" },
      ],
    },
    overlayType: {
      type: "radio",
      label: "Overlay Type",
      options: [
        { label: "None", value: "none" },
        { label: "Solid Color", value: "solid" },
        { label: "Gradient (2 colors)", value: "gradient" },
      ],
    },
    overlayColor: colorField("Overlay Color", [
      { label: "Black", value: "#000000" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#354e98" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayColorFrom: colorField("Overlay Gradient — From", [
      { label: "Navy (blue-900)", value: "#1e3a8a" },
      { label: "Brand blue", value: "#354e98" },
      { label: "Black", value: "#000000" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayColorTo: colorField("Overlay Gradient — To", [
      { label: "Blue (blue-700)", value: "#1d4ed8" },
      { label: "Brand blue light", value: "#4a71df" },
      { label: "Transparent-ish black", value: "#111827" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayDirection: {
      type: "select",
      label: "Overlay Gradient Direction",
      options: Object.keys(GRADIENT_DIRECTIONS).map((k) => ({
        label: k,
        value: k,
      })),
    },
    overlayOpacity: {
      type: "select",
      label: "Overlay Opacity",
      options: [
        { label: "Light (30%)", value: "0.3" },
        { label: "Medium (55%)", value: "0.55" },
        { label: "Dark (75%)", value: "0.75" },
        { label: "Very Dark (90%)", value: "0.9" },
      ],
    },
    minHeight: flexibleSizeField("Min Height", HEIGHT_PRESETS),
    verticalAlign: {
      type: "radio",
      label: "Vertical Alignment",
      options: [
        { label: "Top", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "flex-end" },
      ],
    },
    contentWidth: responsiveField("Content Width", CONTENT_WIDTH_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    ...hoverFieldSet(),
    shadow: shadowField(),
  },
  defaultProps: {
    id: "section-default",
    columns: "1",
    columnGap: "32px",
    bgType: "color",
    bgColor: "#ffffff",
    bgImage: "",
    bgGradientDirection: "to bottom right",
    decorative: "none",
    overlayType: "none",
    overlayColor: "#000000",
    overlayColorFrom: "#1e3a8a",
    overlayColorTo: "#1d4ed8",
    overlayDirection: "to right",
    overlayOpacity: "0.5",
    minHeight: "auto",
    verticalAlign: "flex-start",
    contentWidth: { desktop: "72rem" },
    padding: {
      top: { desktop: "64", tablet: "40", mobile: "32" },
      right: { desktop: "24" },
      bottom: { desktop: "64", tablet: "40", mobile: "32" },
      left: { desktop: "24" },
      linked: false,
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
    ...shadowDefaultProps(),
  },
  render: ({
    id,
    columns,
    columnGap,
    bgType,
    bgColor,
    bgImage,
    bgGradientDirection,
    decorative,
    overlayType,
    overlayColor,
    overlayColorFrom,
    overlayColorTo,
    overlayDirection,
    overlayOpacity,
    minHeight,
    verticalAlign,
    contentWidth,
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
    shadow,
  }) => {
    const { themeColors } = useThemeColors();
    const layout = COLUMN_LAYOUTS[columns] || COLUMN_LAYOUTS["1"];
    const count = layout.count;
    const scopedClass = `pb-section-${id}`;

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

    const resolvedBgColor = resolveColor(bgColor, themeColors);

    let overlayStyle = null;
    if (bgType === "image" && bgImage && overlayType !== "none") {
      if (overlayType === "gradient") {
        overlayStyle = {
          backgroundImage: `linear-gradient(${overlayDirection}, ${resolveColor(overlayColorFrom, themeColors)}, ${resolveColor(overlayColorTo, themeColors)})`,
          opacity: parseFloat(overlayOpacity),
        };
      } else {
        overlayStyle = {
          backgroundColor: resolveColor(overlayColor, themeColors),
          opacity: parseFloat(overlayOpacity),
        };
      }
    }

    const gradientClass =
      BG_GRADIENT_DIRECTION_CLASS[bgGradientDirection] || "bg-gradient-to-br";

    return (
      <section
        className={`relative ${scopedClass} ${bgType === "gradient" ? `${gradientClass} from-[#354e98] to-[#4a71df]` : ""}`}
        style={{
          minHeight: minHeight === "auto" ? undefined : minHeight,
          display: "flex",
          overflow: "hidden",
          alignItems: verticalAlign,
          backgroundColor: bgType === "color" ? resolvedBgColor : undefined,
          backgroundImage:
            bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: resolveShadow(shadow) || undefined,
        }}
      >
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
        {overlayStyle && (
          <div className="absolute inset-0" style={overlayStyle} />
        )}

        {(decorative === "grid" || decorative === "grid-blobs") && (
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        )}
        {decorative === "grid-blobs" && (
          <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </>
        )}
        <div
          className={`relative mx-auto grid w-full ${layout.className} ${scopedClass}-content`}
          style={{ gap: columnGap }}
        >
          <ResponsiveStyle
            className={`${scopedClass}-content`}
            entries={[{ property: "max-width", value: contentWidth }]}
          />
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="min-w-0">
              <DropZone zone={`col-${i}`} />
            </div>
          ))}
        </div>
      </section>
    );
  },
};
