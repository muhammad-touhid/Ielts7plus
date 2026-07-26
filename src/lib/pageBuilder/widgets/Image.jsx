// src/lib/pageBuilder/widgets/Image.jsx
"use client";

import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

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
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "mr-auto" },
        { label: "Center", value: "mx-auto" },
        { label: "Right", value: "ml-auto" },
      ],
    },
    paddingTop: flexibleSizeField("Padding Top", SPACING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SPACING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    src: "",
    alt: "",
    width: "100%",
    height: "auto",
    fit: "object-cover",
    rounded: "rounded-lg",
    align: "mx-auto",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    src,
    alt,
    width,
    height,
    fit,
    rounded,
    align,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => {
    if (!src) {
      return (
        <div className="w-full h-48 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm rounded-lg">
          No image selected
        </div>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${rounded} ${fit} ${align} box-content`}
        style={{
          width,
          height: height === "auto" ? undefined : height,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          marginTop,
          marginBottom,
        }}
      />
    );
  },
};
