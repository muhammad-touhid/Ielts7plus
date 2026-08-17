// src/lib/pageBuilder/fields/carouselHeaderField.js
"use client";

import { colorField, resolveColor } from "./colorField";
import { flexibleSizeField } from "./flexibleSize";

const EYEBROW_SIZE_PRESETS = [
  { label: "Small", value: "0.6875rem" },
  { label: "Medium", value: "0.75rem" },
  { label: "Large", value: "0.875rem" },
];

const HEADING_SIZE_PRESETS = [
  { label: "Small", value: "1.5rem" },
  { label: "Medium", value: "1.875rem" },
  { label: "Large", value: "2.25rem" },
  { label: "X-Large", value: "3rem" },
];

const SUBHEADING_SIZE_PRESETS = [
  { label: "Small", value: "0.8125rem" },
  { label: "Medium", value: "0.875rem" },
  { label: "Large", value: "1rem" },
];

const SEEALL_SIZE_PRESETS = [
  { label: "Small", value: "0.75rem" },
  { label: "Medium", value: "0.875rem" },
  { label: "Large", value: "1rem" },
];

// Styles the Carousel widget's own header row (eyebrow/heading/
// subheading/see-all/arrows) — separate from the card-style vars, which
// only affect the cards themselves.
export function carouselHeaderFieldSet() {
  return {
    eyebrowBg: colorField("Eyebrow Background", [
      { label: "Sky (default)", value: "#e0f2fe" },
      { label: "White", value: "#ffffff" },
      { label: "Dark", value: "#111827" },
    ]),
    eyebrowColor: colorField("Eyebrow Text Color", [
      { label: "Brand blue (default)", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
    ]),
    eyebrowSize: flexibleSizeField("Eyebrow Size", EYEBROW_SIZE_PRESETS),
    headingColor: colorField("Heading Color", [
      { label: "Dark (default)", value: "#1e293b" },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
    ]),
    headingSize: flexibleSizeField("Heading Size", HEADING_SIZE_PRESETS),
    subheadingColor: colorField("Subheading Color", [
      { label: "Gray (default)", value: "#64748b" },
      { label: "White", value: "#ffffff" },
    ]),
    subheadingSize: flexibleSizeField(
      "Subheading Size",
      SUBHEADING_SIZE_PRESETS,
    ),
    seeAllColor: colorField('"See All" Color', [
      { label: "Brand blue (default)", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
    ]),
    seeAllSize: flexibleSizeField('"See All" Size', SEEALL_SIZE_PRESETS),
    controllerColor: colorField("Arrows / Play-Pause Color", [
      { label: "Brand blue (default)", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
    ]),
  };
}

export function carouselHeaderDefaultProps() {
  return {
    eyebrowBg: { type: "custom", value: "#e0f2fe" },
    eyebrowColor: { type: "custom", value: "#2563eb" },
    eyebrowSize: "0.75rem",
    headingColor: { type: "custom", value: "#1e293b" },
    headingSize: "1.875rem",
    subheadingColor: { type: "custom", value: "#64748b" },
    subheadingSize: "0.875rem",
    seeAllColor: { type: "theme", token: "primary" },
    seeAllSize: "0.875rem",
    controllerColor: { type: "theme", token: "primary" },
  };
}

export function buildCarouselHeaderVars(props, themeColors) {
  return {
    "--carousel-eyebrow-bg": resolveColor(props.eyebrowBg, themeColors),
    "--carousel-eyebrow-color": resolveColor(props.eyebrowColor, themeColors),
    "--carousel-eyebrow-size": props.eyebrowSize || undefined,
    "--carousel-heading-color": resolveColor(props.headingColor, themeColors),
    "--carousel-heading-size": props.headingSize || undefined,
    "--carousel-subheading-color": resolveColor(
      props.subheadingColor,
      themeColors,
    ),
    "--carousel-subheading-size": props.subheadingSize || undefined,
    "--carousel-seeall-color": resolveColor(props.seeAllColor, themeColors),
    "--carousel-seeall-size": props.seeAllSize || undefined,
    "--carousel-controller-color": resolveColor(
      props.controllerColor,
      themeColors,
    ),
  };
}
