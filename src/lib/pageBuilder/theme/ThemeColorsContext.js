// src/lib/pageBuilder/theme/ThemeColorsContext.js
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const DEFAULTS = {
  primary: "#2563eb",
  secondary: "#f59e0b",
  text: "#111827",
  background: "#ffffff",
};

export const THEME_TOKENS = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "text", label: "Text" },
  { key: "background", label: "Background" },
];

const ThemeColorsCtx = createContext({
  themeColors: DEFAULTS,
  tokens: THEME_TOKENS,
  loading: true,
  refetch: () => {},
});

export function ThemeColorsProvider({ children }) {
  const [themeColors, setThemeColors] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    // Cache-busting query param — defeats any URL-keyed cache (browser,
    // dev server, or CDN) that might otherwise serve a stale response
    // even with cache: "no-store".
    return fetch(`/api/public/site-theme?t=${Date.now()}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => setThemeColors({ ...DEFAULTS, ...data.colors }))
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
      value={{ themeColors, tokens: THEME_TOKENS, loading, refetch: load }}
    >
      {children}
    </ThemeColorsCtx.Provider>
  );
}

export function useThemeColors() {
  return useContext(ThemeColorsCtx);
}
