// src/lib/pageBuilder/config.js
//
// This is THE registry of drag-and-drop components. To add a new element
// or structural widget in the future:
//   1. Create src/lib/pageBuilder/widgets/YourWidget.jsx (same shape as the others)
//   2. Import it below and add it to `components` (and a category)
//
// Note: Hero / Stats / Testimonial / Feature Grid are NOT registered here
// as draggable components anymore — they're now "Templates" (see
// templates.js + the Templates panel in the editor), which insert real,
// separate Section/Heading/Text/Button/Icon layers instead of one
// fixed-field mega-component. The old widget files are still in this
// folder if you ever want a monolithic version back.
//
// Structure: Subsection was retired — a Section can be nested inside
// another Section's column, and Section's own "Content Alignment" field
// (left/center/right) covers the pinned-narrow-block use case Subsection
// used to handle.
//
// Carousel / Grid are generic data-driven widgets — each picks a data
// source (Batch, Course, Testimonial, or Custom) via a field on the
// widget itself, rendering through the shared card registry in
// src/lib/pageBuilder/cards/registry.js. CourseGrid is kept alongside
// them for now since existing pages already use it; safe to retire once
// Grid (dataSource: "course") is confirmed to cover the same ground.

import { Section } from "./widgets/Section";
import { Heading } from "./widgets/Heading";
import { Text } from "./widgets/Text";
import { ImageBlock } from "./widgets/Image";
import { ButtonBlock } from "./widgets/ButtonBlock";
import { IconBlock } from "./widgets/Icon";
import { HtmlBlock } from "./widgets/HtmlBlock";
import { Spacer } from "./widgets/Spacer";
import { Badge } from "./widgets/Badge";
import { SearchBar } from "./widgets/SearchBar";
import { TagList } from "./widgets/TagList";
import { Carousel } from "./widgets/Carousel";
import { Grid } from "./widgets/Grid";
import { Menu } from "./widgets/Menu";
import { CourseDetail } from "./widgets/CourseDetail";
import { FaqAccordion } from "./widgets/FaqAccordion";

export const config = {
  categories: {
    structure: {
      title: "Structure",
      components: ["Section"],
    },
    elements: {
      title: "Elements",
      components: [
        "Heading",
        "Text",
        "ImageBlock",
        "ButtonBlock",
        "IconBlock",
        "Spacer",
        "HtmlBlock",
        "Badge",
        "SearchBar",
        "TagList",
        "Menu",
        "FaqAccordion",
      ],
    },
    dynamic: {
      title: "Dynamic (Live Data)",
      components: ["Carousel", "Grid", "CourseDetail"],
    },
  },
  components: {
    Section,
    Heading,
    Text,
    ImageBlock,
    ButtonBlock,
    IconBlock,
    Spacer,
    HtmlBlock,
    Badge,
    SearchBar,
    TagList,
    Menu,
    Carousel,
    Grid,
    CourseDetail,
    FaqAccordion,
  },
};
