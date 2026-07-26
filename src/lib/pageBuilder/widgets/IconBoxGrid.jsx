// src/lib/pageBuilder/widgets/IconBoxGrid.jsx
"use client";

import { DropZone } from "@measured/puck";

// Uses Tabler Icons (already loaded via CDN in your root layout.js),
// so any "ti-*" class works here without extra setup.
export const IconBoxGrid = {
  label: "Icon Box Grid",
  fields: {
    heading: { type: "text" },
    columns: {
      type: "select",
      options: [
        { label: "2 columns", value: "md:grid-cols-2" },
        { label: "3 columns", value: "md:grid-cols-3" },
        { label: "4 columns", value: "md:grid-cols-4" },
      ],
    },
    items: {
      type: "array",
      arrayFields: {
        icon: { type: "text" }, // e.g. "ti-headphones", "ti-book"
        title: { type: "text" },
        text: { type: "textarea" },
      },
      defaultItemProps: { icon: "ti-star", title: "Feature Title", text: "Short description of this feature." },
      getItemSummary: (item) => item.title || "Item",
    },
  },
  defaultProps: {
    heading: "Why Choose IELTS7+",
    columns: "md:grid-cols-4",
    items: [
      { icon: "ti-headphones", title: "Listening", text: "4-section practice with real exam audio." },
      { icon: "ti-book", title: "Reading", text: "3 passages covering every question type." },
      { icon: "ti-pencil", title: "Writing", text: "Task 1 & 2 with structured feedback." },
      { icon: "ti-microphone", title: "Speaking", text: "Real recorded mock interviews." },
    ],
  },
  render: ({ heading, columns, items }) => (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {heading && <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{heading}</h2>}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-6`}>
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <i className={`ti ${item.icon} text-3xl text-blue-600 mb-3 block`} />
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
        {/* Redesign this section: drop extra Elements or a Subsection here */}
        <div className="mt-8">
          <DropZone zone="extra" />
        </div>
      </div>
    </section>
  ),
};
