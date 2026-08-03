// src/lib/pageBuilder/widgets/Icon.jsx
"use client";

import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField } from "../fields/colorField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

const CONTAINER_SIZES = {
  small: { box: "w-12 h-12", text: "text-xl" },
  medium: { box: "w-16 h-16", text: "text-3xl" },
  large: { box: "w-20 h-20", text: "text-4xl" },
};

// Standalone icon element using Tabler Icons (already loaded via CDN in
// your root layout.js). Optionally wraps the icon in a circular badge —
// a very common pattern for feature/stat grids (icon inside a soft
// translucent or solid-color circle).
export const IconBlock = {
  label: "Icon",
  fields: {
    icon: { type: "text", label: "Icon Class (e.g. ti-star)" },
    size: {
      type: "select",
      label: "Size (when no container)",
      options: [
        { label: "Small", value: "text-2xl" },
        { label: "Medium", value: "text-3xl" },
        { label: "Large", value: "text-4xl" },
        { label: "X-Large", value: "text-5xl" },
      ],
    },
    color: colorField("Icon Color", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Gray", value: "#6b7280" },
    ]),
    containerStyle: {
      type: "radio",
      label: "Container",
      options: [
        { label: "None (bare icon)", value: "none" },
        { label: "Circle — Translucent White", value: "circle-translucent" },
        { label: "Circle — Solid Brand Blue", value: "circle-brand" },
        { label: "Circle — Light Gray", value: "circle-light" },
      ],
    },
    containerSize: {
      type: "select",
      label: "Container Size",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
      ],
    },
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "icon-default",
    icon: "ti-star",
    size: "text-4xl",
    color: "#2563eb",
    containerStyle: "none",
    containerSize: "medium",
    blockAlign: { desktop: "left" },
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
  render: ({ id, icon, size, color, containerStyle, containerSize, blockAlign, padding, margin }) => {
    const scopedClass = `pb-icon-${id}`;
    const wrapClass = `${scopedClass}-wrap`;

    const containerClasses = {
      "circle-translucent": "bg-white/15",
      "circle-brand": "bg-blue-600",
      "circle-light": "bg-gray-100",
    };
    const hasContainer = containerStyle !== "none";
    const dims = CONTAINER_SIZES[containerSize] || CONTAINER_SIZES.medium;

    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[...spacingBoxToEntries("padding", padding), ...spacingBoxToEntries("margin", margin)]}
        />
        <div className={wrapClass}>
          <div className={scopedClass}>
            {hasContainer ? (
              <div className={`${dims.box} rounded-full ${containerClasses[containerStyle]} flex items-center justify-center`}>
                <i className={`ti ${icon} ${dims.text}`} style={{ color }} />
              </div>
            ) : (
              <i className={`ti ${icon} ${size}`} style={{ color }} />
            )}
          </div>
        </div>
      </>
    );
  },
};
