"use client";

import { useThemeColors } from "../theme/ThemeColorsContext";
import { colorField, resolveColor } from "../fields/colorField";
import { flexibleSizeField, GAP_PRESETS } from "../fields/flexibleSize";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";

const ICON_COLOR_PRESETS = [
  { label: "Brand blue", value: "#2563eb" },
  { label: "Dark", value: "#111827" },
  { label: "Gray", value: "#6b7280" },
  { label: "White", value: "#ffffff" },
];

const ICON_BG_COLOR_PRESETS = [
  { label: "Light blue", value: "#dbeafe" },
  { label: "Light gray", value: "#f3f4f6" },
  { label: "Brand blue", value: "#2563eb" },
  { label: "Dark", value: "#111827" },
  { label: "White", value: "#ffffff" },
];

const TITLE_COLOR_PRESETS = [
  { label: "Dark", value: "#111827" },
  { label: "Brand blue", value: "#354e98" },
  { label: "White", value: "#ffffff" },
];

const DESCRIPTION_COLOR_PRESETS = [
  { label: "Gray", value: "#4b5563" },
  { label: "Dark", value: "#111827" },
  { label: "White", value: "#ffffff" },
];

const BOX_BG_COLOR_PRESETS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Light gray", value: "#f9fafb" },
  { label: "Dark", value: "#111827" },
];

const STATIC_FIELDS = {
  // Tabler icon class suffix, e.g. "ti-rocket" — rendered as
  // `ti ti-rocket` to match the CDN usage already established
  // elsewhere in the project.
  icon: { type: "text", label: "Icon (Tabler class, e.g. ti-rocket)" },
  iconPosition: {
    type: "radio",
    label: "Icon Position",
    options: [
      { label: "Top", value: "top" },
      { label: "Left", value: "left" },
      { label: "Right", value: "right" },
    ],
  },
  contentAlign: {
    type: "radio",
    label: "Content Alignment (Top position only)",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ],
  },
  iconColor: colorField("Icon Color", ICON_COLOR_PRESETS),
  iconSize: flexibleSizeField("Icon Size", GAP_PRESETS),
  iconBackground: {
    type: "radio",
    label: "Icon Background",
    options: [
      { label: "None", value: "none" },
      { label: "Circle", value: "circle" },
      { label: "Square", value: "square" },
    ],
  },
  iconBackgroundColor: colorField(
    "Icon Background Color",
    ICON_BG_COLOR_PRESETS,
  ),
  // Shape size = Icon Size + this padding on every side, same approach
  // as the IconList widget so the shape auto-scales with Icon Size.
  iconBackgroundPadding: flexibleSizeField(
    "Icon Background Padding",
    GAP_PRESETS,
  ),
  iconContentGap: flexibleSizeField(
    "Space Between Icon & Content",
    GAP_PRESETS,
  ),
  title: { type: "text", label: "Title" },
  titleColor: colorField("Title Color", TITLE_COLOR_PRESETS),
  titleSize: flexibleSizeField("Title Size", GAP_PRESETS),
  titleGap: flexibleSizeField("Space Below Title", GAP_PRESETS),
  description: { type: "textarea", label: "Description" },
  descriptionColor: colorField("Description Color", DESCRIPTION_COLOR_PRESETS),
  descriptionSize: flexibleSizeField("Description Size", GAP_PRESETS),
  link: { type: "text", label: "Link (optional — wraps the whole box)" },
  bgColor: colorField("Box Background Color", BOX_BG_COLOR_PRESETS),
  padding: spacingBoxField("Box Padding"),
  ...borderFieldSet(),
  shadow: shadowField(),
  ...hoverFieldSet(),
};

export const IconBox = {
  label: "Icon Box",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "icon-box-default",
    icon: "ti-rocket",
    iconPosition: "top",
    contentAlign: "center",
    iconColor: "#2563eb",
    iconSize: "28px",
    iconBackground: "circle",
    iconBackgroundColor: "#dbeafe",
    iconBackgroundPadding: "16px",
    iconContentGap: "16px",
    title: "Icon Box Title",
    titleColor: "#111827",
    titleSize: "20px",
    titleGap: "8px",
    description:
      "Add your description text here to explain this feature or benefit.",
    descriptionColor: "#4b5563",
    descriptionSize: "15px",
    link: "",
    bgColor: "transparent",
    padding: {
      top: { desktop: "24" },
      right: { desktop: "24" },
      bottom: { desktop: "24" },
      left: { desktop: "24" },
      linked: true,
      unit: "px",
    },
    ...borderDefaultProps(),
    ...shadowDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: function IconBoxRender({
    id,
    icon,
    iconPosition,
    contentAlign,
    iconColor,
    iconSize,
    iconBackground,
    iconBackgroundColor,
    iconBackgroundPadding,
    iconContentGap,
    title,
    titleColor,
    titleSize,
    titleGap,
    description,
    descriptionColor,
    descriptionSize,
    link,
    bgColor,
    padding,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    shadow,
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
    const { themeColors } = useThemeColors();
    const resolvedIconColor = resolveColor(iconColor, themeColors);
    const resolvedIconBg = resolveColor(iconBackgroundColor, themeColors);
    const resolvedTitleColor = resolveColor(titleColor, themeColors);
    const resolvedDescColor = resolveColor(descriptionColor, themeColors);
    const resolvedBg = resolveColor(bgColor, themeColors);
    const scopedClass = `pb-iconbox-${id}`;
    const isTop = iconPosition === "top";
    const isRight = iconPosition === "right";
    const hasIconBg = iconBackground !== "none";

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

    const iconWrapperStyle = hasIconBg
      ? {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: resolvedIconBg,
          borderRadius: iconBackground === "circle" ? "50%" : "6px",
          padding: iconBackgroundPadding,
          lineHeight: 1,
          flexShrink: 0,
        }
      : {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          flexShrink: 0,
        };

    const iconEl = icon ? (
      <span style={iconWrapperStyle}>
        <i
          className={`ti ${icon}`}
          style={{
            color: resolvedIconColor,
            fontSize: iconSize,
            lineHeight: 1,
          }}
        />
      </span>
    ) : null;

    // Content text-align only follows Content Alignment for the "top"
    // layout — "left"/"right" icon positions naturally read left-
    // aligned next to the icon, matching Elementor's Icon Box behavior.
    const textAlign = isTop ? contentAlign : "left";

    const contentEl = (
      <div style={{ textAlign }}>
        {title && (
          <div
            style={{
              color: resolvedTitleColor,
              fontSize: titleSize,
              fontWeight: 600,
              marginBottom: titleGap,
            }}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={{
              color: resolvedDescColor,
              fontSize: descriptionSize,
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        )}
      </div>
    );

    const layoutStyle = isTop
      ? {
          display: "flex",
          flexDirection: "column",
          alignItems:
            contentAlign === "left"
              ? "flex-start"
              : contentAlign === "right"
                ? "flex-end"
                : "center",
          gap: iconContentGap,
        }
      : {
          display: "flex",
          flexDirection: isRight ? "row-reverse" : "row",
          alignItems: "flex-start",
          gap: iconContentGap,
        };

    const Wrapper = link ? "a" : "div";
    const wrapperProps = link ? { href: link } : {};

    return (
      <>
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            ...spacingBoxToEntries("padding", padding),
            ...borderToEntries(
              { borderWidth, borderStyle, borderColor, borderRadius },
              themeColors,
            ),
          ]}
        />
        {hoverCss && <style>{hoverCss}</style>}
        <Wrapper
          {...wrapperProps}
          className={scopedClass}
          style={{
            display: "block",
            backgroundColor: resolvedBg,
            textDecoration: "none",
            boxShadow: resolveShadow(shadow) || undefined,
            ...layoutStyle,
          }}
        >
          {iconEl}
          {contentEl}
        </Wrapper>
      </>
    );
  },
};
