// src/lib/pageBuilder/theme/useGoogleFont.js
"use client";

import { useEffect } from "react";

const loadedFonts = new Set();

// Injects a Google Fonts <link> for any font name the moment it's
// actually used — editor canvas, Site Theme preview, or the public
// page. Dedups by font name so switching back and forth doesn't stack
// duplicate <link> tags. Silently does nothing for falsy/empty names.
export function useGoogleFont(fontName) {
  useEffect(() => {
    if (!fontName || loadedFonts.has(fontName)) return;
    loadedFonts.add(fontName);

    const id = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontName,
    )}:wght@400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [fontName]);
}
