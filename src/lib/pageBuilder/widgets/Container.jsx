// src/lib/pageBuilder/widgets/Container.jsx
"use client";

import { DropZone } from "@measured/puck";

// A blank section with a drop target inside it. Drag this onto the page
// first, then drag Heading / Text / Image / Button / IconBoxGrid INTO it.
// Puck automatically scopes the "content" zone to each Container instance,
// so you can have multiple Containers on one page without them colliding.
export const Container = {
  label: "Container / Section",
  fields: {
    background: {
      type: "select",
      options: [
        { label: "White", value: "bg-white" },
        { label: "Light gray", value: "bg-gray-50" },
        {
          label: "Brand gradient",
          value: "bg-gradient-to-br from-[#354e98] to-[#4a71df]",
        },
      ],
    },
    paddingY: {
      type: "select",
      options: [
        { label: "Small", value: "py-8" },
        { label: "Medium", value: "py-16" },
        { label: "Large", value: "py-24" },
      ],
    },
    maxWidth: {
      type: "select",
      options: [
        { label: "Narrow (article)", value: "max-w-3xl" },
        { label: "Medium", value: "max-w-5xl" },
        { label: "Wide", value: "max-w-6xl" },
        { label: "Full", value: "max-w-full" },
      ],
    },
  },
  defaultProps: {
    background: "bg-white",
    paddingY: "py-16",
    maxWidth: "max-w-5xl",
  },
  render: ({ background, paddingY, maxWidth }) => (
    <section className={`${background} ${paddingY} px-6`}>
      <div className={`${maxWidth} mx-auto`}>
        <DropZone zone="content" />
      </div>
    </section>
  ),
};
