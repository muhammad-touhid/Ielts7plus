// src/lib/pageBuilder/widgets/ButtonBlock.jsx
"use client";

import Link from "next/link";
import { TEXT_SIZE_PRESETS, TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor, hexToRgba } from "../fields/colorField";
import { fontField, resolveFont } from "../fields/fontField";
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
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import { useThemeColors } from "../theme/ThemeColorsContext";

import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";

export const ButtonBlock = {
  label: "Button",
  fields: {
    text: { type: "text", label: "Button Text" },
    href: { type: "text", label: "Link URL" },
    variant: {
      type: "radio",
      label: "Fill",
      options: [
        { label: "Filled", value: "filled" },
        {
          label: "Transparent (use border below for outline)",
          value: "transparent",
        },
      ],
    },
    font: fontField("Font", "button"),
    bgColor: colorField("Background Color", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Emerald", value: "#10b981" },
    ]),
    bgOpacity: {
      type: "select",
      label: "Background Opacity",
      options: [
        { label: "100%", value: "100" },
        { label: "75%", value: "75" },
        { label: "50%", value: "50" },
        { label: "25%", value: "25" },
        { label: "10%", value: "10" },
      ],
    },
    textColor: colorField("Text Color", [
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
    ]),
    weight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Bold", value: "font-bold" },
        { label: "Extra Bold", value: "font-extrabold" },
      ],
    },
    textCase: {
      type: "select",
      label: "Text Case",
      options: [
        { label: "None", value: "none" },
        { label: "UPPERCASE", value: "uppercase" },
        { label: "lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ],
    },
    icon: {
      type: "text",
      label: "Icon Class (blank = no icon, e.g. ti-arrow-right)",
    },
    iconPosition: {
      type: "radio",
      label: "Icon Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Auto", value: "inline-block" },
        { label: "Full width", value: "block w-full text-center" },
      ],
    },
    size: responsiveField("Text Size", TEXT_SIZE_PRESETS),
    align: responsiveField("Alignment", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    shadow: shadowField(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "button-default",
    text: "Get Started",
    href: "/",
    variant: "filled",
    font: { type: "theme", token: "button" },
    bgColor: "#2563eb",
    bgOpacity: "100",
    textColor: "#ffffff",
    weight: "font-medium",
    textCase: "none",
    icon: "",
    iconPosition: "right",
    width: "inline-block",
    size: { desktop: "1rem" },
    align: { desktop: "left" },
    padding: {
      top: { desktop: "12" },
      right: { desktop: "24" },
      bottom: { desktop: "12" },
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
  render: ({
    id,
    text,
    href,
    variant,
    font,
    bgColor,
    bgOpacity,
    textColor,
    weight,
    textCase,
    icon,
    iconPosition,
    width,
    size,
    align,
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
  }) => {
    const { themeColors, themeFonts } = useThemeColors();
    const scopedClass = `pb-button-${id}`;
    const resolvedBgHex = resolveColor(bgColor, themeColors);
    const resolvedTextHex = resolveColor(textColor, themeColors);
    const resolvedBg =
      variant === "filled"
        ? hexToRgba(resolvedBgHex, parseInt(bgOpacity, 10))
        : "transparent";
    const resolvedFont = resolveFont(font, themeFonts);

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

    return (
      <div className={`${scopedClass}-wrap`}>
        <ResponsiveStyle
          className={`${scopedClass}-wrap`}
          entries={[{ property: "text-align", value: align }]}
        />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "font-size", value: size },
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
        <Link
          href={href || "#"}
          className={`${width} ${weight} ${scopedClass} inline-flex items-center justify-center gap-2`}
          style={{
            backgroundColor: resolvedBg,
            color: resolvedTextHex,
            textTransform: textCase,
            fontFamily: resolvedFont
              ? `'${resolvedFont}', sans-serif`
              : undefined,
            boxShadow: resolveShadow(shadow) || undefined,
          }}
        >
          {icon && iconPosition === "left" && <i className={`ti ${icon}`} />}
          {text}
          {icon && iconPosition === "right" && <i className={`ti ${icon}`} />}
        </Link>
      </div>
    );
  },
};
