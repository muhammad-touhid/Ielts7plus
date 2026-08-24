// src/lib/pageBuilder/widgets/Menu.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { TEXT_ALIGN_PRESETS, TEXT_SIZE_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor } from "../fields/colorField";
import {
  ResponsiveStyle,
  alignToJustifyEntries,
} from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import { useThemeColors } from "../theme/ThemeColorsContext";

// NOTE: deliberately does NOT use this project's shared
// hoverFieldSet()/borderFieldSet() pattern — see Menu.jsx history for
// why. Dropdown positioning uses position:"fixed" computed from
// getBoundingClientRect(), not "absolute", to escape a Section
// ancestor's hardcoded overflow:"hidden". `display` for .desktop/.mobile
// nav is controlled entirely via the scoped <style> block's media
// queries, never inline (inline style always beats a stylesheet rule
// regardless of media query, which broke the mobile toggle previously).
//
// MULTI-LEVEL DROPDOWNS: Puck's field schema can't be infinitely
// recursive (a field can't reference itself in a plain JS object
// literal), so the EDITOR is capped at 3 levels: top-level items ->
// dropdown -> sub-dropdown. The RENDER logic (the Flyout component
// below) is written recursively and would handle deeper data if it
// ever existed, but the Puck panel itself won't let you add a 4th
// level. In practice 3 levels covers effectively every real site nav.
// Level 3+ opens as a flyout to the RIGHT of its level-2 parent
// (standard nested-submenu pattern), not below.

function Flyout({ items, position, onClose }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [subPos, setSubPos] = useState({ top: 0, left: 0 });

  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 6,
        minWidth: 180,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        zIndex: 9999,
      }}
      onMouseLeave={() => {
        setActiveIndex(null);
        onClose?.();
      }}
    >
      {items.map((item, i) => {
        const hasChildren = item.children?.length > 0;
        return (
          <div
            key={i}
            style={{ position: "relative" }}
            onMouseEnter={(e) => {
              if (!hasChildren) {
                setActiveIndex(null);
                return;
              }
              const rect = e.currentTarget.getBoundingClientRect();
              setSubPos({ top: rect.top, left: rect.right });
              setActiveIndex(i);
            }}
          >
            <Link
              href={item.href || "#"}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 6,
                color: "#374151",
                fontSize: "0.875rem",
              }}
              onClick={() => !hasChildren && onClose?.()}
            >
              {item.label}
              {hasChildren && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </Link>
            {hasChildren && activeIndex === i && (
              <Flyout
                items={item.children}
                position={subPos}
                onClose={() => setActiveIndex(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Recursive mobile renderer — always-expanded indented list (no
// per-level click-to-expand accordion) since 3 levels deep stays
// readable without one, and it keeps the mobile menu's state simple.
function MobileItems({ items, depth, onNavigate }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={i}>
          <Link
            href={item.href || "#"}
            style={{
              display: "block",
              padding: "8px 0",
              paddingLeft: depth * 14,
              fontWeight: depth === 0 ? 500 : 400,
              fontSize: depth === 0 ? "1em" : "0.9em",
              opacity: depth === 0 ? 1 : 0.85,
            }}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
          {item.children?.length > 0 && (
            <MobileItems
              items={item.children}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          )}
        </div>
      ))}
    </>
  );
}

export const Menu = {
  label: "Menu",
  fields: {
    items: {
      type: "array",
      label: "Menu Items",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Link" },
        children: {
          type: "array",
          label: "Dropdown Items (optional)",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Link" },
            children: {
              type: "array",
              label: "Sub-Dropdown Items (optional)",
              arrayFields: {
                label: { type: "text", label: "Label" },
                href: { type: "text", label: "Link" },
              },
              defaultItemProps: { label: "Sub Item", href: "/" },
              getItemSummary: (item) => item.label || "Sub Item",
            },
          },
          defaultItemProps: { label: "Sub Item", href: "/", children: [] },
          getItemSummary: (item) => item.label || "Sub Item",
        },
      },
      defaultItemProps: { label: "Menu Item", href: "/", children: [] },
      getItemSummary: (item) => item.label || "Menu Item",
    },
    orientation: {
      type: "radio",
      label: "Orientation",
      options: [
        { label: "Horizontal (nav bar)", value: "horizontal" },
        { label: "Vertical (stacked list)", value: "vertical" },
      ],
    },
    textColor: colorField("Text Color", [
      {
        label: "Inherit (follows parent Section's scroll color)",
        value: "inherit",
      },
      { label: "Dark", value: "#374151" },
      { label: "White", value: "#ffffff" },
      { label: "Gray", value: "#9ca3af" },
    ]),
    hoverColor: colorField("Hover / Active Color", [
      {
        label: "Inherit (follows parent Section's scroll color)",
        value: "inherit",
      },
      { label: "Brand blue", value: "#2563eb" },
      { label: "White", value: "#ffffff" },
      { label: "Red accent", value: "#f87171" },
    ]),
    fontSize: responsiveField("Font Size", TEXT_SIZE_PRESETS),
    gap: {
      type: "select",
      label: "Item Spacing",
      options: [
        { label: "Small", value: "12px" },
        { label: "Medium", value: "20px" },
        { label: "Large", value: "32px" },
      ],
    },
    blockAlign: responsiveField(
      "Block Alignment (position within column)",
      TEXT_ALIGN_PRESETS,
    ),
    margin: spacingBoxField("Margin"),
  },
  defaultProps: {
    id: "menu-default",
    items: [
      { label: "Home", href: "/", children: [] },
      { label: "Courses", href: "/courses", children: [] },
      { label: "Blog", href: "/blog", children: [] },
      { label: "Contact", href: "/contact", children: [] },
    ],
    orientation: "horizontal",
    textColor: "#374151",
    hoverColor: "#2563eb",
    fontSize: { desktop: "0.9375rem" },
    gap: "20px",
    blockAlign: { desktop: "left" },
    margin: {
      top: { desktop: "0" },
      right: { desktop: "0" },
      bottom: { desktop: "0" },
      left: { desktop: "0" },
      linked: false,
      unit: "px",
    },
  },
  render: function MenuRender({
    id,
    items,
    orientation,
    textColor,
    hoverColor,
    fontSize,
    gap,
    blockAlign,
    margin,
  }) {
    const { themeColors } = useThemeColors();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const scopedClass = `pb-menu-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    // colorField's "Inherit" preset is stored as {type:"custom",
    // value:"inherit"} (colorField always wraps preset selections in
    // this shape), NOT the plain string "inherit" — comparing the raw
    // prop directly against "inherit" silently fails and falls through
    // to resolveColor(), which then returns the literal CSS keyword
    // `inherit` (a real but unrelated CSS value meaning "inherit from
    // parent element") instead of ever reading the intended variable.
    const isInherit = (v) =>
      v === "inherit" || (v && typeof v === "object" && v.value === "inherit");
    const resolvedText = isInherit(textColor)
      ? "var(--pb-scroll-text-color, #374151)"
      : resolveColor(textColor, themeColors);
    const resolvedHover = isInherit(hoverColor)
      ? "var(--pb-scroll-hover-color, #2563eb)"
      : resolveColor(hoverColor, themeColors);
    const safeItems = Array.isArray(items) ? items : [];

    const scopedCss = `
      .${scopedClass} a { color: ${resolvedText}; transition: color 0.2s; text-decoration: none; }
      .${scopedClass} a:hover { color: ${resolvedHover}; }
      .${scopedClass}-desktop { display: flex; }
      .${scopedClass}-toggle { display: none; }
      .${scopedClass}-mobile { display: flex; }
      @media (max-width: 767px) {
        .${scopedClass}-desktop { display: none; }
        .${scopedClass}-toggle { display: inline-flex; }
      }
      @media (min-width: 768px) {
        .${scopedClass}-mobile { display: none; }
      }
    `;

    function handleItemEnter(e, i, hasChildren) {
      if (!hasChildren) {
        setOpenDropdown(null);
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom, left: rect.left });
      setOpenDropdown(i);
    }

    const activeItem = openDropdown !== null ? safeItems[openDropdown] : null;

    return (
      <>
        <ResponsiveStyle
          className={wrapClass}
          entries={alignToJustifyEntries(blockAlign)}
        />
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            { property: "font-size", value: fontSize },
            ...spacingBoxToEntries("margin", margin),
          ]}
        />
        <style>{scopedCss}</style>
        <div className={wrapClass}>
          <div className={scopedClass}>
            {/* Desktop nav */}
            <nav
              className={`${scopedClass}-desktop`}
              style={{
                flexDirection: orientation === "vertical" ? "column" : "row",
                flexWrap: "nowrap",
                alignItems:
                  orientation === "vertical" ? "flex-start" : "center",
                gap,
                overflowX: orientation === "vertical" ? "visible" : "auto",
              }}
            >
              {safeItems.map((item, i) => {
                const hasChildren = item.children?.length > 0;
                return (
                  <div
                    key={i}
                    style={{ position: "relative", flexShrink: 0 }}
                    onMouseEnter={(e) => handleItemEnter(e, i, hasChildren)}
                  >
                    <Link
                      href={item.href || "#"}
                      style={{
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                      {hasChildren && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          style={{
                            transform:
                              openDropdown === i
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Top-level dropdown — recursive Flyout handles any
                deeper levels present in the data. */}
            {activeItem && (
              <Flyout
                items={activeItem.children}
                position={dropdownPos}
                onClose={() => setOpenDropdown(null)}
              />
            )}

            {/* Mobile toggle */}
            <button
              type="button"
              className={`${scopedClass}-toggle`}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                border: `1px solid ${resolvedText}`,
                borderRadius: 8,
                color: resolvedText,
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Toggle menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Mobile menu — recursive, always-expanded, indented per
                depth level. */}
            {mobileOpen && (
              <nav
                className={`${scopedClass}-mobile`}
                style={{
                  flexDirection: "column",
                  gap: "4px",
                  marginTop: 12,
                }}
              >
                <MobileItems
                  items={safeItems}
                  depth={0}
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
            )}
          </div>
        </div>
      </>
    );
  },
};
