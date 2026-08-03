// src/lib/pageBuilder/widgets/Subsection.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { flexibleSizeField, BLOCK_HEIGHT_PRESETS, MAX_WIDTH_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

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
    bgColor: {
      type: "select",
      label: "Background Color",
      options: [
        { label: "White", value: "#ffffff" },
        { label: "Light gray", value: "#f9fafb" },
        { label: "Brand blue", value: "#354e98" },
      ],
    },
    bgImage: {
      type: "custom",
      label: "Background Image",
      render: withLabel(({ value, onChange }) => <ImageUpload value={value} onChange={(url) => onChange(url)} />),
    },
    minHeight: flexibleSizeField("Min Height", BLOCK_HEIGHT_PRESETS),
    rounded: {
      type: "radio",
      label: "Corner Rounding",
      options: [
        { label: "None", value: "rounded-none" },
        { label: "Medium", value: "rounded-lg" },
        { label: "Large", value: "rounded-2xl" },
      ],
    },
    maxWidth: responsiveField("Max Width", MAX_WIDTH_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "subsection-default",
    align: "left",
    bgType: "none",
    bgColor: "#ffffff",
    bgImage: "",
    minHeight: "auto",
    rounded: "rounded-none",
    maxWidth: { desktop: "none" },
    padding: {
      top: { desktop: "16px" },
      right: { desktop: "16px" },
      bottom: { desktop: "16px" },
      left: { desktop: "16px" },
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
  render: ({ id, align, bgType, bgColor, bgImage, minHeight, rounded, maxWidth, padding, margin }) => {
    const scopedClass = `pb-subsection-${id}`;
    const alignMargin =
      align === "center"
        ? { marginLeft: "auto", marginRight: "auto" }
        : align === "right"
        ? { marginLeft: "auto", marginRight: 0 }
        : { marginLeft: 0, marginRight: "auto" }; // left

    return (
      <div
        className={`${rounded} overflow-hidden h-full ${scopedClass}`}
        style={{
          ...alignMargin,
          minHeight: minHeight === "auto" ? undefined : minHeight,
          backgroundColor: bgType === "color" ? bgColor : undefined,
          backgroundImage: bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
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
          ]}
        />
        <DropZone zone="content" />
      </div>
    );
  },
};
