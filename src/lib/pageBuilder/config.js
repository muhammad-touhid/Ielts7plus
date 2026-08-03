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

import { Section } from "./widgets/Section";
import { Subsection } from "./widgets/Subsection";
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
import { CourseGrid } from "./widgets/CourseGrid";

export const config = {
  categories: {
    structure: {
      title: "Structure",
      components: ["Section", "Subsection"],
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
      ],
    },
    dynamic: {
      title: "Dynamic (Live Data)",
      components: ["CourseGrid"],
    },
  },
  components: {
    Section,
    Subsection,
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
    CourseGrid,
  },
};
