// src/lib/pageBuilder/widgets/Section.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { flexibleSizeField, SPACING_PRESETS, SECTION_PADDING_PRESETS, HEIGHT_PRESETS, GAP_PRESETS } from "../fields/flexibleSize";

const COLUMN_LAYOUTS = {
  "1": { label: "1 Column", grid: "1fr" },
  "2-equal": { label: "2 Columns (50 / 50)", grid: "1fr 1fr" },
  "2-narrow-wide": { label: "2 Columns (30 / 70)", grid: "3fr 7fr" },
  "2-wide-narrow": { label: "2 Columns (70 / 30)", grid: "7fr 3fr" },
  "3-equal": { label: "3 Columns (equal)", grid: "1fr 1fr 1fr" },
  "4-equal": { label: "4 Columns (equal)", grid: "1fr 1fr 1fr 1fr" },
};

function columnCount(key) {
  return COLUMN_LAYOUTS[key].grid.split(" ").length;
}

export const Section = {
  label: "Section",
  fields: {
    columns: {
      type: "select",
      label: "Column Layout",
      options: Object.entries(COLUMN_LAYOUTS).map(([value, { label }]) => ({ label, value })),
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
    bgColor: {
      type: "select",
      label: "Background Color",
      options: [
        { label: "White", value: "#ffffff" },
        { label: "Light gray", value: "#f9fafb" },
        { label: "Dark", value: "#111827" },
        { label: "Brand blue", value: "#354e98" },
      ],
    },
    bgImage: {
      type: "custom",
      label: "Background Image",
      render: withLabel(({ value, onChange }) => <ImageUpload value={value} onChange={(url) => onChange(url)} />),
    },
    overlayColor: {
      type: "select",
      label: "Overlay Color",
      options: [
        { label: "Black", value: "#000000" },
        { label: "White", value: "#ffffff" },
        { label: "Brand blue", value: "#354e98" },
        { label: "Dark navy", value: "#0f172a" },
      ],
    },
    overlayOpacity: {
      type: "select",
      label: "Overlay Opacity",
      options: [
        { label: "None", value: "0" },
        { label: "Light (30%)", value: "0.3" },
        { label: "Medium (55%)", value: "0.55" },
        { label: "Dark (75%)", value: "0.75" },
      ],
    },
    minHeight: flexibleSizeField("Min Height", HEIGHT_PRESETS),
    contentWidth: {
      type: "select",
      label: "Content Width",
      options: [
        { label: "Boxed — narrow", value: "max-w-3xl" },
        { label: "Boxed — medium", value: "max-w-5xl" },
        { label: "Boxed — wide", value: "max-w-6xl" },
        { label: "Full width", value: "max-w-full" },
      ],
    },
    paddingTop: flexibleSizeField("Padding Top", SECTION_PADDING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SECTION_PADDING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    columns: "1",
    columnGap: "32px",
    bgType: "color",
    bgColor: "#ffffff",
    bgImage: "",
    overlayColor: "#000000",
    overlayOpacity: "0.5",
    minHeight: "auto",
    contentWidth: "max-w-6xl",
    paddingTop: "64px",
    paddingBottom: "64px",
    paddingLeft: "24px",
    paddingRight: "24px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    columns,
    columnGap,
    bgType,
    bgColor,
    bgImage,
    overlayColor,
    overlayOpacity,
    minHeight,
    contentWidth,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => {
    const layout = COLUMN_LAYOUTS[columns] || COLUMN_LAYOUTS["1"];
    const count = columnCount(columns);

    return (
      <section
        className={`relative ${bgType === "gradient" ? "bg-gradient-to-br from-[#354e98] to-[#4a71df]" : ""}`}
        style={{
          minHeight: minHeight === "auto" ? undefined : minHeight,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          marginTop,
          marginBottom,
          backgroundColor: bgType === "color" ? bgColor : undefined,
          backgroundImage: bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {bgType === "image" && bgImage && parseFloat(overlayOpacity) > 0 && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: parseFloat(overlayOpacity) }}
          />
        )}
        <div
          className={`relative ${contentWidth} mx-auto grid`}
          style={{ gridTemplateColumns: layout.grid, gap: columnGap }}
        >
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
