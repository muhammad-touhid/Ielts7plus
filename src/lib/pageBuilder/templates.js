// src/lib/pageBuilder/templates.js
//
// Each function returns a { content, zones } fragment built entirely out
// of the atomic widgets (Section, Subsection, Heading, Text, ImageBlock,
// ButtonBlock, IconBlock). Clicking "Insert" in the Templates panel merges
// this fragment into the page — every piece lands on the canvas as its
// own real, separate component: selectable, editable, and deletable
// individually, exactly like any other layer you dragged in by hand.

import { genId } from "./genId";

export function heroTemplate() {
  const sectionId = genId("section");
  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "1",
          columnGap: "32px",
          bgType: "gradient",
          bgColor: "#354e98",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "75vh",
          verticalAlign: "center",
          contentWidth: { desktop: "48rem" },
          padding: { top: { desktop: "96px" }, right: { desktop: "24px" }, bottom: { desktop: "96px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Master IELTS With Confidence",
            tag: "h1",
            size: { desktop: "3.75rem" },
            align: { desktop: "center" },
            color: "#ffffff",
            weight: "font-extrabold",
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "16px" }, left: { desktop: "0px" }, linked: false },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Structured courses, expert mentors, and real mock tests to get the score you need.",
            size: { desktop: "1.125rem" },
            align: { desktop: "center" },
            color: "#e5e7eb",
            maxWidth: { desktop: "42rem" },
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "32px" }, left: { desktop: "0px" }, linked: false },
          },
        },
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            text: "Explore Courses",
            href: "/courses",
            variant: "filled",
            bgColor: "#ffffff",
            bgOpacity: "100",
            textColor: "#2563eb",
            weight: "font-bold",
            icon: "",
            iconPosition: "right",
            size: { desktop: "1.125rem" },
            width: "inline-block",
            align: { desktop: "center" },
            padding: { top: { desktop: "16px" }, right: { desktop: "32px" }, bottom: { desktop: "16px" }, left: { desktop: "32px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          },
        },
      ],
    },
  };
}

export function statsTemplate() {
  const sectionId = genId("section");
  const stats = [
    { number: "1000+", label: "Students Enrolled" },
    { number: "8.5", label: "Highest Band Score" },
    { number: "50+", label: "Expert Mentors" },
    { number: "95%", label: "Success Rate" },
  ];

  const zones = {};
  stats.forEach((stat, i) => {
    zones[`${sectionId}:col-${i}`] = [
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: stat.number,
          tag: "h3",
          size: { desktop: "2.25rem" },
          align: { desktop: "center" },
          color: "#2563eb",
          weight: "font-bold",
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "4px" }, left: { desktop: "0px" }, linked: false },
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: stat.label,
          size: { desktop: "0.875rem" },
          align: { desktop: "center" },
          color: "#6b7280",
          maxWidth: { desktop: "none" },
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
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
          columnGap: "32px",
          bgType: "color",
          bgColor: "#ffffff",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "72rem" },
          padding: { top: { desktop: "64px" }, right: { desktop: "24px" }, bottom: { desktop: "64px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ],
    zones,
  };
}

export function testimonialTemplate() {
  const headingSectionId = genId("section");
  const cardsSectionId = genId("section");
  const testimonials = [
    { quote: "This platform completely changed how I prepared for IELTS.", name: "Ayesha Rahman", role: "Band 8.0" },
    { quote: "The mock tests felt exactly like the real exam.", name: "Tanvir Ahmed", role: "Band 7.5" },
  ];

  const zones = {};
  testimonials.forEach((t, i) => {
    const subsectionId = genId("subsection");
    zones[`${cardsSectionId}:col-${i}`] = [
      {
        type: "Subsection",
        props: {
          id: subsectionId,
          bgType: "color",
          bgColor: "#f9fafb",
          bgImage: "",
          minHeight: "auto",
          padding: { top: { desktop: "32px" }, right: { desktop: "32px" }, bottom: { desktop: "32px" }, left: { desktop: "32px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          borderRadius: { topLeft: { desktop: "8px" }, topRight: { desktop: "8px" }, bottomRight: { desktop: "8px" }, bottomLeft: { desktop: "8px" }, linked: true },
        },
      },
    ];
    zones[`${subsectionId}:content`] = [
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: `“${t.quote}”`,
          size: { desktop: "1rem" },
          align: { desktop: "left" },
          color: "#374151",
          maxWidth: { desktop: "none" },
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "16px" }, left: { desktop: "0px" }, linked: false },
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: t.name,
          tag: "h4",
          size: { desktop: "1.5rem" },
          align: { desktop: "left" },
          color: "#111827",
          weight: "font-medium",
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: t.role,
          size: { desktop: "0.875rem" },
          align: { desktop: "left" },
          color: "#6b7280",
          maxWidth: { desktop: "none" },
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ];
  });

  return {
    content: [
      {
        type: "Section",
        props: {
          id: headingSectionId,
          columns: "1",
          columnGap: "32px",
          bgType: "color",
          bgColor: "#ffffff",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "72rem" },
          padding: { top: { desktop: "32px" }, right: { desktop: "24px" }, bottom: { desktop: "32px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
      {
        type: "Section",
        props: {
          id: cardsSectionId,
          columns: "2-equal",
          columnGap: "32px",
          bgType: "color",
          bgColor: "#ffffff",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "72rem" },
          padding: { top: { desktop: "32px" }, right: { desktop: "24px" }, bottom: { desktop: "32px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ],
    zones: {
      [`${headingSectionId}:col-0`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "What Our Students Say",
            tag: "h2",
            size: { desktop: "2.25rem" },
            align: { desktop: "center" },
            color: "#111827",
            weight: "font-bold",
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          },
        },
      ],
      ...zones,
    },
  };
}

export function featureGridTemplate() {
  const sectionId = genId("section");
  const features = [
    { icon: "ti-headphones", title: "Listening", text: "4-section practice with real exam audio." },
    { icon: "ti-book", title: "Reading", text: "3 passages covering every question type." },
    { icon: "ti-pencil", title: "Writing", text: "Task 1 & 2 with structured feedback." },
    { icon: "ti-microphone", title: "Speaking", text: "Real recorded mock interviews." },
  ];

  const zones = {};
  features.forEach((f, i) => {
    const subsectionId = genId("subsection");
    zones[`${sectionId}:col-${i}`] = [
      {
        type: "Subsection",
        props: {
          id: subsectionId,
          bgType: "color",
          bgColor: "#ffffff",
          bgImage: "",
          minHeight: "auto",
          padding: { top: { desktop: "24px" }, right: { desktop: "24px" }, bottom: { desktop: "24px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          borderRadius: { topLeft: { desktop: "8px" }, topRight: { desktop: "8px" }, bottomRight: { desktop: "8px" }, bottomLeft: { desktop: "8px" }, linked: true },
        },
      },
    ];
    zones[`${subsectionId}:content`] = [
      {
        type: "IconBlock",
        props: {
          id: genId("icon"),
          icon: f.icon,
          size: "text-3xl",
          color: "#2563eb",
          padding: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: false,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "8px" },
            left: { desktop: "0px" },
            linked: false,
          },
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: f.title,
          tag: "h4",
          size: { desktop: "1.5rem" },
          align: { desktop: "left" },
          color: "#111827",
          weight: "font-medium",
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "8px" }, left: { desktop: "0px" }, linked: false },
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: f.text,
          size: { desktop: "0.875rem" },
          align: { desktop: "left" },
          color: "#6b7280",
          maxWidth: { desktop: "none" },
          padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
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
          columnGap: "24px",
          bgType: "color",
          bgColor: "#f9fafb",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "72rem" },
          padding: { top: { desktop: "64px" }, right: { desktop: "24px" }, bottom: { desktop: "64px" }, left: { desktop: "24px" }, linked: false },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ],
    zones,
  };
}

// Built directly from the real, existing Hero component (full-screen
// background image, navy-to-blue gradient overlay, badge, heading, text,
// search bar, and tag pills) — not a generic approximation. Same idea as
// the other templates: every piece lands as a separate, editable layer.
//
// Structure matches the original markup's intent: the Section itself is
// FULL WIDTH (no outer max-width bounding it, background spans edge to
// edge, matching the original's `w-full`), vertically centered (matching
// `flex items-center`), with a single Subsection constraining just the
// TEXT content to a readable max-width and pinning it to the left
// (matching the original's `max-w-2xl` div inside a full-bleed section).
export function realHeroTemplate() {
  const sectionId = genId("section");
  const contentSubsectionId = genId("subsection");

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
          overlayColorFrom: "#1e3a8a", // blue-900
          overlayColorTo: "#1d4ed8", // blue-700
          overlayDirection: "to right",
          overlayOpacity: "0.85",
          minHeight: "100vh",
          verticalAlign: "center", // matches original's `flex items-center`
          contentWidth: { desktop: "none" }, // full width, matches original's `w-full` — no outer bounding
          padding: {
            top: { desktop: "48px" },
            right: { desktop: "24px" }, // matches original's container `px-6`
            bottom: { desktop: "48px" },
            left: { desktop: "24px" },
            linked: false,
          },
          margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [
        {
          type: "Subsection",
          props: {
            id: contentSubsectionId,
            maxWidth: { desktop: "42rem" }, // matches original's `max-w-2xl`
            align: "left", // pinned left, not centered, within the full-width section
            bgType: "none",
            bgColor: "#ffffff",
            bgImage: "",
            minHeight: "auto",
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            borderRadius: { topLeft: { desktop: "0px" }, topRight: { desktop: "0px" }, bottomRight: { desktop: "0px" }, bottomLeft: { desktop: "0px" }, linked: true },
          },
        },
      ],
      [`${contentSubsectionId}:content`]: [
        {
          type: "Badge",
          props: {
            id: genId("badge"),
            text: "★ #1 IELTS Preparation Platform",
            style: "translucent",
            padding: {
              top: { desktop: "8px" },
              right: { desktop: "20px" },
              bottom: { desktop: "8px" },
              left: { desktop: "20px" },
              linked: false,
            },
            margin: {
              top: { desktop: "0px" },
              right: { desktop: "0px" },
              bottom: { desktop: "20px" },
              left: { desktop: "0px" },
              linked: false,
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
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "16px" }, left: { desktop: "0px" }, linked: false },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Receive expert tutoring for an excellent IELTS score through personalized mentorship.",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#dbeafe", // blue-100
            maxWidth: { desktop: "none" },
            padding: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "0px" }, left: { desktop: "0px" }, linked: false },
            margin: { top: { desktop: "0px" }, right: { desktop: "0px" }, bottom: { desktop: "32px" }, left: { desktop: "0px" }, linked: false },
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
            margin: {
              top: { desktop: "0px" },
              right: { desktop: "0px" },
              bottom: { desktop: "20px" },
              left: { desktop: "0px" },
              linked: false,
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
              { text: "Reading Strategies", href: "/search?q=Reading Strategies" },
              { text: "Mock Tests", href: "/search?q=Mock Tests" },
            ],
            style: "translucent",
            margin: {
              top: { desktop: "0px" },
              right: { desktop: "0px" },
              bottom: { desktop: "0px" },
              left: { desktop: "0px" },
              linked: false,
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
export function statsRealTemplate() {
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
          padding: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: true,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "20px" },
            left: { desktop: "0px" },
            linked: false,
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
          padding: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: true,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "8px" },
            left: { desktop: "0px" },
            linked: false,
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
          padding: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: true,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "4px" },
            left: { desktop: "0px" },
            linked: false,
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
          padding: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: true,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: false,
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
          padding: {
            top: { desktop: "64px" },
            right: { desktop: "20px" },
            bottom: { desktop: "64px" },
            left: { desktop: "20px" },
            linked: false,
          },
          margin: {
            top: { desktop: "0px" },
            right: { desktop: "0px" },
            bottom: { desktop: "0px" },
            left: { desktop: "0px" },
            linked: false,
          },
        },
      },
    ],
    zones,
  };
}

export const templates = [
  { key: "realHero", label: "Hero (Real)", description: "Your actual homepage hero — bg image, badge, search, tags", build: realHeroTemplate },
  { key: "realStats", label: "Stats (Real)", description: "Your actual stats section — gradient, blobs, 4 icon cards", build: statsRealTemplate },
  { key: "hero", label: "Hero (Generic)", description: "Full-width gradient hero with heading, text, button", build: heroTemplate },
  { key: "stats", label: "Stats Row (Generic)", description: "4-column stat numbers", build: statsTemplate },
  { key: "testimonials", label: "Testimonials", description: "Heading + 2 testimonial cards", build: testimonialTemplate },
  { key: "features", label: "Feature Grid", description: "4-column icon + title + text cards", build: featureGridTemplate },
];
