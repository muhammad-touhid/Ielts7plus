// src/lib/pageBuilder/templates.js
//
// Each function returns a { content, zones } fragment built entirely out
// of the atomic widgets (Section, Heading, Text, ImageBlock, ButtonBlock,
// IconBlock, etc.). Clicking "Insert" in the Templates panel merges this
// fragment into the page — every piece lands on the canvas as its own
// real, separate component: selectable, editable, and deletable
// individually, exactly like any other layer you dragged in by hand.
//
// Note: Subsection was retired. Anywhere a template previously nested a
// Subsection inside a Section for a pinned/narrow content block, it now
// nests a plain Section instead, using that Section's own
// "Content Alignment" field (left/center/right) and a transparent
// background (bgType: "color", bgColor: "transparent").
//
// IMPORTANT — template insertion does NOT reliably merge in a widget's
// defaultProps (confirmed while building the hero template: Badge,
// SearchBar, and TagList rendered with zero border-radius because their
// borderRadius was left unset, expecting a defaultProps fallback that
// never happened). Every field that matters visually — borderRadius,
// borderWidth/Style/Color, padding, margin — is set EXPLICITLY in every
// widget below, even when the value matches that widget's own default.

import { heroTemplate } from "./hero";
import { statsTemplate } from "./stats";
import { ctaTemplate } from "./cta";
import { headerTemplate } from "./header";
import { footerTemplate } from "./footer";

export { heroTemplate, statsTemplate, ctaTemplate, headerTemplate, footerTemplate };

export const templates = [
  {
    key: "hero",
    label: "Hero",
    description: "Your actual homepage hero — bg image, badge, search, tags",
    build: heroTemplate,
  },
  {
    key: "stats",
    label: "Stats",
    description: "Your actual stats section — gradient, blobs, 4 icon cards",
    build: statsTemplate,
  },
  {
    key: "cta",
    label: "CTA",
    description:
      "Your actual CTA section — gradient, badge, headline, buttons, avatars",
    build: ctaTemplate,
  },
  {
    key: "header",
    label: "Header",
    description:
      "Starting point for the site header — logo, nav menu, auth button",
    build: headerTemplate,
  },
  {
    key: "footer",
    label: "Footer",
    description:
      "Starting point for the site footer — 4 columns, social, contact",
    build: footerTemplate,
  },
];

