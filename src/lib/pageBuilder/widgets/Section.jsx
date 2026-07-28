// src/lib/pageBuilder/widgets/Section.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import { flexibleSizeField, SPACING_PRESETS, SECTION_PADDING_PRESETS, HEIGHT_PRESETS, GAP_PRESETS, CONTENT_WIDTH_PRESETS } from "../fields/flexibleSize";

const COLUMN_LAYOUTS = {
  "1": { label: "1 Column", grid: "1fr" },
  "2-equal": { label: "2 Columns (50 / 50)", grid: "1fr 1fr" },
  "2-narrow-wide": { label: "2 Columns (30 / 70)", grid: "3fr 7fr" },
  "2-wide-narrow": { label: "2 Columns (70 / 30)", grid: "7fr 3fr" },
  "3-equal": { label: "3 Columns (equal)", grid: "1fr 1fr 1fr" },
  "4-equal": { label: "4 Columns (equal)", grid: "1fr 1fr 1fr 1fr" },
};

const GRADIENT_DIRECTIONS = {
  "to right": "to right",
  "to bottom right": "to bottom right",
  "to bottom": "to bottom",
  "to bottom left": "to bottom left",
  "to left": "to left",
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
    overlayType: {
      type: "radio",
      label: "Overlay Type",
      options: [
        { label: "None", value: "none" },
        { label: "Solid Color", value: "solid" },
        { label: "Gradient (2 colors)", value: "gradient" },
      ],
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
    overlayColorFrom: {
      type: "select",
      label: "Overlay Gradient — From",
      options: [
        { label: "Navy (blue-900)", value: "#1e3a8a" },
        { label: "Brand blue", value: "#354e98" },
        { label: "Black", value: "#000000" },
        { label: "Dark navy", value: "#0f172a" },
      ],
    },
    overlayColorTo: {
      type: "select",
      label: "Overlay Gradient — To",
      options: [
        { label: "Blue (blue-700)", value: "#1d4ed8" },
        { label: "Brand blue light", value: "#4a71df" },
        { label: "Transparent-ish black", value: "#111827" },
        { label: "Dark navy", value: "#0f172a" },
      ],
    },
    overlayDirection: {
      type: "select",
      label: "Overlay Gradient Direction",
      options: Object.keys(GRADIENT_DIRECTIONS).map((k) => ({ label: k, value: k })),
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
      // Only matters when Min Height makes the section taller than its
      // content (e.g. "Full screen") — controls where content sits
      // within that extra vertical space.
      options: [
        { label: "Top", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "flex-end" },
      ],
    },
    contentWidth: flexibleSizeField("Content Width", CONTENT_WIDTH_PRESETS),
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
    overlayType: "none",
    overlayColor: "#000000",
    overlayColorFrom: "#1e3a8a",
    overlayColorTo: "#1d4ed8",
    overlayDirection: "to right",
    overlayOpacity: "0.5",
    minHeight: "auto",
    verticalAlign: "flex-start",
    contentWidth: "72rem",
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
    overlayType,
    overlayColor,
    overlayColorFrom,
    overlayColorTo,
    overlayDirection,
    overlayOpacity,
    minHeight,
    verticalAlign,
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

    let overlayStyle = null;
    if (bgType === "image" && bgImage && overlayType !== "none") {
      if (overlayType === "gradient") {
        overlayStyle = {
          backgroundImage: `linear-gradient(${overlayDirection}, ${overlayColorFrom}, ${overlayColorTo})`,
          opacity: parseFloat(overlayOpacity),
        };
      } else {
        overlayStyle = { backgroundColor: overlayColor, opacity: parseFloat(overlayOpacity) };
      }
    }

    return (
      <section
        className={`relative ${bgType === "gradient" ? "bg-gradient-to-br from-[#354e98] to-[#4a71df]" : ""}`}
        style={{
          minHeight: minHeight === "auto" ? undefined : minHeight,
          display: "flex",
          alignItems: verticalAlign,
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
        {overlayStyle && <div className="absolute inset-0" style={overlayStyle} />}
        <div
          className="relative mx-auto grid w-full"
          style={{ maxWidth: contentWidth, gridTemplateColumns: layout.grid, gap: columnGap }}
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
