// src/lib/pageBuilder/theme/ThemeColorsContext.js
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#f59e0b",
  text: "#111827",
  background: "#ffffff",
};
const DEFAULT_FONTS = {
  heading: "Poppins",
  paragraph: "Inter",
  button: "Inter",
  badge: "Inter",
};

export const THEME_TOKENS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
];

export const FONT_TOKENS = [
  { key: "heading", label: "Heading" },
  { key: "paragraph", label: "Paragraph" },
  { key: "button", label: "Button" },
  { key: "badge", label: "Badge" },
];

export const FONT_OPTIONS = [
  "Inter",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Work Sans",
];

const ThemeColorsCtx = createContext({
  themeColors: DEFAULT_COLORS,
  tokens: THEME_TOKENS,
  themeFonts: DEFAULT_FONTS,
  fontTokens: FONT_TOKENS,
  fontOptions: FONT_OPTIONS,
  loading: true,
  refetch: () => {},
});

export function ThemeColorsProvider({ children }) {
  const [themeColors, setThemeColors] = useState(DEFAULT_COLORS);
  const [themeFonts, setThemeFonts] = useState(DEFAULT_FONTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    return fetch(`/api/public/site-theme?t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        setThemeColors({ ...DEFAULT_COLORS, ...data.colors });
        setThemeFonts({ ...DEFAULT_FONTS, ...data.fonts });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    function onFocus() {
      load();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  return (
    <ThemeColorsCtx.Provider
      value={{
        themeColors,
        tokens: THEME_TOKENS,
        themeFonts,
        fontTokens: FONT_TOKENS,
        fontOptions: FONT_OPTIONS,
        loading,
        refetch: load,
      }}
    >
      {children}
    </ThemeColorsCtx.Provider>
  );
}

export function useThemeColors() {
  return useContext(ThemeColorsCtx);
}
