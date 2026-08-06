// src/lib/pageBuilder/widgets/SearchBar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TEXT_ALIGN_PRESETS,
  INLINE_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import {
  ResponsiveStyle,
  alignToJustifyEntries,
} from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import { useThemeColors } from "../theme/ThemeColorsContext";

export const SearchBar = {
  label: "Search Bar",
  fields: {
    placeholder: { type: "text", label: "Placeholder Text" },
    buttonText: { type: "text", label: "Button Text" },
    searchPath: { type: "text", label: "Search Results Path (e.g. /search)" },
    width: responsiveField("Width", INLINE_WIDTH_PRESETS),
    blockAlign: responsiveField(
      "Block Alignment (position within column)",
      TEXT_ALIGN_PRESETS,
    ),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "searchbar-default",
    placeholder: "Search courses, topics, practice tests...",
    buttonText: "Search",
    searchPath: "/search",
    width: { desktop: "32rem" },
    blockAlign: { desktop: "left" },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "20" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
    ...borderDefaultProps(),
    borderRadius: {
      topLeft: { desktop: "12px" },
      topRight: { desktop: "12px" },
      bottomRight: { desktop: "12px" },
      bottomLeft: { desktop: "12px" },
      linked: true,
    },
    ...hoverDefaultProps(),
  },
  render: function SearchBarRender({
    id,
    placeholder,
    buttonText,
    searchPath,
    width,
    blockAlign,
    margin,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    hoverEnabled,
    hoverBgColor,
    hoverTextColor,
    hoverBorderColor,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverTranslateY,
    hoverRotate,
    hoverShadow,
    hoverGrayscaleToColor,
    hoverTransitionMs,
  }) {
    const router = useRouter();
    const { themeColors } = useThemeColors();
    const [query, setQuery] = useState("");
    const scopedClass = `pb-searchbar-${id}`;
    const wrapClass = `${scopedClass}-wrap`;

    const hoverCss = buildHoverCss(
      scopedClass,
      {
        hoverEnabled,
        hoverBgColor,
        hoverTextColor,
        hoverBorderColor,
        hoverOpacity,
        hoverScale,
        hoverTranslateX,
        hoverTranslateY,
        hoverRotate,
        hoverShadow,
        hoverGrayscaleToColor,
        hoverTransitionMs,
      },
      themeColors,
    );

    function handleSubmit(e) {
      e.preventDefault();
      router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
    }

    return (
      <>
        <ResponsiveStyle
          className={wrapClass}
          entries={alignToJustifyEntries(blockAlign)}
        />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "max-width", value: width },
            ...spacingBoxToEntries("margin", margin),
            ...borderToEntries({
              borderWidth,
              borderStyle,
              borderColor,
              borderRadius,
            }),
          ]}
        />
        {hoverCss && <style>{hoverCss}</style>}
        <div className={wrapClass}>
          <form
            onSubmit={handleSubmit}
            className={`flex items-center bg-white px-4 py-2 w-full ${scopedClass}`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shrink-0"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </>
    );
  },
};
