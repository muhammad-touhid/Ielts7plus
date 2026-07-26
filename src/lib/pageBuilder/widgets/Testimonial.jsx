// src/lib/pageBuilder/widgets/Testimonial.jsx
"use client";

import { DropZone } from "@measured/puck";
import ImageUpload from "@/app/admin/ImageUpload";

// A prebuilt "quick design" section, same idea as Hero/Stats — drop it in
// and just fill the fields, no assembly from raw elements required.
export const Testimonial = {
  label: "Testimonial Section",
  fields: {
    heading: { type: "text" },
    items: {
      type: "array",
      arrayFields: {
        quote: { type: "textarea" },
        name: { type: "text" },
        role: { type: "text" },
        avatar: {
          type: "custom",
          render: ({ value, onChange }) => <ImageUpload value={value} onChange={(url) => onChange(url)} />,
        },
        rating: {
          type: "select",
          options: [
            { label: "5 stars", value: "5" },
            { label: "4 stars", value: "4" },
            { label: "3 stars", value: "3" },
          ],
        },
      },
      defaultItemProps: {
        quote: "This platform completely changed how I prepared for IELTS.",
        name: "Student Name",
        role: "Band 8.0",
        avatar: "",
        rating: "5",
      },
      getItemSummary: (item) => item.name || "Testimonial",
    },
  },
  defaultProps: {
    heading: "What Our Students Say",
    items: [
      { quote: "This platform completely changed how I prepared for IELTS.", name: "Ayesha Rahman", role: "Band 8.0", avatar: "", rating: "5" },
      { quote: "The mock tests felt exactly like the real exam.", name: "Tanvir Ahmed", role: "Band 7.5", avatar: "", rating: "5" },
    ],
  },
  render: ({ heading, items }) => (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {heading && <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <div className="text-amber-400 mb-3">{"★".repeat(Number(item.rating))}</div>
              <p className="text-gray-700 italic mb-4">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {item.name?.[0] || "?"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
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
