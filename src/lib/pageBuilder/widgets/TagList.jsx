// src/lib/pageBuilder/widgets/TagList.jsx
"use client";

import Link from "next/link";
import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

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
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    items: [
      { text: "Writing Task 2", href: "/search?q=Writing Task 2" },
      { text: "Speaking Band 7", href: "/search?q=Speaking Band 7" },
      { text: "Listening Tips", href: "/search?q=Listening Tips" },
      { text: "Reading Strategies", href: "/search?q=Reading Strategies" },
      { text: "Mock Tests", href: "/search?q=Mock Tests" },
    ],
    style: "translucent",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({ items, style, marginTop, marginBottom }) => {
    const styleClasses =
      style === "translucent"
        ? "border border-white/25 bg-white/10 text-white/85 hover:bg-white/20"
        : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100";
    return (
      <div className="flex flex-wrap gap-2" style={{ marginTop, marginBottom }}>
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
    );
  },
};
