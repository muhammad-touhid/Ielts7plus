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
          overlayColor: "#000000",
          overlayOpacity: "0",
          minHeight: "75vh",
          contentWidth: "max-w-3xl",
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
          overlayColor: "#000000",
          overlayOpacity: "0",
          minHeight: "auto",
          contentWidth: "max-w-6xl",
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
          overlayColor: "#000000",
          overlayOpacity: "0",
          minHeight: "auto",
          contentWidth: "max-w-6xl",
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
          overlayColor: "#000000",
          overlayOpacity: "0",
          minHeight: "auto",
          contentWidth: "max-w-6xl",
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
          overlayColor: "#000000",
          overlayOpacity: "0",
          minHeight: "auto",
          contentWidth: "max-w-6xl",
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

export const templates = [
  { key: "hero", label: "Hero", description: "Full-width gradient hero with heading, text, button", build: heroTemplate },
  { key: "stats", label: "Stats Row", description: "4-column stat numbers", build: statsTemplate },
  { key: "testimonials", label: "Testimonials", description: "Heading + 2 testimonial cards", build: testimonialTemplate },
  { key: "features", label: "Feature Grid", description: "4-column icon + title + text cards", build: featureGridTemplate },
];
