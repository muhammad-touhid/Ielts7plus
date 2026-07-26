// src/app/(public)/p/[slug]/PageRenderer.js
"use client";

import { Render } from "@measured/puck";
import { config } from "@/lib/pageBuilder/config";

// Only `data` (plain JSON) is passed in as a prop — `config` (which
// contains render functions) is imported directly here instead of being
// passed down from the server component, since functions can't cross
// the server -> client boundary as props.
export default function PageRenderer({ data }) {
  return <Render config={config} data={data} />;
}
