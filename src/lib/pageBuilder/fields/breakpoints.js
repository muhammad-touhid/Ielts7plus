// src/lib/pageBuilder/fields/breakpoints.js
"use client";
//
// Four devices, aligned to Tailwind's default md/lg/xl breakpoints so
// they stay consistent with any plain Tailwind classes used elsewhere
// (e.g. Section's column layouts).
//
//   Mobile:   < 768px
//   Tablet:   768px – 1023px
//   Laptop:   1024px – 1279px
//   Desktop:  >= 1280px  (this is the BASE — always has a real value,
//                          the other three only override it)

export const DEVICES = ["desktop", "laptop", "tablet", "mobile"]; // largest to smallest
export const DEVICE_LABELS = { desktop: "Desktop", laptop: "Laptop", tablet: "Tablet", mobile: "Mobile" };

// Upper bound (max-width, in px) for each override tier's media query.
// Desktop has none — it's the unconditional base style.
export const MEDIA_MAX = { laptop: 1279, tablet: 1023, mobile: 767 };

export function getActiveDevice(width) {
  if (width >= 1280) return "desktop";
  if (width >= 1024) return "laptop";
  if (width >= 768) return "tablet";
  return "mobile";
}

// Matches the breakpoints above. Passed to <Puck viewports={...}> so the
// header's device icons switch between exactly these four widths.
// Puck ships 3 built-in named icons ("Monitor", "Tablet", "Smartphone")
// but no "Laptop" — for that one we pass a real ReactNode instead (a
// Tabler icon, since Tabler is already loaded via CDN in the project's
// root layout.js).
export const PUCK_VIEWPORTS = [
  { width: 390, height: "auto", label: "Mobile", icon: "Smartphone" },
  { width: 820, height: "auto", label: "Tablet", icon: "Tablet" },
  { width: 1180, height: "auto", label: "Laptop", icon: <i className="ti ti-device-laptop" /> },
  { width: 1440, height: "auto", label: "Desktop", icon: "Monitor" },
];
