// src/lib/pageBuilder/fields/responsiveStyle.js
"use client";

import { MEDIA_MAX } from "./breakpoints";

// A "responsive value" is either:
//   - a plain string (legacy / non-responsive fields, treated as desktop-only)
//   - an object like { desktop: "64px", laptop: "48px", mobile: "24px" }
//     (tablet/laptop/mobile are optional — omitted means "inherit the
//     next larger breakpoint's value", same cascading behavior as CSS
//     media queries naturally give you)
//
// Builds one real <style> block's contents for a component instance:
// a base rule (desktop values) plus @media overrides for whichever
// breakpoints were actually customized. Works identically in Puck's
// editor preview (which renders in a real iframe with real media query
// support) and on the live published page — same generated CSS either way.
export function buildResponsiveCSS(className, entries) {
  const base = [];
  const laptop = [];
  const tablet = [];
  const mobile = [];

  entries.forEach(({ property, value }) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value !== "object") {
      base.push(`${property}: ${value};`);
      return;
    }
    if (value.desktop) base.push(`${property}: ${value.desktop};`);
    if (value.laptop) laptop.push(`${property}: ${value.laptop};`);
    if (value.tablet) tablet.push(`${property}: ${value.tablet};`);
    if (value.mobile) mobile.push(`${property}: ${value.mobile};`);
  });

  let css = `.${className} { ${base.join(" ")} }`;
  if (laptop.length)
    css += ` @media (max-width: ${MEDIA_MAX.laptop}px) { .${className} { ${laptop.join(" ")} } }`;
  if (tablet.length)
    css += ` @media (max-width: ${MEDIA_MAX.tablet}px) { .${className} { ${tablet.join(" ")} } }`;
  if (mobile.length)
    css += ` @media (max-width: ${MEDIA_MAX.mobile}px) { .${className} { ${mobile.join(" ")} } }`;
  return css;
}

function mapJustify(keyword) {
  if (keyword === "center") return "center";
  if (keyword === "right") return "flex-end";
  return "flex-start"; // left / default
}

// Translates a responsive "left"/"center"/"right" value into the CSS for
// a WRAPPER element that positions its child via flexbox justify-content,
// rather than margin:auto on the child itself. Deliberately more robust
// than the margin approach: auto-margin centering only works on
// block-level boxes and can silently fail depending on the ancestor's own
// display context (grid/flex stretch behavior, Puck's own drag wrappers,
// etc), whereas a dedicated flex wrapper with justify-content works
// reliably regardless of what's around it. Apply the returned entries to
// a WRAPPER className, and put the actual content inside it.
export function alignToJustifyEntries(alignValue) {
  const obj =
    alignValue && typeof alignValue === "object"
      ? alignValue
      : { desktop: alignValue || "left" };
  const justify = {};
  for (const device of Object.keys(obj)) {
    if (!obj[device]) continue;
    justify[device] = mapJustify(obj[device]);
  }
  if (!justify.desktop) justify.desktop = "flex-start";
  return [
    { property: "display", value: "flex" },
    { property: "justify-content", value: justify },
  ];
}

// Renders the actual <style> tag. Use this once per component instance,
// passing every responsive-capable prop it has.
export function ResponsiveStyle({ className, entries }) {
  const css = buildResponsiveCSS(className, entries);
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
