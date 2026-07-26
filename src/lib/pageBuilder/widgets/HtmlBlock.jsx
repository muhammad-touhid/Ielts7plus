// src/lib/pageBuilder/widgets/HtmlBlock.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

// Escape hatch for anything the visual widgets don't cover — paste raw
// HTML (embeds, custom markup, third-party widgets, etc). Renders via
// dangerouslySetInnerHTML, so only use this with HTML you trust; it's an
// admin-only tool, not user-submitted content.
export const HtmlBlock = {
  label: "HTML Block",
  fields: {
    html: { type: "textarea", label: "HTML Code" },
    paddingTop: flexibleSizeField("Padding Top", SPACING_PRESETS),
    paddingBottom: flexibleSizeField("Padding Bottom", SPACING_PRESETS),
    paddingLeft: flexibleSizeField("Padding Left", SPACING_PRESETS),
    paddingRight: flexibleSizeField("Padding Right", SPACING_PRESETS),
    marginTop: flexibleSizeField("Margin Top", SPACING_PRESETS),
    marginBottom: flexibleSizeField("Margin Bottom", SPACING_PRESETS),
  },
  defaultProps: {
    html: "<div style=\"padding:16px;border:1px dashed #ccc;\">Your custom HTML here</div>",
    paddingTop: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "0px",
    marginTop: "0px",
    marginBottom: "0px",
  },
  render: ({ html, paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }) => (
    <div
      style={{ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ),
};
