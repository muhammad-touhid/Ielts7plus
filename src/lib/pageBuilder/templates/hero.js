import { genId } from "../genId";

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
