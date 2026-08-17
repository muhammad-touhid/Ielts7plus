// src/lib/pageBuilder/widgets/Image.jsx
"use client";

import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
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

export const ImageBlock = {
  label: "Image",
  fields: {
    src: {
      type: "custom",
      label: "Image",
      render: withLabel(({ value, onChange }) => (
        <ImageUpload value={value} onChange={(url) => onChange(url)} />
      )),
    },
    alt: { type: "text", label: "Alt Text" },
    width: {
      type: "select",
      label: "Width",
      options: [
        { label: "25%", value: "25%" },
        { label: "50%", value: "50%" },
        { label: "75%", value: "75%" },
        { label: "100%", value: "100%" },
      ],
    },
    height: {
      type: "select",
      label: "Height",
      options: [
        { label: "Auto", value: "auto" },
        { label: "Small (200px)", value: "200px" },
        { label: "Medium (350px)", value: "350px" },
        { label: "Large (500px)", value: "500px" },
      ],
    },
    fit: {
      type: "radio",
      label: "Fit",
      options: [
        { label: "Cover (crop to fill)", value: "object-cover" },
        { label: "Contain (fit inside)", value: "object-contain" },
      ],
    },
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
    id: "image-default",
    src: "",
    alt: "",
    width: "100%",
    height: "auto",
    fit: "object-cover",
    blockAlign: { desktop: "center" },
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
    borderRadius: {
      topLeft: { desktop: "8px" },
      topRight: { desktop: "8px" },
      bottomRight: { desktop: "8px" },
      bottomLeft: { desktop: "8px" },
      linked: true,
    },
    ...shadowDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: ({
    id,
    src,
    alt,
    width,
    height,
    fit,
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
    const { themeColors } = useThemeColors();
    const scopedClass = `pb-image-${id}`;
    const wrapClass = `${scopedClass}-wrap`;

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

    if (!src) {
      return (
        <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm rounded-lg">
          No image selected
        </div>
      );
    }
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
        <div className={`${wrapClass} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`${fit} ${scopedClass}`}
            style={{
              width,
              height: height === "auto" ? undefined : height,
              boxShadow: resolveShadow(shadow) || undefined,
            }}
          />
        </div>
      </>
    );
  },
};
