// src/lib/pageBuilder/widgets/ButtonBlock.jsx
"use client";

import Link from "next/link";
import { TEXT_SIZE_PRESETS, TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor, hexToRgba } from "../fields/colorField";
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
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "button-default",
    text: "Get Started",
    href: "/",
    variant: "filled",
    bgColor: "#2563eb",
    bgOpacity: "100",
    textColor: "#ffffff",
    weight: "font-medium",
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
  },
  render: ({
    id,
    text,
    href,
    variant,
    bgColor,
    bgOpacity,
    textColor,
    weight,
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
  }) => {
    const { themeColors } = useThemeColors();
    const scopedClass = `pb-button-${id}`;
    const resolvedBgHex = resolveColor(bgColor, themeColors);
    const resolvedTextHex = resolveColor(textColor, themeColors);
    const resolvedBg =
      variant === "filled"
        ? hexToRgba(resolvedBgHex, parseInt(bgOpacity, 10))
        : "transparent";

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
          style={{ backgroundColor: resolvedBg, color: resolvedTextHex }}
        >
          {icon && iconPosition === "left" && <i className={`ti ${icon}`} />}
          {text}
          {icon && iconPosition === "right" && <i className={`ti ${icon}`} />}
        </Link>
      </div>
    );
  },
};
