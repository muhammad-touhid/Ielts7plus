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

import { genId } from "./genId";

// Built directly from the real, existing Hero component (full-screen
// background image, navy-to-blue gradient overlay, badge, heading, text,
// search bar, and tag pills) — not a generic approximation. Same idea as
// the other templates: every piece lands as a separate, editable layer.
//
// Structure matches the original markup's intent: the outer Section is
// FULL WIDTH (no outer max-width bounding it, background spans edge to
// edge, matching the original's `w-full`), vertically centered (matching
// `flex items-center`), with a single nested Section constraining just
// the TEXT content to a readable max-width and pinning it to the left
// (matching the original's `max-w-2xl` div inside a full-bleed section).
export function heroTemplate() {
  const sectionId = genId("section");
  const contentSectionId = genId("section");

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "1",
          columnGap: "0px",
          bgType: "image",
          bgColor: "#ffffff",
          bgImage: "/images/hero-bg.jpg",
          overlayType: "gradient",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0.85",
          minHeight: "100vh",
          verticalAlign: "center",
          contentWidth: { desktop: "none" },
          contentAlign: "center",
          padding: {
            top: { desktop: "48" },
            right: { desktop: "24" },
            bottom: { desktop: "48" },
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
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [
        {
          type: "Section",
          props: {
            id: contentSectionId,
            columns: "1",
            columnGap: "0px",
            bgType: "color",
            bgColor: "transparent",
            bgImage: "",
            overlayType: "none",
            overlayColor: "#000000",
            overlayColorFrom: "#1e3a8a",
            overlayColorTo: "#1d4ed8",
            overlayDirection: "to right",
            overlayOpacity: "0",
            minHeight: "auto",
            verticalAlign: "flex-start",
            contentWidth: { desktop: "42rem" },
            contentAlign: "left",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
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
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
          },
        },
      ],
      [`${contentSectionId}:col-0`]: [
        {
          type: "Badge",
          props: {
            id: genId("badge"),
            text: "★ #1 IELTS Preparation Platform",
            style: "translucent",
            borderRadius: {
              topLeft: { desktop: "9999px" },
              topRight: { desktop: "9999px" },
              bottomRight: { desktop: "9999px" },
              bottomLeft: { desktop: "9999px" },
              linked: true,
            },
            padding: {
              top: { desktop: "8" },
              right: { desktop: "20" },
              bottom: { desktop: "8" },
              left: { desktop: "20" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "20" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Get admitted into prestigious universities with a 7+ IELTS score",
            tag: "h1",
            size: { desktop: "3rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-extrabold",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Receive expert tutoring for an excellent IELTS score through personalized mentorship.",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#dbeafe",
            maxWidth: { desktop: "none" },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "32" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "SearchBar",
          props: {
            id: genId("searchbar"),
            placeholder: "Search courses, topics, practice tests...",
            buttonText: "Search",
            searchPath: "/search",
            width: { desktop: "32rem" },
            borderRadius: {
              topLeft: { desktop: "12px" },
              topRight: { desktop: "12px" },
              bottomRight: { desktop: "12px" },
              bottomLeft: { desktop: "12px" },
              linked: true,
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "20" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "TagList",
          props: {
            id: genId("taglist"),
            items: [
              { text: "Writing Task 2", href: "/search?q=Writing Task 2" },
              { text: "Speaking Band 7", href: "/search?q=Speaking Band 7" },
              { text: "Listening Tips", href: "/search?q=Listening Tips" },
              {
                text: "Reading Strategies",
                href: "/search?q=Reading Strategies",
              },
              { text: "Mock Tests", href: "/search?q=Mock Tests" },
            ],
            style: "translucent",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            borderRadius: {
              topLeft: { desktop: "9999px" },
              topRight: { desktop: "9999px" },
              bottomRight: { desktop: "9999px" },
              bottomLeft: { desktop: "9999px" },
              linked: true,
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
    },
  };
}

// Built directly from the real, existing Stats component — gradient
// background (left-to-right, not the generic diagonal), grid pattern +
// decorative blobs, and 4 stat cards each with a circular icon badge,
// a big number, a bold label, and supporting text.
export function statsTemplate() {
  const sectionId = genId("section");
  const items = [
    {
      icon: "ti-rosette-discount-check",
      number: "100%",
      heading: "Guaranteed Band Improvement",
      para: "Personalized strategies to boost your IELTS score.",
    },
    {
      icon: "ti-certificate-2",
      number: "100%",
      heading: "Certified IELTS Trainers",
      para: "Experienced, British Council-trained instructors.",
    },
    {
      icon: "ti-calendar-event",
      number: "24",
      heading: "Flexible Class Schedules",
      para: "Morning, evening, and weekend batches to suit your lifestyle.",
    },
    {
      icon: "ti-clipboard-text",
      number: "100%",
      heading: "Mock Tests & Real Exam Simulation",
      para: "Regular practice with full-length tests under exam conditions.",
    },
  ];

  const zones = {};
  items.forEach((item, i) => {
    zones[`${sectionId}:col-${i}`] = [
      {
        type: "IconBlock",
        props: {
          id: genId("icon"),
          icon: item.icon,
          size: "text-3xl",
          color: "#ffffff",
          containerStyle: "circle-translucent",
          containerSize: "medium",
          blockAlign: { desktop: "center" },
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
          padding: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "0" },
            left: { desktop: "0" },
            linked: true,
            unit: "px",
          },
          margin: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "20" },
            left: { desktop: "0" },
            linked: false,
            unit: "px",
          },
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: item.number,
          tag: "h3",
          size: { desktop: "2.25rem" },
          align: { desktop: "center" },
          maxWidth: { desktop: "none" },
          blockAlign: { desktop: "center" },
          color: "#ffffff",
          weight: "font-extrabold",
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
          padding: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "0" },
            left: { desktop: "0" },
            linked: true,
            unit: "px",
          },
          margin: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "8" },
            left: { desktop: "0" },
            linked: false,
            unit: "px",
          },
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: item.heading,
          tag: "h4",
          size: { desktop: "1rem" },
          align: { desktop: "center" },
          maxWidth: { desktop: "none" },
          blockAlign: { desktop: "center" },
          color: "#ffffff",
          weight: "font-bold",
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
          padding: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "0" },
            left: { desktop: "0" },
            linked: true,
            unit: "px",
          },
          margin: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "4" },
            left: { desktop: "0" },
            linked: false,
            unit: "px",
          },
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: item.para,
          size: { desktop: "0.875rem" },
          align: { desktop: "center" },
          maxWidth: { desktop: "none" },
          blockAlign: { desktop: "center" },
          color: "#dbeafe",
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
          padding: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "0" },
            left: { desktop: "0" },
            linked: true,
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
        },
      },
    ];
  });

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "4-equal",
          columnGap: "40px",
          bgType: "gradient",
          bgColor: "#ffffff",
          bgImage: "",
          bgGradientDirection: "to right",
          decorative: "grid-blobs",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "72rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "64" },
            right: { desktop: "20" },
            bottom: { desktop: "64" },
            left: { desktop: "20" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
    ],
    zones,
  };
}

// Built directly from the real, existing CTA component — full-bleed
// brand gradient (matches Section's "grid-blobs" decorative option
// exactly: same blob positions/sizes/colors and grid pattern), eyebrow
// badge, headline, paragraph, two buttons, and a small avatar-row social
// proof line.
//
// KNOWN GAPS vs the original CTASection.jsx — no current widget covers
// these exactly, so they're approximated. See notes below:
//   1. Eyebrow badge uses ButtonBlock (for its icon slot) instead of
//      Badge. Original colors the icon amber separately from white
//      text — ButtonBlock has one textColor for both, so no two-tone.
//   2. The hand-drawn SVG squiggle under "Starts Today" — Heading is
//      plain text only, squiggle dropped, both lines merged into one
//      heading string.
//   3. Avatar row uses 4 ImageBlocks in a narrow nested Section to fake
//      fixed ~32px circles (ImageBlock's width field is percentage-only,
//      not px) with negative left margin for the overlap — assumes the
//      margin field accepts negative numbers. If the editor clamps to
//      0+, avatars will render with gaps instead of overlapping.
// Buttons are approximated as a 2-column Section (not a true flex row),
// since none of the current widgets do inline flex-wrap of siblings.
export function ctaTemplate() {
  const sectionId = genId("section");
  const buttonRowId = genId("section");

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "1",
          columnGap: "0px",
          bgType: "gradient",
          bgColor: "#ffffff",
          bgImage: "",
          bgGradientDirection: "to bottom right",
          decorative: "grid-blobs",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "center",
          contentWidth: { desktop: "48rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "112" },
            right: { desktop: "20" },
            bottom: { desktop: "112" },
            left: { desktop: "20" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            text: "Limited Seats Available — Batch Starting Soon",
            href: "",
            variant: "transparent",
            bgColor: "#ffffff",
            bgOpacity: "15",
            textColor: "#ffffff",
            weight: "font-bold",
            textCase: "uppercase",
            icon: "ti-clock-hour-4",
            iconPosition: "left",
            width: "inline-block",
            size: { desktop: "0.75rem" },
            align: { desktop: "center" },
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#ffffff33",
            borderRadius: {
              topLeft: { desktop: "9999px" },
              topRight: { desktop: "9999px" },
              bottomRight: { desktop: "9999px" },
              bottomLeft: { desktop: "9999px" },
              linked: true,
            },
            padding: {
              top: { desktop: "8" },
              right: { desktop: "20" },
              bottom: { desktop: "8" },
              left: { desktop: "20" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "24" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Your Band 7+ Journey Starts Today",
            tag: "h1",
            size: { desktop: "2.25rem" },
            align: { desktop: "center" },
            maxWidth: { desktop: "none" },
            blockAlign: { desktop: "center" },
            color: "#ffffff",
            weight: "font-bold",
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "24" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Join over 5,000 students who achieved their target IELTS score with expert-led coaching, structured practice, and personalised feedback — all designed to get you to Band 7+ faster.",
            size: { desktop: "1.125rem" },
            align: { desktop: "center" },
            color: "#dbeafe",
            maxWidth: { desktop: "36rem" },
            blockAlign: { desktop: "center" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "32" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Section",
          props: {
            id: buttonRowId,
            columns: "2-equal",
            columnGap: "16px",
            bgType: "color",
            bgColor: "transparent",
            bgImage: "",
            overlayType: "none",
            overlayColor: "#000000",
            overlayColorFrom: "#1e3a8a",
            overlayColorTo: "#1d4ed8",
            overlayDirection: "to right",
            overlayOpacity: "0",
            minHeight: "auto",
            verticalAlign: "center",
            contentWidth: { desktop: "36rem" },
            contentAlign: "center",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
          },
        },
        {
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            // Real flexbox row + inline styles, not Tailwind classes —
            // this HTML is stored in the DB and served via
            // dangerouslySetInnerHTML, so Tailwind's build-time JIT
            // scanner never sees it and won't generate any classes
            // referenced here (same purge risk flagged earlier for the
            // HowItWorks card HTML). Inline styles sidestep that
            // entirely. Edit the html string directly to change avatar
            // count, size, overlap, ring color, or label text.
            html: `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;">
  <div style="display:flex;align-items:center;">
    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="student" style="width:32px;height:32px;border-radius:9999px;object-fit:cover;display:block;box-shadow:0 0 0 2px #2563eb;margin-left:0;" />
    <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="student" style="width:32px;height:32px;border-radius:9999px;object-fit:cover;display:block;box-shadow:0 0 0 2px #2563eb;margin-left:-10px;" />
    <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="student" style="width:32px;height:32px;border-radius:9999px;object-fit:cover;display:block;box-shadow:0 0 0 2px #2563eb;margin-left:-10px;" />
    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="student" style="width:32px;height:32px;border-radius:9999px;object-fit:cover;display:block;box-shadow:0 0 0 2px #2563eb;margin-left:-10px;" />
  </div>
  <p style="margin:0;color:#bfdbfe;font-size:0.875rem;">
    <span style="font-weight:700;color:#ffffff;">2,400+ students</span> enrolled this month
  </p>
</div>`,
            blockAlign: { desktop: "center" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
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
          },
        },
      ],
      [`${buttonRowId}:col-0`]: [
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            text: "Book a Free Consultation",
            href: "/contact",
            variant: "filled",
            bgColor: "#ffffff",
            bgOpacity: "100",
            textColor: "#2563eb",
            weight: "font-bold",
            textCase: "none",
            icon: "ti-calendar-event",
            iconPosition: "left",
            width: "inline-block",
            size: { desktop: "0.875rem" },
            align: { desktop: "center" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "9999px" },
              topRight: { desktop: "9999px" },
              bottomRight: { desktop: "9999px" },
              bottomLeft: { desktop: "9999px" },
              linked: true,
            },
            padding: {
              top: { desktop: "16" },
              right: { desktop: "32" },
              bottom: { desktop: "16" },
              left: { desktop: "32" },
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
          },
        },
      ],
      [`${buttonRowId}:col-1`]: [
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            text: "Explore Courses",
            href: "/courses",
            variant: "transparent",
            bgColor: "#ffffff",
            bgOpacity: "10",
            textColor: "#ffffff",
            weight: "font-bold",
            textCase: "none",
            icon: "ti-books",
            iconPosition: "left",
            width: "inline-block",
            size: { desktop: "0.875rem" },
            align: { desktop: "center" },
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "#ffffff66",
            borderRadius: {
              topLeft: { desktop: "9999px" },
              topRight: { desktop: "9999px" },
              bottomRight: { desktop: "9999px" },
              bottomLeft: { desktop: "9999px" },
              linked: true,
            },
            padding: {
              top: { desktop: "16" },
              right: { desktop: "32" },
              bottom: { desktop: "16" },
              left: { desktop: "32" },
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
          },
        },
      ],
    },
  };
}

// Starting point for the "site-header" Page (see reservedSlugs.js /
// getPublishedPage.js) — logo (links home) + horizontal Menu with
// dropdowns matching the real Header.jsx's nav structure + a Sign In /
// Dashboard auth button.
//
// KNOWN GAPS vs the real Header.jsx (accepted when choosing full
// replacement over keeping the real Header):
//   - No scroll-triggered background/color change (Section has no
//     scroll-aware behavior).
//   - Logo sizing is approximate — ImageBlock's width field is
//     percentage-only, not fixed px, same limitation flagged for the
//     CTA template's avatar row. Adjust in the editor if it renders too
//     big/small for a 1/3-width column.
//   - 3-equal column split (logo | menu | auth button) is a rough
//     approximation of the real header's logo-left/nav-center/cta-right
//     layout, not a pixel match.
export function headerTemplate() {
  const sectionId = genId("section");
  const logoSectionId = genId("section");
  const menuSectionId = genId("section");
  const buttonSectionId = genId("section");

  // Nested-Section-per-slot helper — same pattern as heroTemplate's
  // inner content Section and ctaTemplate's button-row Section. Each
  // slot gets its OWN contentWidth (resizable) and contentAlign
  // (horizontal position), independent of the other slots — this is
  // what actually gives you per-slot alignment control, rather than
  // relying on each widget's own blockAlign inside a rigid equal-width
  // grid column.
  function slotSection(slotId, align, width) {
    return {
      type: "Section",
      props: {
        id: slotId,
        columns: "1",
        columnGap: "0px",
        columnAlign: "center", // vertical centering within the slot
        bgType: "color",
        bgColor: "transparent",
        bgImage: "",
        overlayType: "none",
        overlayColor: "#000000",
        overlayColorFrom: "#1e3a8a",
        overlayColorTo: "#1d4ed8",
        overlayDirection: "to right",
        overlayOpacity: "0",
        minHeight: "auto",
        verticalAlign: "center",
        // MUST be narrower than the slot's actual column width for
        // contentAlign's left/center/right margin trick to have any
        // visible effect — "none" (no constraint) makes the box fill
        // 100% of the column, leaving zero free space to shift within,
        // so contentAlign silently does nothing regardless of value.
        // Resize freely in the editor — just don't set it back to "none".
        contentWidth: { desktop: width },
        contentAlign: align, // "left" | "center" | "right"
        stickyMode: "static",
        padding: {
          top: { desktop: "0" },
          right: { desktop: "0" },
          bottom: { desktop: "0" },
          left: { desktop: "0" },
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
        borderWidth: "0px",
        borderStyle: "none",
        borderColor: "transparent",
        borderRadius: {
          topLeft: { desktop: "0px" },
          topRight: { desktop: "0px" },
          bottomRight: { desktop: "0px" },
          bottomLeft: { desktop: "0px" },
          linked: true,
        },
      },
    };
  }

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "3-equal",
          columnGap: "24px",
          columnAlign: "center",
          bgType: "color",
          bgColor: "transparent", // transparent at top — hero shows through
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "center",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          // "fixed", not "sticky" — sticky stays in normal document
          // flow until you scroll past it, which pushes Hero down
          // below it instead of the header floating transparently on
          // top of Hero from the first pixel. Fixed removes the header
          // from flow entirely so Hero starts at the true top of the
          // page. Tradeoff: any OTHER page's content that immediately
          // follows the header and does NOT want to be covered by it
          // will need manual top padding added in the editor — Hero
          // wants the overlap, most other first-sections won't.
          stickyMode: "fixed",
          scrollBgColor: "#ffffff",
          scrollThreshold: 10,
          padding: {
            top: { desktop: "16" },
            right: { desktop: "24" },
            bottom: { desktop: "16" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [slotSection(logoSectionId, "left", "24rem")],
      [`${sectionId}:col-1`]: [slotSection(menuSectionId, "center", "40rem")],
      [`${sectionId}:col-2`]: [slotSection(buttonSectionId, "right", "24rem")],

      [`${logoSectionId}:col-0`]: [
        {
          type: "ImageBlock",
          props: {
            id: genId("image"),
            src: "/images/IELTS7.jpeg",
            alt: "IELTS7+ logo",
            href: "/",
            width: "25%",
            height: "auto",
            fit: "object-cover",
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "8px" },
              topRight: { desktop: "8px" },
              bottomRight: { desktop: "8px" },
              bottomLeft: { desktop: "8px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
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
          },
        },
      ],
      [`${menuSectionId}:col-0`]: [
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              {
                label: "Courses",
                href: "/courses",
                children: [
                  { label: "All Courses", href: "/courses" },
                  { label: "Batch Schedule", href: "/batch-schedule" },
                  { label: "IELTS", href: "/courses/ielts-preparation" },
                  {
                    label: "Spoken English",
                    href: "/courses/spoken-english",
                  },
                  {
                    label: "Advance Writing",
                    href: "/courses/advanced-writing",
                  },
                  {
                    label: "Grammar & Writing",
                    href: "/courses/grammar-writing",
                  },
                ],
              },
              {
                label: "Mock Test",
                href: "/mock-test",
                children: [
                  { label: "Mock Test", href: "/mock-test" },
                  { label: "IELTS Calculator", href: "/band-calculator" },
                ],
              },
              {
                label: "About Us",
                href: "/about",
                children: [
                  { label: "About Us", href: "/about" },
                  { label: "Success Stories", href: "/success-stories" },
                  { label: "Guides", href: "/guides" },
                  { label: "FAQ", href: "/faq" },
                ],
              },
              { label: "Events", href: "/events", children: [] },
              { label: "Blog", href: "/blog", children: [] },
              { label: "Contact", href: "/contact", children: [] },
            ],
            orientation: "horizontal",
            textColor: "#374151",
            hoverColor: "#2563eb",
            fontSize: { desktop: "0.9375rem" },
            gap: "18px",
            blockAlign: { desktop: "center" },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
      [`${buttonSectionId}:col-0`]: [
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            isAuthButton: true,
            text: "Sign In",
            href: "",
            variant: "filled",
            font: { type: "theme", token: "button" },
            bgColor: "#2563eb",
            bgOpacity: "100",
            textColor: "#ffffff",
            weight: "font-bold",
            textCase: "none",
            icon: "ti-login",
            iconPosition: "left",
            width: "inline-block",
            size: { desktop: "0.875rem" },
            align: { desktop: "right" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "8px" },
              topRight: { desktop: "8px" },
              bottomRight: { desktop: "8px" },
              bottomLeft: { desktop: "8px" },
              linked: true,
            },
            padding: {
              top: { desktop: "10" },
              right: { desktop: "18" },
              bottom: { desktop: "10" },
              left: { desktop: "18" },
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
            dashboardLabel: "Dashboard",
            signOutLabel: "Sign Out",
            avatarColor: "#2563eb",
            nameColor: "#1e293b",
          },
        },
      ],
    },
  };
}

// Starting point for the "site-footer" Page — dark background, 4
// columns (logo+text+social / quick links / resources / contact),
// matching the real Footer.jsx's structure.
//
// KNOWN GAPS vs the real Footer.jsx:
//   - Social icon row and the contact-info block use HtmlBlock (raw
//     HTML, inline styles) since no widget covers icon-only link rows
//     or a labeled icon+text list — same reasoning as the CTA
//     template's avatar row.
//   - The newsletter signup input+button is dropped entirely — no
//     widget handles form submission, and building one is out of scope
//     here. Add it back via HtmlBlock (display only, won't actually
//     submit anywhere) or wire up a real form widget later if needed.
export function footerTemplate() {
  const sectionId = genId("section");
  const dividerSectionId = genId("section");
  const bottomSectionId = genId("section");

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "4-equal",
          columnGap: "32px",
          bgType: "color",
          bgColor: "#111827",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "80" },
            right: { desktop: "24" },
            bottom: { desktop: "40" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
      {
        type: "Section",
        props: {
          id: dividerSectionId,
          columns: "1",
          columnGap: "0px",
          bgType: "color",
          bgColor: "#1f2937",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "1px",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "0" },
            right: { desktop: "24" },
            bottom: { desktop: "0" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
      {
        type: "Section",
        props: {
          id: bottomSectionId,
          columns: "2-equal",
          columnGap: "16px",
          columnAlign: "center",
          bgType: "color",
          bgColor: "#111827",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "24" },
            right: { desktop: "24" },
            bottom: { desktop: "24" },
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
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
    ],
    zones: {
      [`${bottomSectionId}:col-0`]: [
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "© 2026 IELTS7+. All rights reserved.",
            size: { desktop: "0.75rem" },
            align: { desktop: "left" },
            color: "#4b5563",
            maxWidth: { desktop: "none" },
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
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
          },
        },
      ],
      [`${bottomSectionId}:col-1`]: [
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              { label: "Privacy Policy", href: "/privacy", children: [] },
              { label: "Terms of Service", href: "/terms", children: [] },
              { label: "Cookie Policy", href: "/cookies", children: [] },
            ],
            orientation: "horizontal",
            textColor: "#4b5563",
            hoverColor: "#9ca3af",
            fontSize: { desktop: "0.75rem" },
            gap: "24px",
            blockAlign: { desktop: "right" },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
      [`${sectionId}:col-0`]: [
        {
          type: "ImageBlock",
          props: {
            id: genId("image"),
            src: "/images/IELTS7.jpeg",
            alt: "IELTS7+ logo",
            href: "/",
            width: "50%",
            height: "auto",
            fit: "object-cover",
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "8px" },
              topRight: { desktop: "8px" },
              bottomRight: { desktop: "8px" },
              bottomLeft: { desktop: "8px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Your trusted partner for achieving IELTS band 7 and above. Expert-led courses, real practice tests, and personalized feedback.",
            size: { desktop: "0.9375rem" },
            align: { desktop: "left" },
            color: "#9ca3af",
            maxWidth: { desktop: "none" },
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "20" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div style="display:flex;gap:8px;">
  <a href="https://www.facebook.com/ielts7plus" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-facebook"></i></a>
  <a href="https://www.instagram.com/ielts.7plus" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-instagram"></i></a>
  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-youtube"></i></a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-linkedin"></i></a>
</div>`,
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
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
          },
        },
      ],
      [`${sectionId}:col-1`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Quick Links",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              {
                label: "IELTS",
                href: "/courses/ielts-preparation",
                children: [],
              },
              {
                label: "IELTS Preparation",
                href: "/courses/ielts-preparation",
                children: [],
              },
              {
                label: "IELTS Score Calculator",
                href: "/courses",
                children: [],
              },
              { label: "Course Fees", href: "/course-fee", children: [] },
              {
                label: "Batch Schedule",
                href: "/batch-schedule",
                children: [],
              },
              {
                label: "Success Stories",
                href: "/success-stories",
                children: [],
              },
            ],
            orientation: "vertical",
            textColor: "#d1d5db",
            hoverColor: "#f87171",
            fontSize: { desktop: "0.9375rem" },
            gap: "10px",
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
        },
      ],
      [`${sectionId}:col-2`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Resources",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              { label: "Blog", href: "/blog", children: [] },
              { label: "Events", href: "/events", children: [] },
              { label: "Podcast", href: "#", children: [] },
              { label: "FAQs", href: "/faq", children: [] },
              { label: "Community", href: "#", children: [] },
              { label: "Support", href: "/contact", children: [] },
            ],
            orientation: "vertical",
            textColor: "#d1d5db",
            hoverColor: "#f87171",
            fontSize: { desktop: "0.9375rem" },
            gap: "10px",
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
        },
      ],
      [`${sectionId}:col-3`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Contact Us",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div style="display:flex;flex-direction:column;gap:12px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-mail" style="font-size:1.25rem;color:#f87171;"></i>
    <a href="mailto:info@ielts7plus.co.uk" style="color:#d1d5db;text-decoration:none;">info@ielts7plus.co.uk</a>
  </div>
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-phone" style="font-size:1.25rem;color:#f87171;"></i>
    <a href="tel:+8801711153678" style="color:#d1d5db;text-decoration:none;">+8801711153678</a>
  </div>
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-map-pin" style="font-size:1.25rem;color:#f87171;"></i>
    <span style="color:#d1d5db;">Dhaka, Bangladesh</span>
  </div>
</div>`,
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
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
          },
        },
        {
          // NEWSLETTER — added below Contact Us info. Inline styles
          // (not Tailwind classes) for the same reason the social-icon
          // row and contact-info blocks above use them: this html is
          // served via dangerouslySetInnerHTML, so Tailwind's JIT never
          // scans it and would purge any classes referenced here.
          // Hover on the button uses inline onmouseover/onmouseout
          // since inline styles can't express :hover.
          // NOTE: this is DISPLAY ONLY — the form has no onsubmit
          // handler, so clicking Subscribe does not currently POST
          // anywhere. Wire it to a real endpoint (e.g. an
          // /api/newsletter route) if/when you want it functional.
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div>
  <p style="margin:0 0 8px 0;font-size:0.75rem;color:#6b7280;">Subscribe to our newsletter</p>
  <div style="display:flex;overflow:hidden;border-radius:8px;border:1px solid #374151;">
    <input
      type="email"
      placeholder="Your email address"
      style="flex:1 1 0%;min-width:0;background-color:#1f2937;padding:8px 12px;font-size:0.875rem;color:#ffffff;outline:none;border:none;"
    />
    <button
      style="background-color:#ef4444;flex-shrink:0;padding:8px 16px;font-size:0.875rem;font-weight:500;color:#ffffff;border:none;cursor:pointer;transition:background-color 0.2s;"
      onmouseover="this.style.backgroundColor='#f87171'"
      onmouseout="this.style.backgroundColor='#ef4444'"
    >
      Subscribe
    </button>
  </div>
</div>`,
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "0px" },
              topRight: { desktop: "0px" },
              bottomRight: { desktop: "0px" },
              bottomLeft: { desktop: "0px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
              unit: "px",
            },
            margin: {
              top: { desktop: "20" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
    },
  };
}

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
