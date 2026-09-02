"use client";

import { useThemeColors } from "../theme/ThemeColorsContext";
import { colorField, resolveColor } from "../fields/colorField";
import { flexibleSizeField, GAP_PRESETS } from "../fields/flexibleSize";

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

const TEXT_COLOR_PRESETS = [
  { label: "Dark", value: "#111827" },
  { label: "Gray", value: "#4b5563" },
  { label: "White", value: "#ffffff" },
];

const DIVIDER_COLOR_PRESETS = [
  { label: "Light gray", value: "#e5e7eb" },
  { label: "Gray", value: "#9ca3af" },
];

const STATIC_FIELDS = {
  items: {
    type: "array",
    label: "List Items",
    arrayFields: {
      text: { type: "text", label: "Text" },
      // Tabler icon class suffix, e.g. "ti-check" — rendered as
      // `ti ti-check` to match the CDN usage already established
      // elsewhere in the project. "ti-star-filled" doesn't exist on
      // the CDN; use "ti-star" or similar verified classes.
      icon: { type: "text", label: "Icon (Tabler class, e.g. ti-check)" },
      link: { type: "text", label: "Link (optional)" },
    },
    defaultItemProps: {
      text: "List Item",
      icon: "ti-check",
      link: "",
    },
    getItemSummary: (item) => item?.text || "List Item",
  },
  layout: {
    type: "radio",
    label: "Layout",
    options: [
      { label: "Vertical (stacked)", value: "vertical" },
      { label: "Horizontal (inline)", value: "horizontal" },
    ],
  },
  iconColor: colorField("Icon Color", ICON_COLOR_PRESETS),
  // Reusing GAP_PRESETS for icon size too — same kind of small px
  // value as a gap, and flexibleSizeField accepts any preset list
  // plus a custom value, same pattern as reusing BORDER_WIDTH_PRESETS
  // for the Divider widget's thickness field.
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
  // The shape's overall size is icon size + this padding on every
  // side — same approach Elementor uses, so the shape auto-scales
  // with whatever Icon Size is set rather than needing its own fixed
  // width/height field to keep in sync.
  iconBackgroundPadding: flexibleSizeField(
    "Icon Background Padding",
    GAP_PRESETS,
  ),
  textColor: colorField("Text Color", TEXT_COLOR_PRESETS),
  textSize: flexibleSizeField("Text Size", GAP_PRESETS),
  iconTextGap: flexibleSizeField("Space Between Icon & Text", GAP_PRESETS),
  itemGap: flexibleSizeField("Space Between Items", GAP_PRESETS),
  dividerEnabled: {
    type: "radio",
    label: "Divider Between Items",
    options: [
      { label: "Off", value: "off" },
      { label: "On", value: "on" },
    ],
  },
  dividerColor: colorField("Divider Color", DIVIDER_COLOR_PRESETS),
};

export const IconList = {
  label: "Icon List",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "icon-list-default",
    items: [
      { text: "List Item #1", icon: "ti-check", link: "" },
      { text: "List Item #2", icon: "ti-check", link: "" },
      { text: "List Item #3", icon: "ti-check", link: "" },
    ],
    layout: "vertical",
    iconColor: "#2563eb",
    iconSize: "18px",
    iconBackground: "none",
    iconBackgroundColor: "#dbeafe",
    iconBackgroundPadding: "8px",
    textColor: "#111827",
    textSize: "16px",
    iconTextGap: "10px",
    itemGap: "12px",
    dividerEnabled: "off",
    dividerColor: "#e5e7eb",
  },
  render: function IconListRender({
    items,
    layout,
    iconColor,
    iconSize,
    iconBackground,
    iconBackgroundColor,
    iconBackgroundPadding,
    textColor,
    textSize,
    iconTextGap,
    itemGap,
    dividerEnabled,
    dividerColor,
  }) {
    const { themeColors } = useThemeColors();
    const resolvedIconColor = resolveColor(iconColor, themeColors);
    const resolvedIconBgColor = resolveColor(iconBackgroundColor, themeColors);
    const resolvedTextColor = resolveColor(textColor, themeColors);
    const resolvedDividerColor = resolveColor(dividerColor, themeColors);
    const isHorizontal = layout === "horizontal";
    const list = Array.isArray(items) ? items : [];
    const showDivider = dividerEnabled === "on";
    const hasBackground = iconBackground !== "none";

    const iconWrapperStyle = hasBackground
      ? {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: resolvedIconBgColor,
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

    return (
      <ul
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          flexWrap: isHorizontal ? "wrap" : "nowrap",
          gap: itemGap,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {list.map((item, i) => {
          const isLast = i === list.length - 1;

          // Divider sits between items, not after the last one — a
          // right-border for horizontal layout, bottom-border for
          // vertical, with matching padding so the line doesn't hug
          // the text.
          const dividerStyle =
            showDivider && !isLast
              ? isHorizontal
                ? {
                    borderRight: `1px solid ${resolvedDividerColor}`,
                    paddingRight: itemGap,
                  }
                : {
                    borderBottom: `1px solid ${resolvedDividerColor}`,
                    paddingBottom: itemGap,
                  }
              : {};

          const itemInnerStyle = {
            display: "flex",
            alignItems: "center",
            gap: iconTextGap,
          };

          const content = (
            <>
              {item.icon && (
                <span style={iconWrapperStyle}>
                  <i
                    className={`ti ${item.icon}`}
                    style={{
                      color: resolvedIconColor,
                      fontSize: iconSize,
                      lineHeight: 1,
                    }}
                  />
                </span>
              )}
              <span style={{ color: resolvedTextColor, fontSize: textSize }}>
                {item.text}
              </span>
            </>
          );

          return (
            <li key={i} style={dividerStyle}>
              {item.link ? (
                <a
                  href={item.link}
                  style={{ ...itemInnerStyle, textDecoration: "none" }}
                >
                  {content}
                </a>
              ) : (
                <div style={itemInnerStyle}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
};
