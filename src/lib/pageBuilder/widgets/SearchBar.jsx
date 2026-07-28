// src/lib/pageBuilder/widgets/SearchBar.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

export const SearchBar = {
  label: "Search Bar",
  fields: {
    placeholder: { type: "text", label: "Placeholder Text" },
    buttonText: { type: "text", label: "Button Text" },
    searchPath: { type: "text", label: "Search Results Path (e.g. /search)" },
    maxWidth: {
      type: "select",
      label: "Max Width",
      options: [
        { label: "Narrow", value: "max-w-md" },
        { label: "Medium", value: "max-w-lg" },
        { label: "Wide", value: "max-w-xl" },
        { label: "Full", value: "max-w-full" },
      ],
    },
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    placeholder: "Search courses, topics, practice tests...",
    buttonText: "Search",
    searchPath: "/search",
    maxWidth: "max-w-lg",
    marginTop: "0px",
    marginBottom: "20px",
  },
  render: function SearchBarRender({ placeholder, buttonText, searchPath, maxWidth, marginTop, marginBottom }) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    function handleSubmit(e) {
      e.preventDefault();
      router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={`flex items-center rounded-xl bg-white px-4 py-2 ${maxWidth}`}
        style={{ marginTop, marginBottom }}
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
    );
  },
};
