// src/lib/pageBuilder/widgets/Carousel.jsx
"use client";

import { DropZone } from "@measured/puck";
import { CAROUSEL_DATA_SOURCE_OPTIONS, CARD_REGISTRY } from "../cards/registry";
import CarouselShell from "../carousel/CarouselShell";
import { useDataSourceItems } from "../carousel/useDataSourceItems";
import {
  cardStyleFieldSet,
  cardStyleDefaultProps,
  buildCardStyleVars,
} from "../fields/cardStyleField";
import {
  carouselHeaderFieldSet,
  carouselHeaderDefaultProps,
  buildCarouselHeaderVars,
} from "../fields/carouselHeaderField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import { activeSlideField } from "../fields/activeSlideField";
import { useThemeColors } from "../theme/ThemeColorsContext";

const SLIDE_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: String(n),
  value: String(n),
}));

export const Carousel = {
  label: "Carousel",
  fields: {
    dataSource: {
      type: "select",
      label: "Show",
      options: CAROUSEL_DATA_SOURCE_OPTIONS,
    },
    limit: {
      type: "select",
      label: "Number of Items (ignored for Custom)",
      options: [
        { label: "5", value: "5" },
        { label: "8", value: "8" },
        { label: "10", value: "10" },
        { label: "15", value: "15" },
      ],
    },
    slideCount: {
      type: "select",
      label: "Number of Slides (Custom only)",
      options: SLIDE_COUNT_OPTIONS,
    },
    activeSlide: activeSlideField(),
    visible: {
      type: "select",
      label: "Cards Visible at Once (desktop)",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
    },
    autoSlide: {
      type: "radio",
      label: "Auto-Slide",
      options: [
        { label: "Off", value: false },
        { label: "On", value: true },
      ],
    },
    autoSlideSpeed: { type: "number", label: "Auto-Slide Speed (seconds)" },
    pauseOnHover: {
      type: "radio",
      label: "Pause on Hover",
      options: [
        { label: "Off", value: false },
        { label: "On", value: true },
      ],
    },
    eyebrow: { type: "text", label: "Eyebrow (optional)" },
    heading: { type: "text", label: "Heading (optional)" },
    subheading: { type: "textarea", label: "Subheading (optional)" },
    seeAllHref: { type: "text", label: '"See All" Link (optional)' },
    seeAllText: { type: "text", label: '"See All" Text' },
    ...carouselHeaderFieldSet(),
    ...cardStyleFieldSet(),
    ...hoverFieldSet(),
  },
  defaultProps: {
    id: "carousel-default",
    dataSource: "batch",
    limit: "8",
    slideCount: "3",
    activeSlide: 0,
    visible: "3",
    autoSlide: false,
    autoSlideSpeed: 4,
    pauseOnHover: true,
    eyebrow: "",
    heading: "",
    subheading: "",
    seeAllHref: "",
    seeAllText: "See All",
    ...carouselHeaderDefaultProps(),
    ...cardStyleDefaultProps(),
    ...hoverDefaultProps(),
  },
  render: function CarouselRender({
    id,
    dataSource,
    limit,
    slideCount,
    activeSlide,
    visible,
    autoSlide,
    autoSlideSpeed,
    pauseOnHover,
    eyebrow,
    heading,
    subheading,
    seeAllHref,
    seeAllText,
    eyebrowBg,
    eyebrowColor,
    eyebrowSize,
    headingColor,
    headingSize,
    subheadingColor,
    subheadingSize,
    seeAllColor,
    seeAllSize,
    controllerColor,
    cardBg,
    cardAccent,
    titleColor,
    titleSize,
    textColor,
    textSize,
    buttonSize,
    cardPadding,
    hoverEnabled,
    hoverBgColor,
    hoverTextColor,
    hoverBorderColor,
    hoverOpacity,
    hoverScale,
    hoverTranslateX,
    hoverTranslateY,
    hoverRotate,
    hoverShadow,
    hoverGrayscaleToColor,
    hoverTransitionMs,
  }) {
    const { themeColors } = useThemeColors();

    const cardVars = buildCardStyleVars(
      {
        cardBg,
        cardAccent,
        titleColor,
        titleSize,
        textColor,
        textSize,
        buttonSize,
        cardPadding,
      },
      themeColors,
    );
    const headerVars = buildCarouselHeaderVars(
      {
        eyebrowBg,
        eyebrowColor,
        eyebrowSize,
        headingColor,
        headingSize,
        subheadingColor,
        subheadingSize,
        seeAllColor,
        seeAllSize,
        controllerColor,
      },
      themeColors,
    );

    const shellProps = {
      visible: parseInt(visible, 10),
      eyebrow,
      heading,
      subheading,
      seeAllHref,
      seeAllText,
      autoSlide,
      autoSlideSpeed,
      pauseOnHover,
      activeSlide,
    };

    if (dataSource === "custom") {
      const count = parseInt(slideCount, 10) || 3;
      const slideIndexes = Array.from({ length: count }, (_, i) => i);
      const scopedClass = `pb-customslide-${id}`;

      const hoverCss = buildHoverCss(
        scopedClass,
        {
          hoverEnabled,
          hoverBgColor,
          hoverTextColor,
          hoverBorderColor,
          hoverOpacity,
          hoverScale,
          hoverTranslateX,
          hoverTranslateY,
          hoverRotate,
          hoverShadow,
          hoverGrayscaleToColor,
          hoverTransitionMs,
        },
        themeColors,
      );

      return (
        <div style={{ ...cardVars, ...headerVars }}>
          {hoverCss && <style>{hoverCss}</style>}
          <CarouselShell
            items={slideIndexes}
            renderCard={(slideIndex) => (
              <div
                className={`rounded-2xl overflow-hidden h-full ${scopedClass}`}
                style={{
                  background: "var(--card-bg, #ffffff)",
                  padding: "var(--card-padding, 20px)",
                  minHeight: "220px",
                }}
              >
                <DropZone zone={`slide-${slideIndex}`} />
              </div>
            )}
            getKey={(slideIndex) => `slide-${slideIndex}`}
            scrollMode
            {...shellProps}
          />
        </div>
      );
    }

    const { items, error } = useDataSourceItems(
      dataSource,
      parseInt(limit, 10),
      null,
    );
    const entry = CARD_REGISTRY[dataSource];
    const Card = entry?.Card;

    if (error) {
      return (
        <div className="text-center py-10 text-sm text-slate-400">
          Couldn&apos;t load right now.
        </div>
      );
    }
    if (items === null) {
      return (
        <div className="text-center py-10 text-sm text-slate-400">
          Loading...
        </div>
      );
    }
    if (!Card) {
      return (
        <div className="text-center py-10 text-sm text-red-400">
          Unknown data source.
        </div>
      );
    }

    return (
      <div style={{ ...cardVars, ...headerVars }}>
        <CarouselShell
          items={items}
          renderCard={(item) => <Card item={item} />}
          getKey={entry.getKey}
          {...shellProps}
        />
      </div>
    );
  },
};
