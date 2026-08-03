// src/lib/pageBuilder/widgets/HtmlBlock.jsx
"use client";

import { TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { ResponsiveStyle, alignToJustifyEntries } from "../fields/responsiveStyle";
import { spacingBoxField, spacingBoxToEntries } from "../fields/spacingBoxField";

// Escape hatch for anything the visual widgets don't cover — paste raw
// HTML (embeds, custom markup, third-party widgets, etc). Renders via
// dangerouslySetInnerHTML, so only use this with HTML you trust; it's an
// admin-only tool, not user-submitted content.
export const HtmlBlock = {
  label: "HTML Block",
  fields: {
    html: { type: "textarea", label: "HTML Code" },
    // Note: Block Alignment only has a visible effect if your HTML itself
    // sets an explicit width (e.g. a <div style="width:400px">) — a
    // wrapper can't force positioning onto content that's already
    // stretching to fill 100% of the available width.
    blockAlign: responsiveField("Block Alignment (position within column)", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "htmlblock-default",
    html: "<div style=\"padding:16px;border:1px dashed #ccc;\">Your custom HTML here</div>",
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
  render: ({ id, html, blockAlign, padding, margin }) => {
    const scopedClass = `pb-html-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    return (
      <>
        <ResponsiveStyle className={wrapClass} entries={alignToJustifyEntries(blockAlign)} />
        <ResponsiveStyle
          className={scopedClass}
          entries={[...spacingBoxToEntries("padding", padding), ...spacingBoxToEntries("margin", margin)]}
        />
        <div className={wrapClass}>
          <div className={scopedClass} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </>
    );
  },
};
