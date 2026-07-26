// src/lib/pageBuilder/widgets/Subsection.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { flexibleSizeField, SPACING_PRESETS, BLOCK_HEIGHT_PRESETS } from "../fields/flexibleSize";

export const Subsection = {
  label: "Subsection (styled block)",
  fields: {
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
    paddingTop: flexibleSizeField("Padding Top", SPACING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SPACING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
    rounded: {
      type: "radio",
      label: "Corner Rounding",
      options: [
        { label: "None", value: "rounded-none" },
        { label: "Medium", value: "rounded-lg" },
        { label: "Large", value: "rounded-2xl" },
      ],
    },
  },
  defaultProps: {
    bgType: "none",
    bgColor: "#ffffff",
    bgImage: "",
    minHeight: "auto",
    paddingTop: "16px",
    paddingBottom: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    marginTop: "0px",
    marginBottom: "0px",
    rounded: "rounded-none",
  },
  render: ({
    bgType,
    bgColor,
    bgImage,
    minHeight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    rounded,
  }) => (
    <div
      className={`${rounded} overflow-hidden h-full`}
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        marginTop,
        marginBottom,
        minHeight: minHeight === "auto" ? undefined : minHeight,
        backgroundColor: bgType === "color" ? bgColor : undefined,
        backgroundImage: bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <DropZone zone="content" />
    </div>
  ),
};
