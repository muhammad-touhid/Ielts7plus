// src/lib/pageBuilder/fields/cardStyleField.js
"use client";

import { colorField, resolveColor } from "./colorField";
import { flexibleSizeField } from "./flexibleSize";
import { spacingBoxField, spacingBoxToEntries } from "./spacingBoxField";

const TITLE_SIZE_PRESETS = [
  { label: "Small", value: "1rem" },
  { label: "Medium", value: "1.125rem" },
  { label: "Large", value: "1.375rem" },
  { label: "X-Large", value: "1.75rem" },
];

const TEXT_SIZE_PRESETS = [
  { label: "Small", value: "0.8125rem" },
  { label: "Medium", value: "0.875rem" },
  { label: "Large", value: "1rem" },
];

export function cardStyleFieldSet() {
  return {
    cardBg: colorField("Card Background", [
      { label: "White", value: "#ffffff" },
      { label: "Light gray", value: "#f8fafc" },
      { label: "Dark", value: "#111827" },
    ]),
    cardAccent: colorField("Card Accent (buttons / links / highlights)", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
    ]),
    titleColor: colorField("Title Color", [
      { label: "Dark (default)", value: "#1e293b" },
      { label: "White", value: "#ffffff" },
    ]),
    titleSize: flexibleSizeField("Title Size", TITLE_SIZE_PRESETS),
    textColor: colorField("Text Color", [
      { label: "Gray (default)", value: "#64748b" },
      { label: "White", value: "#ffffff" },
    ]),
    textSize: flexibleSizeField("Text Size", TEXT_SIZE_PRESETS),
    buttonSize: flexibleSizeField("Button Text Size", TEXT_SIZE_PRESETS),
    cardPadding: spacingBoxField("Card Inner Padding"),
  };
}

export function cardStyleDefaultProps() {
  return {
    cardBg: { type: "custom", value: "#ffffff" },
    cardAccent: { type: "theme", token: "primary" },
    titleColor: { type: "custom", value: "#1e293b" },
    titleSize: "1.125rem",
    textColor: { type: "custom", value: "#64748b" },
    textSize: "0.875rem",
    buttonSize: "0.875rem",
    cardPadding: {
      top: {},
      right: {},
      bottom: {},
      left: {},
      linked: false,
      unit: "px",
    },
  };
}

function paddingSide(entries, property) {
  const entry = entries.find((e) => e.property === property);
  const val = entry?.value?.desktop;
  return val || null;
}

export function buildCardStyleVars(props, themeColors) {
  const vars = {
    "--card-bg": resolveColor(props.cardBg, themeColors),
    "--card-accent": resolveColor(props.cardAccent, themeColors),
    "--card-title-color": resolveColor(props.titleColor, themeColors),
    "--card-title-size": props.titleSize || undefined,
    "--card-text-color": resolveColor(props.textColor, themeColors),
    "--card-text-size": props.textSize || undefined,
    "--card-button-size": props.buttonSize || undefined,
  };

  const entries = spacingBoxToEntries("padding", props.cardPadding);
  const top = paddingSide(entries, "padding-top");
  const right = paddingSide(entries, "padding-right");
  const bottom = paddingSide(entries, "padding-bottom");
  const left = paddingSide(entries, "padding-left");
  if (top || right || bottom || left) {
    vars["--card-padding"] =
      `${top || "0px"} ${right || "0px"} ${bottom || "0px"} ${left || "0px"}`;
  }

  return vars;
}
