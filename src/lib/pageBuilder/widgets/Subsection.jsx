// src/lib/pageBuilder/widgets/Subsection.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import {
  flexibleSizeField,
  BLOCK_HEIGHT_PRESETS,
  MAX_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor } from "../fields/colorField";
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
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import { useThemeColors } from "../theme/ThemeColorsContext";

export const Subsection = {
  label: "Subsection (styled block)",
  fields: {
    align: {
      type: "radio",
      label: "Horizontal Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    bgType: {
      type: "radio",
      label: "Background Type",
      options: [
        { label: "None", value: "none" },
        { label: "Color", value: "color" },
        { label: "Image", value: "image" },
      ],
    },
    // Was a hardcoded plain-hex select — now theme-aware, matching Section.
    bgColor: colorField("Background Color", [
      { label: "White", value: "#ffffff" },
      { label: "Light gray", value: "#f9fafb" },
      { label: "Brand blue", value: "#354e98" },
    ]),
    bgImage: {
      type: "custom",
      label: "Background Image",
      render: withLabel(({ value, onChange }) => (
        <ImageUpload value={value} onChange={(url) => onChange(url)} />
      )),
    },
    minHeight: flexibleSizeField("Min Height", BLOCK_HEIGHT_PRESETS),
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "subsection-default",
    align: "left",
    bgType: "none",
    bgColor: "#ffffff",
    bgImage: "",
    minHeight: "auto",
    maxWidth: { desktop: "none" },
    padding: {
      top: { desktop: "16" },
      right: { desktop: "16" },
      bottom: { desktop: "16" },
      left: { desktop: "16" },
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
    align,
    bgType,
    bgColor,
    bgImage,
    minHeight,
    maxWidth,
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
    const scopedClass = `pb-subsection-${id}`;
    const resolvedBgColor = resolveColor(bgColor, themeColors);
    const alignMargin =
      align === "center"
        ? { marginLeft: "auto", marginRight: "auto" }
        : align === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: 0, marginRight: "auto" };

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
      <div
        className={`overflow-hidden h-full ${scopedClass}`}
        style={{
          ...alignMargin,
          minHeight: minHeight === "auto" ? undefined : minHeight,
          backgroundColor: bgType === "color" ? resolvedBgColor : undefined,
          backgroundImage:
            bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <ResponsiveStyle
          className={scopedClass}
          entries={[
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
        <DropZone zone="content" />
      </div>
    );
  },
};
