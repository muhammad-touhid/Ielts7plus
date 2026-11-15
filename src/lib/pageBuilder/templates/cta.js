import { genId } from "../genId";

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
