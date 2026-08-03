// src/lib/pageBuilder/widgets/SearchBar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEXT_ALIGN_PRESETS, INLINE_WIDTH_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

export const SearchBar = {
  label: "Search Bar",
  fields: {
    placeholder: { type: "text", label: "Placeholder Text" },
    buttonText: { type: "text", label: "Button Text" },
    searchPath: { type: "text", label: "Search Results Path (e.g. /search)" },
    // --- Responsive fields ---
    // Rebuilt on the same responsiveField system as everything else
    // (was previously a plain fixed-class select that wasn't reliably
    // reflecting the selected width) — now has a working Custom... option too.
    width: responsiveField("Width", INLINE_WIDTH_PRESETS),
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "searchbar-default",
    placeholder: "Search courses, topics, practice tests...",
    buttonText: "Search",
    searchPath: "/search",
    width: { desktop: "32rem" },
    blockAlign: { desktop: "left" },
    margin: {
      top: { desktop: "0px" },
      right: { desktop: "0px" },
      bottom: { desktop: "20px" },
      left: { desktop: "0px" },
      linked: false,
    },
  },
  render: function SearchBarRender({ id, placeholder, buttonText, searchPath, width, blockAlign, margin }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const scopedClass = `pb-searchbar-${id}`;
    const wrapClass = `${scopedClass}-wrap`;

    function handleSubmit(e) {
      e.preventDefault();
      router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
    }

    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[{ property: "max-width", value: width }, ...spacingBoxToEntries("margin", margin)]}
        />
        <div className={wrapClass}>
          <form
            onSubmit={handleSubmit}
            className={`flex items-center rounded-xl bg-white px-4 py-2 w-full ${scopedClass}`}
          >
            <svg className="mr-3 h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
