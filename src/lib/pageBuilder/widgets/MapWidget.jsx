"use client";

import { useThemeColors } from "../theme/ThemeColorsContext";
import { flexibleSizeField, HEIGHT_PRESETS } from "../fields/flexibleSize";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import { ResponsiveStyle } from "../fields/responsiveStyle";
import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";

const STATIC_FIELDS = {
  // Plain address/place-name search, same as Elementor's basic Google
  // Maps widget — this uses Google's no-API-key embed URL
  // (maps.google.com/maps?q=...&output=embed), not the Maps Embed API,
  // so there's no billing/API key setup needed. Trade-off: no custom
  // markers or map styling beyond what Google's default embed offers.
  locationQuery: { type: "text", label: "Location (address or place name)" },
  zoom: { type: "number", label: "Zoom Level (1–21)" },
  mapHeight: flexibleSizeField("Map Height", HEIGHT_PRESETS),
  ...borderFieldSet(),
  shadow: shadowField(),
};

export const MapWidget = {
  label: "Google Map",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "map-default",
    locationQuery: "Dhaka, Bangladesh",
    zoom: 14,
    mapHeight: "400px",
    ...borderDefaultProps(),
    ...shadowDefaultProps(),
  },
  render: function MapRender({
    id,
    locationQuery,
    zoom,
    mapHeight,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    shadow,
  }) {
    const { themeColors } = useThemeColors();
    const scopedClass = `pb-map-${id}`;
    const query =
      locationQuery && locationQuery.trim()
        ? locationQuery.trim()
        : "Dhaka, Bangladesh";
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom || 14}&output=embed`;

    return (
      <div
        className={scopedClass}
        style={{
          overflow: "hidden",
          boxShadow: resolveShadow(shadow) || undefined,
        }}
      >
        <ResponsiveStyle
          className={scopedClass}
          entries={borderToEntries(
            { borderWidth, borderStyle, borderColor, borderRadius },
            themeColors,
          )}
        />
        {/* key={src} forces the iframe to remount when location/zoom
            change in the editor, instead of silently keeping a stale
            embed from before the edit. */}
        <iframe
          key={src}
          src={src}
          width="100%"
          height={mapHeight}
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={query}
        />
      </div>
    );
  },
};
