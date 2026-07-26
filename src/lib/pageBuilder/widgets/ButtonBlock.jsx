// src/lib/pageBuilder/widgets/ButtonBlock.jsx
"use client";

import Link from "next/link";
import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

export const ButtonBlock = {
  label: "Button",
  fields: {
    text: { type: "text", label: "Button Text" },
    href: { type: "text", label: "Link URL" },
    variant: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Filled", value: "filled" },
        { label: "Outline", value: "outline" },
      ],
    },
    size: {
      type: "select",
      label: "Text Size",
      options: [
        { label: "Small", value: "text-sm" },
        { label: "Medium", value: "text-base" },
        { label: "Large", value: "text-lg" },
      ],
    },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Auto", value: "inline-block" },
        { label: "Full width", value: "block w-full text-center" },
      ],
    },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
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
    text: "Get Started",
    href: "/",
    variant: "filled",
    size: "text-base",
    width: "inline-block",
    align: "left",
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "24px",
    paddingRight: "24px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({
    text,
    href,
    variant,
    size,
    width,
    align,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
  }) => {
    const base = `${width} ${size} rounded-md font-medium transition`;
    const styles =
      variant === "filled"
        ? `${base} bg-blue-600 text-white hover:bg-blue-700`
        : `${base} border-2 border-blue-600 text-blue-600 hover:bg-blue-50`;
    return (
      <div style={{ textAlign: align, marginTop, marginBottom }}>
        <Link href={href || "#"} className={styles} style={{ paddingTop, paddingBottom, paddingLeft, paddingRight }}>
          {text}
        </Link>
      </div>
    );
  },
};
