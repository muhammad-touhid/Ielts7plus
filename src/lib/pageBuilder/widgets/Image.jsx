// src/lib/pageBuilder/widgets/Image.jsx
"use client";

import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

export const ImageBlock = {
  label: "Image",
  fields: {
    src: {
      type: "custom",
      label: "Image",
      render: withLabel(({ value, onChange }) => <ImageUpload value={value} onChange={(url) => onChange(url)} />),
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
    rounded: {
      type: "radio",
      label: "Corner Rounding",
      options: [
        { label: "None", value: "rounded-none" },
        { label: "Medium", value: "rounded-lg" },
        { label: "Full", value: "rounded-full" },
      ],
    },
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "image-default",
    src: "",
    alt: "",
    width: "100%",
    height: "auto",
    fit: "object-cover",
    rounded: "rounded-lg",
    blockAlign: { desktop: "center" },
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
  render: ({ id, src, alt, width, height, fit, rounded, blockAlign, padding, margin }) => {
    const scopedClass = `pb-image-${id}`;
    const wrapClass = `${scopedClass}-wrap`;

    if (!src) {
      return (
        <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm rounded-lg">
          No image selected
        </div>
      );
    }
    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[...spacingBoxToEntries("padding", padding), ...spacingBoxToEntries("margin", margin)]}
        />
        <div className={wrapClass}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`${rounded} ${fit} ${scopedClass}`}
            style={{ width, height: height === "auto" ? undefined : height }}
          />
        </div>
      </>
    );
  },
};
