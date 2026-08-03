// src/lib/pageBuilder/widgets/ButtonBlock.jsx
"use client";

import Link from "next/link";
import { TEXT_SIZE_PRESETS, TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

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
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Auto", value: "inline-block" },
        { label: "Full width", value: "block w-full text-center" },
      ],
    },
    size: responsiveField("Text Size", TEXT_SIZE_PRESETS),
    align: responsiveField("Alignment", TEXT_ALIGN_PRESETS),
    // "Padding" here is the clickable button's own inner spacing (how
    // "chunky" it looks); "Margin" is the gap between the button and
    // whatever's next to it.
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "button-default",
    text: "Get Started",
    href: "/",
    variant: "filled",
    width: "inline-block",
    size: { desktop: "1rem" },
    align: { desktop: "left" },
    padding: {
      top: { desktop: "12px" },
      right: { desktop: "24px" },
      bottom: { desktop: "12px" },
      left: { desktop: "24px" },
      linked: false,
    },
    margin: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "0px" },
      left: { desktop: "0px" },
      linked: false,
    },
  },
  render: ({ id, text, href, variant, width, size, align, padding, margin }) => {
    const scopedClass = `pb-button-${id}`;
    const base = `${width} rounded-md font-medium transition ${scopedClass}`;
    const styles =
      variant === "filled"
        ? `${base} bg-blue-600 text-white hover:bg-blue-700`
        : `${base} border-2 border-blue-600 text-blue-600 hover:bg-blue-50`;
    return (
      <div className={`${scopedClass}-wrap`}>
        <ResponsiveStyle className={`${scopedClass}-wrap`} entries={[{ property: "text-align", value: align }]} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "font-size", value: size },
            ...spacingBoxToEntries("padding", padding),
            ...spacingBoxToEntries("margin", margin),
          ]}
        />
        <Link href={href || "#"} className={styles}>
          {text}
        </Link>
      </div>
    );
  },
};
