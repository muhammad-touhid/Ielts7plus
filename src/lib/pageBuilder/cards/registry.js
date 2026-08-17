// src/lib/pageBuilder/cards/registry.js
import { BatchCard } from "./BatchCard";
import { CourseCard } from "./CourseCard";
import { TestimonialCard } from "./TestimonialCard";
import { EventCard } from "./EventCard";

// Single source of truth for every data source Grid can offer, and the
// data-source part of what Carousel can offer. Carousel additionally
// offers "Custom" (blank drop-zone slides) — that's not part of this
// registry since it isn't a fetched data source, it's real Puck content.
export const CARD_REGISTRY = {
  batch: {
    label: "Batch",
    Card: BatchCard,
    fetchUrl: (limit) => `/api/public/batches?limit=${limit}`,
    extractItems: (json) => json.batches || [],
    getKey: (item) => item.id,
  },
  course: {
    label: "Course",
    Card: CourseCard,
    fetchUrl: (limit) => `/api/public/courses?limit=${limit}`,
    extractItems: (json) => json.courses || [],
    getKey: (item) => item.slug,
  },
  testimonial: {
    label: "Testimonial",
    Card: TestimonialCard,
    fetchUrl: (limit) => `/api/public/testimonials?limit=${limit}`,
    extractItems: (json) => json.testimonials || [],
    getKey: (item) => item.id,
  },
  event: {
    label: "Event",
    Card: EventCard,
    fetchUrl: (limit) => `/api/public/events?limit=${limit}`,
    extractItems: (json) => json.events || [],
    getKey: (item) => item.id,
  },
};

// Used by Grid — no Custom option, since a fully custom layout is
// already what Section/Subsection is for.
export const GRID_DATA_SOURCE_OPTIONS = Object.entries(CARD_REGISTRY).map(
  ([value, { label }]) => ({
    label,
    value,
  }),
);

// Used by Carousel — adds Custom (blank drop-zone slides).
export const CAROUSEL_DATA_SOURCE_OPTIONS = [
  ...GRID_DATA_SOURCE_OPTIONS,
  { label: "Custom (design your own slide)", value: "custom" },
];
