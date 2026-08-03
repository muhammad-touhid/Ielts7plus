// src/lib/pageBuilder/widgets/TagList.jsx
"use client";

import Link from "next/link";
import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

// Row of pill-shaped links — quick topic/tag navigation, commonly used
// under a hero heading or search bar.
export const TagList = {
  label: "Tag List",
  fields: {
    items: {
      type: "array",
      label: "Tags",
      arrayFields: {
        text: { type: "text", label: "Tag Text" },
        href: { type: "text", label: "Link" },
      },
      defaultItemProps: { text: "Tag", href: "/search?q=Tag" },
      getItemSummary: (item) => item.text || "Tag",
    },
    style: {
      type: "radio",
      label: "Style",
      options: [
        { label: "Translucent (for dark backgrounds)", value: "translucent" },
        { label: "Light (for light backgrounds)", value: "light" },
      ],
    },
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "taglist-default",
    items: [
      { text: "Writing Task 2", href: "/search?q=Writing Task 2" },
      { text: "Speaking Band 7", href: "/search?q=Speaking Band 7" },
      { text: "Listening Tips", href: "/search?q=Listening Tips" },
      { text: "Reading Strategies", href: "/search?q=Reading Strategies" },
      { text: "Mock Tests", href: "/search?q=Mock Tests" },
    ],
    style: "translucent",
    blockAlign: { desktop: "left" },
    margin: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "0px" },
      left: { desktop: "0px" },
      linked: false,
    },
  },
  render: ({ id, items, style, blockAlign, margin }) => {
    const scopedClass = `pb-taglist-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const styleClasses =
      style === "translucent"
        ? "border border-white/25 bg-white/10 text-white/85 hover:bg-white/20"
        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100";
    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle className={scopedClass} entries={spacingBoxToEntries("margin", margin)} />
        <div className={wrapClass}>
          <div className={`flex flex-wrap gap-2 ${scopedClass}`}>
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href || "#"}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${styleClasses}`}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  },
};
