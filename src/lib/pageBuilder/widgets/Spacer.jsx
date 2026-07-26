// src/lib/pageBuilder/widgets/Spacer.jsx
"use client";

import { flexibleSizeField, SPACING_PRESETS } from "../fields/flexibleSize";

// Empty vertical space — same idea as Elementor's Spacer widget. Drop it
// between two elements when you need extra breathing room without
// wrapping either one in a Section/Subsection just for spacing.
export const Spacer = {
  label: "Spacer",
  fields: {
    height: flexibleSizeField("Height", SPACING_PRESETS),
  },
  defaultProps: {
    height: "32px",
  },
  render: ({ height }) => <div style={{ height }} aria-hidden="true" />,
};
