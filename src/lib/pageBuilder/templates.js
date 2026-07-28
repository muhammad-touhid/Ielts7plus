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
          contentWidth: "48rem",
          paddingTop: "96px",
          paddingBottom: "96px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
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
            size: "text-5xl md:text-6xl",
            align: "text-center",
            color: "#ffffff",
            weight: "font-extrabold",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "16px",
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Structured courses, expert mentors, and real mock tests to get the score you need.",
            size: "text-lg",
            align: "text-center",
            color: "#e5e7eb",
            maxWidth: "max-w-2xl",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "32px",
          },
        },
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            text: "Explore Courses",
            href: "/courses",
            variant: "filled",
            size: "text-lg",
            width: "inline-block",
            align: "center",
            paddingTop: "16px",
            paddingBottom: "16px",
            paddingLeft: "32px",
            paddingRight: "32px",
            marginTop: "0px",
            marginBottom: "0px",
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
          size: "text-3xl md:text-4xl",
          align: "text-center",
          color: "#2563eb",
          weight: "font-bold",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "4px",
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: stat.label,
          size: "text-sm",
          align: "text-center",
          color: "#6b7280",
          maxWidth: "max-w-none",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "0px",
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
          contentWidth: "72rem",
          paddingTop: "64px",
          paddingBottom: "64px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
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
          paddingTop: "32px",
          paddingBottom: "32px",
          paddingLeft: "32px",
          paddingRight: "32px",
          marginTop: "0px",
          marginBottom: "0px",
          rounded: "rounded-lg",
        },
      },
    ];
    zones[`${subsectionId}:content`] = [
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: `“${t.quote}”`,
          size: "text-base",
          align: "text-left",
          color: "#374151",
          maxWidth: "max-w-none",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "16px",
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: t.name,
          tag: "h4",
          size: "text-xl md:text-2xl",
          align: "text-left",
          color: "#111827",
          weight: "font-medium",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "0px",
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: t.role,
          size: "text-sm",
          align: "text-left",
          color: "#6b7280",
          maxWidth: "max-w-none",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "0px",
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
          contentWidth: "72rem",
          paddingTop: "32px",
          paddingBottom: "32px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
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
          contentWidth: "72rem",
          paddingTop: "32px",
          paddingBottom: "32px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
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
            size: "text-3xl md:text-4xl",
            align: "text-center",
            color: "#111827",
            weight: "font-bold",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "0px",
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
          paddingTop: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
          rounded: "rounded-lg",
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
          align: "text-left",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "8px",
        },
      },
      {
        type: "Heading",
        props: {
          id: genId("heading"),
          text: f.title,
          tag: "h4",
          size: "text-xl md:text-2xl",
          align: "text-left",
          color: "#111827",
          weight: "font-medium",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "8px",
        },
      },
      {
        type: "Text",
        props: {
          id: genId("text"),
          text: f.text,
          size: "text-sm",
          align: "text-left",
          color: "#6b7280",
          maxWidth: "max-w-none",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop: "0px",
          marginBottom: "0px",
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
          contentWidth: "72rem",
          paddingTop: "64px",
          paddingBottom: "64px",
          paddingLeft: "24px",
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
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
          contentWidth: "none", // full width, matches original's `w-full` — no outer bounding
          paddingTop: "48px",
          paddingBottom: "48px",
          paddingLeft: "24px", // matches original's container `px-6`
          paddingRight: "24px",
          marginTop: "0px",
          marginBottom: "0px",
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [
        {
          type: "Subsection",
          props: {
            id: contentSubsectionId,
            maxWidth: "42rem", // matches original's `max-w-2xl`
            align: "left", // pinned left, not centered, within the full-width section
            bgType: "none",
            bgColor: "#ffffff",
            bgImage: "",
            minHeight: "auto",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "0px",
            rounded: "rounded-none",
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
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "20px",
            paddingRight: "20px",
            marginTop: "0px",
            marginBottom: "20px",
          },
        },
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Get admitted into prestigious universities with a 7+ IELTS score",
            tag: "h1",
            size: "text-4xl md:text-5xl",
            align: "text-left",
            color: "#ffffff",
            weight: "font-extrabold",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "16px",
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Receive expert tutoring for an excellent IELTS score through personalized mentorship.",
            size: "text-lg",
            align: "text-left",
            color: "#dbeafe", // blue-100
            maxWidth: "max-w-none",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            marginTop: "0px",
            marginBottom: "32px",
          },
        },
        {
          type: "SearchBar",
          props: {
            id: genId("searchbar"),
            placeholder: "Search courses, topics, practice tests...",
            buttonText: "Search",
            searchPath: "/search",
            maxWidth: "max-w-lg",
            marginTop: "0px",
            marginBottom: "20px",
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
            marginTop: "0px",
            marginBottom: "0px",
          },
        },
      ],
    },
  };
}

export const templates = [
  { key: "realHero", label: "Hero (Real)", description: "Your actual homepage hero — bg image, badge, search, tags", build: realHeroTemplate },
  { key: "hero", label: "Hero (Generic)", description: "Full-width gradient hero with heading, text, button", build: heroTemplate },
  { key: "stats", label: "Stats Row", description: "4-column stat numbers", build: statsTemplate },
  { key: "testimonials", label: "Testimonials", description: "Heading + 2 testimonial cards", build: testimonialTemplate },
  { key: "features", label: "Feature Grid", description: "4-column icon + title + text cards", build: featureGridTemplate },
];
