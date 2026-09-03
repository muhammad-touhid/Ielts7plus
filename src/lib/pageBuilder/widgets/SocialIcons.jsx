"use client";

import { useThemeColors } from "../theme/ThemeColorsContext";
import { colorField, resolveColor } from "../fields/colorField";
import { flexibleSizeField, GAP_PRESETS } from "../fields/flexibleSize";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";

const ICON_COLOR_PRESETS = [
  { label: "Gray", value: "#64748b" },
  { label: "Dark", value: "#111827" },
  { label: "Brand blue", value: "#2563eb" },
  { label: "White", value: "#ffffff" },
];

const BG_COLOR_PRESETS = [
  { label: "Light gray", value: "#f1f5f9" },
  { label: "White", value: "#ffffff" },
  { label: "Brand blue", value: "#2563eb" },
  { label: "Transparent", value: "transparent" },
];

const STATIC_FIELDS = {
  items: {
    type: "array",
    label: "Social Links",
    arrayFields: {
      // Full class string, matching how this is used today — e.g.
      // "ti ti-brand-facebook" — not just the suffix, so it's a
      // drop-in replacement for the existing `s.icon` usage.
      icon: { type: "text", label: "Icon Class (e.g. ti ti-brand-facebook)" },
      href: { type: "text", label: "Link URL" },
      label: { type: "text", label: "Accessible Label (aria-label)" },
    },
    defaultItemProps: {
      icon: "ti ti-brand-facebook",
      href: "#",
      label: "Facebook",
    },
    getItemSummary: (item) => item?.label || "Social Link",
  },
  shape: {
    type: "radio",
    label: "Shape",
    options: [
      { label: "Circle", value: "circle" },
      { label: "Rounded", value: "rounded" },
      { label: "Square", value: "square" },
    ],
  },
  // Only applies when Shape is "Rounded" — Circle always uses 50% and
  // Square always uses 0, same reasoning as IconBox's square radius.
  customRadius: flexibleSizeField(
    "Corner Radius (Rounded shape only)",
    GAP_PRESETS,
  ),
  boxSize: flexibleSizeField("Icon Box Size", GAP_PRESETS),
  iconSize: flexibleSizeField("Icon Size", GAP_PRESETS),
  iconColor: colorField("Icon Color", ICON_COLOR_PRESETS),
  bgColor: colorField("Background Color", BG_COLOR_PRESETS),
  gap: flexibleSizeField("Space Between Icons", GAP_PRESETS),
  ...hoverFieldSet(),
};

export const SocialIcons = {
  label: "Social Icons",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "social-icons-default",
    items: [
      { icon: "ti ti-brand-facebook", href: "#", label: "Facebook" },
      { icon: "ti ti-brand-twitter", href: "#", label: "Twitter" },
      { icon: "ti ti-brand-instagram", href: "#", label: "Instagram" },
      { icon: "ti ti-brand-linkedin", href: "#", label: "LinkedIn" },
    ],
    shape: "rounded",
    customRadius: "12px",
    boxSize: "36px",
    iconSize: "16px",
    iconColor: "#64748b",
    bgColor: "#f1f5f9",
    gap: "8px",
    ...hoverDefaultProps(),
  },
  render: function SocialIconsRender({
    id,
    items,
    shape,
    customRadius,
    boxSize,
    iconSize,
    iconColor,
    bgColor,
    gap,
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
    const resolvedBg = resolveColor(bgColor, themeColors);
    const scopedClass = `pb-social-${id}`;
    const list = Array.isArray(items) ? items : [];

    const radius =
      shape === "circle" ? "50%" : shape === "square" ? "0px" : customRadius;

    // All icon links share the same scopedClass, so this single hover
    // rule (from the existing shared hoverField helper) applies
    // uniformly to every icon — matching the original snippet's
    // hover:bg-blue-600 hover:text-white behavior across all items,
    // not per-icon customization.
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
      <>
        {hoverCss && <style>{hoverCss}</style>}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {list.map((item, i) => (
            <li key={i}>
              <a
                href={item.href || "#"}
                aria-label={item.label}
                className={scopedClass}
                style={{
                  width: boxSize,
                  height: boxSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radius,
                  backgroundColor: resolvedBg,
                  color: resolvedIconColor,
                  fontSize: iconSize,
                  textDecoration: "none",
                }}
              >
                <i className={item.icon} />
              </a>
            </li>
          ))}
        </ul>
      </>
    );
  },
};
