// src/lib/pageBuilder/carousel/useDataSourceItems.js
"use client";

import { useEffect, useState } from "react";
import { CARD_REGISTRY } from "../cards/registry";

// Shared fetch logic for both Carousel and Grid: if dataSource is
// "custom", the items come straight from Puck's own array field data
// (already in hand, no fetch). Otherwise it fetches from the matching
// registry entry's public API route.
export function useDataSourceItems(dataSource, limit, customItems) {
  const [items, setItems] = useState(
    dataSource === "custom" ? customItems || [] : null,
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (dataSource === "custom") {
      setItems(customItems || []);
      return;
    }
    const entry = CARD_REGISTRY[dataSource];
    if (!entry) {
      setItems([]);
      return;
    }
    let cancelled = false;
    setItems(null);
    setError(false);
    fetch(entry.fetchUrl(limit))
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setItems(entry.extractItems(json));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [dataSource, limit, customItems]);

  return { items, error };
}
