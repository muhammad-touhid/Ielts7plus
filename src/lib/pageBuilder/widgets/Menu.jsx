// src/lib/pageBuilder/widgets/Menu.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
// MOBILE PANEL: the opened mobile menu is a position:"fixed" overlay
// anchored just below the nearest fixed/sticky ancestor (the header),
// NOT an inline block inside the column. Rendering it inline made the
// header column grow to the menu's full height and broke the header
// layout. As an overlay it takes no space in the header at all.
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

// ---- Mobile panel helpers -------------------------------------------

function normPath(p) {
  if (!p) return "";
  const clean = p.split("?")[0].split("#")[0];
  return clean.length > 1 ? clean.replace(/\/$/, "") : clean;
}

function isSamePath(href, pathname) {
  if (!href || href === "#" || !pathname) return false;
  return normPath(href) === normPath(pathname);
}

function hasActiveDescendant(children, pathname) {
  return (children || []).some(
    (c) =>
      isSamePath(c.href, pathname) || hasActiveDescendant(c.children, pathname),
  );
}

const ROW_STYLE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  background: "transparent",
  border: "none",
  textAlign: "left",
  textDecoration: "none",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition: "background-color 0.15s, color 0.15s",
};

// One row of the mobile panel. Items with children are a button that
// expands/collapses an indented group (accordion); items without
// children are plain links. The page you're on is highlighted, and the
// group containing it starts expanded.
function MobileItem({ item, depth, onNavigate, pathname, scopedClass }) {
  const children = item.children || [];
  const hasChildren = children.length > 0;
  const selfActive = isSamePath(item.href, pathname);
  const branchActive =
    selfActive || (hasChildren && hasActiveDescendant(children, pathname));
  const [open, setOpen] = useState(hasChildren && branchActive);

  const subClass = depth > 0 ? ` ${scopedClass}-msub` : "";

  // If the parent has its own real link and no child points at it,
  // keep it reachable as an "Overview" row inside the group.
  const showOverview =
    hasChildren &&
    item.href &&
    item.href !== "#" &&
    !children.some((c) => c.href === item.href);

  if (!hasChildren) {
    return (
      <Link
        href={item.href || "#"}
        className={`${scopedClass}-mrow${subClass}${selfActive ? ` ${scopedClass}-mactive` : ""}`}
        style={ROW_STYLE}
        onClick={onNavigate}
        aria-current={selfActive ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`${scopedClass}-mrow${subClass}${branchActive ? ` ${scopedClass}-mbranch` : ""}`}
        style={{ ...ROW_STYLE, color: "#374151" }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{item.label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
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
      </button>
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            margin: "2px 0 6px 14px",
            paddingLeft: 8,
            borderLeft: "2px solid #e5e7eb",
          }}
        >
          {showOverview && (
            <Link
              href={item.href}
              className={`${scopedClass}-mrow ${scopedClass}-msub${isSamePath(item.href, pathname) ? ` ${scopedClass}-mactive` : ""}`}
              style={ROW_STYLE}
              onClick={onNavigate}
            >
              Overview
            </Link>
          )}
          {children.map((child, i) => (
            <MobileItem
              key={i}
              item={child}
              depth={depth + 1}
              onNavigate={onNavigate}
              pathname={pathname}
              scopedClass={scopedClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MobileItems({ items, onNavigate, pathname, scopedClass }) {
  return (
    <>
      {items.map((item, i) => (
        <MobileItem
          key={i}
          item={item}
          depth={0}
          onNavigate={onNavigate}
          pathname={pathname}
          scopedClass={scopedClass}
        />
      ))}
    </>
  );
}

// Where the mobile panel should start (viewport px from the top).
// If the menu lives in a fixed/sticky header, anchor right under that
// whole header; otherwise fall back to just under the toggle button.
function getPanelTop(toggleEl) {
  let el = toggleEl.parentElement;
  while (el && el !== document.body) {
    const pos = window.getComputedStyle(el).position;
    if (pos === "fixed" || pos === "sticky") {
      return el.getBoundingClientRect().bottom + 4;
    }
    el = el.parentElement;
  }
  return toggleEl.getBoundingClientRect().bottom + 12;
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
    mobileMode: {
      type: "radio",
      label: "On Mobile",
      options: [
        { label: "Hamburger icon (opens a panel)", value: "toggle" },
        { label: "Show items directly (good for footers)", value: "inline" },
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
    mobileMode: "toggle",
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
    mobileMode = "toggle",
    textColor,
    hoverColor,
    fontSize,
    gap,
    blockAlign,
    margin,
  }) {
    const { themeColors } = useThemeColors();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileTop, setMobileTop] = useState(0);
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
    // The mobile panel always has a white background, so its links must
    // be dark regardless of the header's (possibly white) text color.
    const panelHover = isInherit(hoverColor) ? "#2563eb" : resolvedHover;
    const safeItems = Array.isArray(items) ? items : [];
    // "inline": never collapse into a hamburger — the items stay visible
    // (and wrap) on phones. Used for footer menus.
    const isInline = mobileMode === "inline";

    const scopedCss = `
      .${scopedClass} a { color: ${resolvedText}; transition: color 0.2s; text-decoration: none; }
      .${scopedClass} a:hover { color: ${resolvedHover}; }
      .${scopedClass}-desktop { display: flex; }
      .${scopedClass}-toggle { display: none; }
      .${scopedClass}-mobile { display: flex; }
      .${scopedClass}-backdrop { display: block; }
      .${scopedClass} .${scopedClass}-mobile a { color: #374151; }
      .${scopedClass} .${scopedClass}-mobile a:hover { color: ${panelHover}; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mrow { font-weight: 500; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-msub { font-weight: 400; font-size: 0.92em; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mrow:hover,
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mrow:active { background-color: #f3f4f6; color: ${panelHover}; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mbranch { color: ${panelHover}; font-weight: 600; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mactive { background-color: #eff6ff; color: ${panelHover}; font-weight: 600; }
      .${scopedClass} .${scopedClass}-mobile .${scopedClass}-mactive:hover { background-color: #dbeafe; }
      ${
        isInline
          ? ""
          : `@media (max-width: 767px) {
        .${scopedClass}-desktop { display: none; }
        .${scopedClass}-toggle { display: inline-flex; }
      }`
      }
      @media (min-width: 768px) {
        .${scopedClass}-mobile,
        .${scopedClass}-backdrop { display: none; }
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

    function handleToggleClick(e) {
      if (!mobileOpen) setMobileTop(getPanelTop(e.currentTarget));
      setMobileOpen((v) => !v);
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
                flexWrap: isInline ? "wrap" : "nowrap",
                alignItems:
                  orientation === "vertical" ? "flex-start" : "center",
                gap,
                overflowX:
                  orientation === "vertical" || isInline ? "visible" : "auto",
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
              onClick={handleToggleClick}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                flexShrink: 0,
                border: `1px solid ${resolvedText}`,
                borderRadius: 8,
                color: resolvedText,
                background: "transparent",
                cursor: "pointer",
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
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

            {/* Mobile menu — an overlay panel under the header, so it
                takes NO space in the header itself. Recursive,
                always-expanded, indented per depth level. Tapping the
                transparent backdrop closes it. */}
            {mobileOpen && (
              <>
                <div
                  className={`${scopedClass}-backdrop`}
                  onClick={() => setMobileOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                />
                <nav
                  className={`${scopedClass}-mobile`}
                  style={{
                    position: "fixed",
                    top: mobileTop,
                    left: 12,
                    right: 12,
                    flexDirection: "column",
                    gap: "2px",
                    padding: 8,
                    maxHeight: `calc(100vh - ${mobileTop + 16}px)`,
                    overflowY: "auto",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 9999,
                  }}
                >
                  <MobileItems
                    items={safeItems}
                    onNavigate={() => setMobileOpen(false)}
                    pathname={pathname}
                    scopedClass={scopedClass}
                  />
                </nav>
              </>
            )}
          </div>
        </div>
      </>
    );
  },
};
