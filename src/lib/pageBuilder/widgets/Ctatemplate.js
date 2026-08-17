// Add to templates.js (needs `genId` already imported there).
//
// KNOWN GAPS vs the original CTASection.jsx — no current widget covers
// these exactly, so they're approximated. See chat notes:
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
//
// Buttons are approximated as a 2-column Section (not a true flex row),
// since none of the current widgets do inline flex-wrap of siblings.
//
// Per the padding/radius bug fixed earlier: every field a widget's
// defaultProps would normally supply (borderRadius, borderWidth, etc.)
// is set EXPLICITLY here, since template insertion does not reliably
// merge in defaultProps.

export function ctaTemplate() {
  const sectionId = genId("section");
  const buttonRowId = genId("section");
  const avatarRowId = genId("section");

  // 32px circular avatar, ring border approximating the original's
  // `ring-2 ring-blue-600`, negative left margin for the `-space-x-2.5`
  // overlap (first avatar gets no negative margin so it isn't clipped
  // by the column edge). ImageBlock's width field is percentage-only —
  // 100% resolves to ~32px ONLY because avatarRowId's columns are
  // narrow (see contentWidth below). Adjust contentWidth if avatars
  // render bigger/smaller than expected.
  function avatarImage(src, isFirst) {
    return {
      type: "ImageBlock",
      props: {
        id: genId("image"),
        src,
        alt: "student",
        width: "100%",
        height: "auto",
        fit: "object-cover",
        blockAlign: { desktop: "center" },
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "#2563eb",
        borderRadius: {
          topLeft: { desktop: "9999px" },
          topRight: { desktop: "9999px" },
          bottomRight: { desktop: "9999px" },
          bottomLeft: { desktop: "9999px" },
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
          left: { desktop: isFirst ? "0" : "-10" }, // assumes negative allowed
          linked: false,
          unit: "px",
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
          contentWidth: { desktop: "48rem" }, // matches original's max-w-3xl
          contentAlign: "center",
          padding: {
            top: { desktop: "112" }, // py-28
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
            // Original also colors this icon amber (text-amber-300)
            // separately from the white text — ButtonBlock has one
            // textColor for both icon + text, so it's white here, not
            // two-tone. See file header.
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
            // Squiggle SVG under "Starts Today" dropped — see file header.
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
            maxWidth: { desktop: "36rem" }, // matches original's max-w-xl
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
        // Approximated flex button row via a 2-column Section — see
        // file header for why this isn't a true flex row.
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
          type: "Section",
          props: {
            id: avatarRowId,
            columns: "4-equal",
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
            verticalAlign: "center",
            contentWidth: { desktop: "8rem" }, // narrow -> ~32px per avatar
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
              bottom: { desktop: "8" },
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
          type: "Text",
          props: {
            id: genId("text"),
            text: "2,400+",
            size: { desktop: "0.875rem" },
            align: { desktop: "center" },
            color: "#ffffff",
            weight: "font-bold",
            maxWidth: { desktop: "none" },
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
              bottom: { desktop: "0" },
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
            text: "students enrolled this month",
            size: { desktop: "0.875rem" },
            align: { desktop: "center" },
            color: "#bfdbfe",
            maxWidth: { desktop: "none" },
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
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
      [`${avatarRowId}:col-0`]: [
        avatarImage("https://randomuser.me/api/portraits/women/44.jpg", true),
      ],
      [`${avatarRowId}:col-1`]: [
        avatarImage("https://randomuser.me/api/portraits/women/32.jpg", false),
      ],
      [`${avatarRowId}:col-2`]: [
        avatarImage("https://randomuser.me/api/portraits/women/68.jpg", false),
      ],
      [`${avatarRowId}:col-3`]: [
        avatarImage("https://randomuser.me/api/portraits/women/75.jpg", false),
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
