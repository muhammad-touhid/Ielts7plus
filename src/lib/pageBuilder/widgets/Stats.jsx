// src/lib/pageBuilder/widgets/Stats.jsx
"use client";

import { DropZone } from "@measured/puck";

export const Stats = {
  label: "Stats Section",
  fields: {
    items: {
      type: "array",
      arrayFields: {
        number: { type: "text" },
        label: { type: "text" },
      },
      defaultItemProps: { number: "1000+", label: "Students Enrolled" },
      getItemSummary: (item) => `${item.number} — ${item.label}`,
    },
  },
  defaultProps: {
    items: [
      { number: "1000+", label: "Students Enrolled" },
      { number: "8.5", label: "Highest Band Score" },
      { number: "50+", label: "Expert Mentors" },
      { number: "95%", label: "Success Rate" },
    ],
  },
  render: ({ items }) => (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">{item.number}</div>
              <div className="text-sm text-gray-500 mt-1">{item.label}</div>
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
