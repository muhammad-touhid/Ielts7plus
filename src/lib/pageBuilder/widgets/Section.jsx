"use client";

import { DropZone } from "@measured/puck";
import { useEffect, useState } from "react";
import ImageUpload from "@/app/admin/ImageUpload";
import { withLabel } from "../fields/withLabel";
import {
  flexibleSizeField,
  HEIGHT_PRESETS,
  GAP_PRESETS,
  CONTENT_WIDTH_PRESETS,
} from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import { colorField, resolveColor } from "../fields/colorField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";
import { useThemeColors } from "../theme/ThemeColorsContext";

const COLUMN_LAYOUTS = {
  1: { label: "1 Column", className: "grid-cols-1", count: 1 },
  "2-equal": {
    label: "2 Columns (50 / 50)",
    className: "grid-cols-1 md:grid-cols-2",
    count: 2,
  },
  "2-narrow-wide": {
    label: "2 Columns (30 / 70)",
    className: "grid-cols-1 md:grid-cols-[3fr_7fr]",
    count: 2,
  },
  "2-wide-narrow": {
    label: "2 Columns (70 / 30)",
    className: "grid-cols-1 md:grid-cols-[7fr_3fr]",
    count: 2,
  },
  "3-equal": {
    label: "3 Columns (equal)",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    count: 3,
  },
  "4-equal": {
    label: "4 Columns (equal)",
    className: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    count: 4,
  },
};

const GRADIENT_DIRECTIONS = {
  "to right": "to right",
  "to bottom right": "to bottom right",
  "to bottom": "to bottom",
  "to bottom left": "to bottom left",
  "to left": "to left",
};

const BG_GRADIENT_DIRECTION_CLASS = {
  "to right": "bg-gradient-to-r",
  "to bottom right": "bg-gradient-to-br",
  "to bottom": "bg-gradient-to-b",
  "to bottom left": "bg-gradient-to-bl",
  "to left": "bg-gradient-to-l",
};

const COLUMN_ALIGN_CSS = {
  stretch: "stretch",
  top: "start",
  center: "center",
  bottom: "end",
};

function countCustomColumns(template) {
  const count = (template || "").trim().split(/\s+/).filter(Boolean).length;
  return count > 0 ? count : 1;
}

function normalizeColumns(value) {
  if (value && typeof value === "object") return value;
  return { mode: "preset", value: value || "1" };
}

const COLUMN_TRACK_UNITS = ["fr", "px", "%", "rem", "em", "vw"];

// Parses "1fr 2fr 1fr" into [{num:"1",unit:"fr"}, {num:"2",unit:"fr"}, {num:"1",unit:"fr"}].
// Unparseable tokens fall back to 1fr rather than being dropped, so a
// weird manually-typed value never collapses the column count.
function parseColumnTracks(template) {
  const tokens = (template || "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0)
    return [
      { num: "1", unit: "fr" },
      { num: "1", unit: "fr" },
    ];
  return tokens.map((t) => {
    const match = /^(-?\d*\.?\d+)\s*(fr|px|%|rem|em|vw)$/.exec(t);
    return match ? { num: match[1], unit: match[2] } : { num: "1", unit: "fr" };
  });
}

function stringifyColumnTracks(tracks) {
  return tracks.map((t) => `${t.num || 0}${t.unit}`).join(" ");
}

function columnLayoutField() {
  return {
    type: "custom",
    label: "Column Layout",
    render: withLabel(function ColumnLayoutInput({ value, onChange }) {
      const normalized = normalizeColumns(value);
      const [forceCustom, setForceCustom] = useState(
        normalized.mode === "custom",
      );
      const showCustom = forceCustom || normalized.mode === "custom";
      const tracks = parseColumnTracks(
        normalized.mode === "custom" ? normalized.value : "1fr 1fr",
      );

      function selectPreset(key) {
        setForceCustom(false);
        onChange({ mode: "preset", value: key });
      }

      function enableCustom() {
        setForceCustom(true);
        onChange({
          mode: "custom",
          value: normalized.mode === "custom" ? normalized.value : "1fr 1fr",
        });
      }

      function commitTracks(nextTracks) {
        onChange({ mode: "custom", value: stringifyColumnTracks(nextTracks) });
      }

      function updateTrackNum(i, num) {
        const next = tracks.map((t, idx) => (idx === i ? { ...t, num } : t));
        commitTracks(next);
      }

      function updateTrackUnit(i, unit) {
        const next = tracks.map((t, idx) => (idx === i ? { ...t, unit } : t));
        commitTracks(next);
      }

      function addTrack() {
        commitTracks([...tracks, { num: "1", unit: "fr" }]);
      }

      function removeTrack(i) {
        if (tracks.length <= 1) return; // keep at least one column
        commitTracks(tracks.filter((_, idx) => idx !== i));
      }

      return (
        <div className="space-y-1">
          <select
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            value={showCustom ? "__custom__" : normalized.value}
            onChange={(e) => {
              if (e.target.value === "__custom__") enableCustom();
              else selectPreset(e.target.value);
            }}
          >
            {Object.entries(COLUMN_LAYOUTS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
            <option value="__custom__">Custom...</option>
          </select>
          {showCustom && (
            <div className="space-y-1">
              {tracks.map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={t.num}
                    onChange={(e) => updateTrackNum(i, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                  />
                  <select
                    value={t.unit}
                    onChange={(e) => updateTrackUnit(i, e.target.value)}
                    className="w-[52px] border border-gray-300 rounded-md px-1 py-1.5 text-sm bg-white shrink-0"
                  >
                    {COLUMN_TRACK_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeTrack(i)}
                    disabled={tracks.length <= 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400 text-xs border border-gray-300 rounded px-1.5 py-1.5 shrink-0"
                    title="Remove column"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTrack}
                className="w-full text-xs text-blue-600 border border-dashed border-gray-300 rounded-md py-1.5 hover:bg-blue-50"
              >
                + Add Column
              </button>
            </div>
          )}
        </div>
      );
    }),
  };
}

function baseFields() {
  return {
    columns: columnLayoutField(),
    columnGap: flexibleSizeField("Column Gap", GAP_PRESETS),
    columnAlign: {
      type: "select",
      label: "Column Vertical Alignment",
      options: [
        { label: "Stretch (default)", value: "stretch" },
        { label: "Top", value: "top" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "bottom" },
      ],
    },
    bgType: {
      type: "radio",
      label: "Background Type",
      options: [
        { label: "Color", value: "color" },
        { label: "Image", value: "image" },
        { label: "Brand Gradient", value: "gradient" },
      ],
    },
    bgColor: colorField("Background Color", [
      { label: "Transparent", value: "transparent" },
      { label: "White", value: "#ffffff" },
      { label: "Light gray", value: "#f9fafb" },
      { label: "Dark", value: "#111827" },
      { label: "Brand blue", value: "#354e98" },
    ]),
    bgImage: {
      type: "custom",
      label: "Background Image",
      render: withLabel(({ value, onChange }) => (
        <ImageUpload value={value} onChange={(url) => onChange(url)} />
      )),
    },
    bgGradientDirection: {
      type: "select",
      label: "Background Gradient Direction",
      options: Object.keys(GRADIENT_DIRECTIONS).map((k) => ({
        label: k,
        value: k,
      })),
    },
    decorative: {
      type: "radio",
      label: "Decorative Background",
      options: [
        { label: "None", value: "none" },
        { label: "Grid Pattern", value: "grid" },
        { label: "Grid Pattern + Blobs", value: "grid-blobs" },
      ],
    },
    overlayType: {
      type: "radio",
      label: "Overlay Type",
      options: [
        { label: "None", value: "none" },
        { label: "Solid Color", value: "solid" },
        { label: "Gradient (2 colors)", value: "gradient" },
      ],
    },
    overlayColor: colorField("Overlay Color", [
      { label: "Black", value: "#000000" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#354e98" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayColorFrom: colorField("Overlay Gradient — From", [
      { label: "Navy (blue-900)", value: "#1e3a8a" },
      { label: "Brand blue", value: "#354e98" },
      { label: "Black", value: "#000000" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayColorTo: colorField("Overlay Gradient — To", [
      { label: "Blue (blue-700)", value: "#1d4ed8" },
      { label: "Brand blue light", value: "#4a71df" },
      { label: "Transparent-ish black", value: "#111827" },
      { label: "Dark navy", value: "#0f172a" },
    ]),
    overlayDirection: {
      type: "select",
      label: "Overlay Gradient Direction",
      options: Object.keys(GRADIENT_DIRECTIONS).map((k) => ({
        label: k,
        value: k,
      })),
    },
    overlayOpacity: {
      type: "select",
      label: "Overlay Opacity",
      options: [
        { label: "Light (30%)", value: "0.3" },
        { label: "Medium (55%)", value: "0.55" },
        { label: "Dark (75%)", value: "0.75" },
        { label: "Very Dark (90%)", value: "0.9" },
      ],
    },
    minHeight: flexibleSizeField("Min Height", HEIGHT_PRESETS),
    verticalAlign: {
      type: "radio",
      label: "Vertical Alignment",
      options: [
        { label: "Top", value: "flex-start" },
        { label: "Center", value: "center" },
        { label: "Bottom", value: "flex-end" },
      ],
    },
    contentWidth: responsiveField("Content Width", CONTENT_WIDTH_PRESETS),
    contentAlign: {
      type: "radio",
      label: "Content Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    stickyMode: {
      type: "radio",
      label: "Position (for headers/sticky bars)",
      options: [
        { label: "Normal (default)", value: "static" },
        { label: "Sticky (sticks after scrolling to it)", value: "sticky" },
        { label: "Fixed (always pinned to top)", value: "fixed" },
      ],
    },
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    ...hoverFieldSet(),
    shadow: shadowField(),
  };
}

// IMPORTANT: this runs exactly ONCE, at module load — NOT inside
// resolveFields. That's the whole fix. Every custom field's `render`
// function (colorField, flexibleSizeField, columnLayoutField, etc.)
// gets created here a single time and reused for the component's
// entire lifetime, so React sees the SAME function reference across
// renders and keeps the input mounted instead of tearing it down.
//
// The bug this fixes: resolveFields runs on every keystroke (Puck
// calls it on every prop change). Calling baseFields() again INSIDE
// resolveFields — which is what an earlier version of this file did —
// creates brand-new field objects, including brand-new `render`
// function closures, every single call. React uses function identity
// to decide whether to keep a DOM node mounted or remount it; a "new"
// render function every keystroke means every custom field's input
// remounts and loses focus after exactly one character, for every
// custom field on this component, not just one.
const STATIC_FIELDS = baseFields();

// Same reasoning — these conditionally-shown fields must also be built
// exactly once, not recreated inside resolveFields, or they'd have the
// identical remount bug the moment stickyMode is active.
const SCROLL_BG_COLOR_FIELD = colorField(
  "Background After Scroll (color-type backgrounds only)",
  [
    { label: "White", value: "#ffffff" },
    { label: "Dark", value: "#111827" },
    { label: "Brand blue", value: "#354e98" },
  ],
);
const SCROLL_THRESHOLD_FIELD = {
  type: "number",
  label: "Scroll Distance Before Swap (px)",
};
const INITIAL_TEXT_COLOR_FIELD = colorField(
  'Text Color Before Scroll (for children set to "Inherit")',
  [
    { label: "White", value: "#ffffff" },
    { label: "Dark", value: "#111827" },
    { label: "Brand blue", value: "#354e98" },
  ],
);
const SCROLL_TEXT_COLOR_FIELD = colorField(
  'Text Color After Scroll (for children set to "Inherit")',
  [
    { label: "Dark", value: "#111827" },
    { label: "White", value: "#ffffff" },
    { label: "Brand blue", value: "#354e98" },
  ],
);
const INITIAL_HOVER_COLOR_FIELD = colorField(
  'Hover Color Before Scroll (for children set to "Inherit")',
  [
    { label: "White", value: "#ffffff" },
    { label: "Brand blue", value: "#2563eb" },
    { label: "Red accent", value: "#f87171" },
  ],
);
const SCROLL_HOVER_COLOR_FIELD = colorField(
  'Hover Color After Scroll (for children set to "Inherit")',
  [
    { label: "Brand blue", value: "#2563eb" },
    { label: "White", value: "#ffffff" },
    { label: "Red accent", value: "#f87171" },
  ],
);

export const Section = {
  label: "Section",
  fields: STATIC_FIELDS,
  // Uses the `fields` param Puck passes in (the SAME stable
  // STATIC_FIELDS reference) instead of recomputing baseFields() from
  // scratch — that reuse is what keeps every field's identity stable
  // across renders, which is what keeps inputs focused while typing.
  resolveFields: (data, { fields }) => {
    if (data.props.stickyMode && data.props.stickyMode !== "static") {
      return {
        ...fields,
        scrollBgColor: SCROLL_BG_COLOR_FIELD,
        scrollThreshold: SCROLL_THRESHOLD_FIELD,
        initialTextColor: INITIAL_TEXT_COLOR_FIELD,
        scrollTextColor: SCROLL_TEXT_COLOR_FIELD,
        initialHoverColor: INITIAL_HOVER_COLOR_FIELD,
        scrollHoverColor: SCROLL_HOVER_COLOR_FIELD,
      };
    }
    return fields;
  },
  defaultProps: {
    id: "section-default",
    columns: "1",
    columnGap: "32px",
    columnAlign: "stretch",
    bgType: "color",
    bgColor: "transparent",
    bgImage: "",
    bgGradientDirection: "to bottom right",
    decorative: "none",
    overlayType: "none",
    overlayColor: "#000000",
    overlayColorFrom: "#1e3a8a",
    overlayColorTo: "#1d4ed8",
    overlayDirection: "to right",
    overlayOpacity: "0.5",
    minHeight: "auto",
    verticalAlign: "flex-start",
    contentWidth: { desktop: "72rem" },
    contentAlign: "center",
    stickyMode: "static",
    scrollBgColor: "#ffffff",
    scrollThreshold: 10,
    initialTextColor: "#ffffff",
    scrollTextColor: "#111827",
    initialHoverColor: "#ffffff",
    scrollHoverColor: "#2563eb",
    padding: {
      top: { desktop: "64", tablet: "40", mobile: "32" },
      right: { desktop: "24" },
      bottom: { desktop: "64", tablet: "40", mobile: "32" },
      left: { desktop: "24" },
      linked: false,
      unit: "px",
    },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "0" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
    ...borderDefaultProps(),
    ...hoverDefaultProps(),
    ...shadowDefaultProps(),
  },
  render: function SectionRender({
    id,
    columns,
    columnGap,
    columnAlign,
    bgType,
    bgColor,
    bgImage,
    bgGradientDirection,
    decorative,
    overlayType,
    overlayColor,
    overlayColorFrom,
    overlayColorTo,
    overlayDirection,
    overlayOpacity,
    minHeight,
    verticalAlign,
    contentWidth,
    contentAlign = "center",
    stickyMode = "static",
    scrollBgColor,
    scrollThreshold = 10,
    initialTextColor,
    scrollTextColor,
    initialHoverColor,
    scrollHoverColor,
    padding,
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
    shadow,
  }) {
    const { themeColors } = useThemeColors();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      if (stickyMode === "static") return;
      function handleScroll() {
        setScrolled(window.scrollY > (scrollThreshold || 10));
      }
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [stickyMode, scrollThreshold]);

    const columnsNormalized = normalizeColumns(columns);
    const isCustomColumns = columnsNormalized.mode === "custom";
    const layout = isCustomColumns
      ? { className: "", count: countCustomColumns(columnsNormalized.value) }
      : COLUMN_LAYOUTS[columnsNormalized.value] || COLUMN_LAYOUTS["1"];
    const count = layout.count;
    const scopedClass = `pb-section-${id}`;

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

    const effectiveBgColor =
      stickyMode !== "static" && scrolled && bgType === "color"
        ? scrollBgColor
        : bgColor;
    const resolvedBgColor = resolveColor(effectiveBgColor, themeColors);

    const effectiveTextColor =
      stickyMode !== "static"
        ? scrolled
          ? scrollTextColor
          : initialTextColor
        : undefined;
    const resolvedTextColor = effectiveTextColor
      ? resolveColor(effectiveTextColor, themeColors)
      : undefined;

    const effectiveHoverColor =
      stickyMode !== "static"
        ? scrolled
          ? scrollHoverColor
          : initialHoverColor
        : undefined;
    const resolvedHoverColor = effectiveHoverColor
      ? resolveColor(effectiveHoverColor, themeColors)
      : undefined;

    let overlayStyle = null;
    if (bgType === "image" && bgImage && overlayType !== "none") {
      if (overlayType === "gradient") {
        overlayStyle = {
          backgroundImage: `linear-gradient(${overlayDirection}, ${resolveColor(overlayColorFrom, themeColors)}, ${resolveColor(overlayColorTo, themeColors)})`,
          opacity: parseFloat(overlayOpacity),
        };
      } else {
        overlayStyle = {
          backgroundColor: resolveColor(overlayColor, themeColors),
          opacity: parseFloat(overlayOpacity),
        };
      }
    }

    const gradientClass =
      BG_GRADIENT_DIRECTION_CLASS[bgGradientDirection] || "bg-gradient-to-br";

    const contentAlignMargin =
      contentAlign === "left"
        ? { marginLeft: 0, marginRight: "auto" }
        : contentAlign === "right"
          ? { marginLeft: "auto", marginRight: 0 }
          : { marginLeft: "auto", marginRight: "auto" };

    const positionStyle =
      stickyMode === "sticky"
        ? { position: "sticky", top: 0, zIndex: 100 }
        : stickyMode === "fixed"
          ? { position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100 }
          : {};

    return (
      <section
        className={`relative ${scopedClass} ${bgType === "gradient" ? `${gradientClass} from-[#354e98] to-[#4a71df]` : ""}`}
        style={{
          minHeight: minHeight === "auto" ? undefined : minHeight,
          display: "flex",
          overflow: stickyMode === "static" ? "hidden" : "visible",
          alignItems: verticalAlign,
          backgroundColor: bgType === "color" ? resolvedBgColor : undefined,
          backgroundImage:
            bgType === "image" && bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: resolveShadow(shadow) || undefined,
          transition:
            stickyMode !== "static" ? "background-color 0.25s ease" : undefined,
          ...(resolvedTextColor
            ? { "--pb-scroll-text-color": resolvedTextColor }
            : {}),
          ...(resolvedHoverColor
            ? { "--pb-scroll-hover-color": resolvedHoverColor }
            : {}),
          ...positionStyle,
        }}
      >
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            ...spacingBoxToEntries("padding", padding),
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
        {overlayStyle && (
          <div className="absolute inset-0" style={overlayStyle} />
        )}

        {(decorative === "grid" || decorative === "grid-blobs") && (
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        )}
        {decorative === "grid-blobs" && (
          <>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </>
        )}
        <div
          className={`relative grid w-full ${layout.className} ${scopedClass}-content`}
          style={{
            gap: columnGap,
            alignItems: COLUMN_ALIGN_CSS[columnAlign] || "stretch",
            ...contentAlignMargin,
          }}
        >
          <ResponsiveStyle
            className={`${scopedClass}-content`}
            entries={[
              { property: "max-width", value: contentWidth },
              ...(isCustomColumns
                ? [
                    {
                      property: "grid-template-columns",
                      value: {
                        desktop: columnsNormalized.value || "1fr",
                        mobile: "1fr",
                      },
                    },
                  ]
                : []),
            ]}
          />
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="min-w-0">
              <DropZone zone={`col-${i}`} />
            </div>
          ))}
        </div>
      </section>
    );
  },
};
