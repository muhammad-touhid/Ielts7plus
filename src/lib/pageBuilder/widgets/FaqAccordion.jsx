// src/lib/pageBuilder/widgets/FaqAccordion.jsx
"use client";

import { useState } from "react";
import { colorField, resolveColor } from "../fields/colorField";
import { useThemeColors } from "../theme/ThemeColorsContext";

function FAQItem({ faq, cardColors, scopedClass }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${!open ? `${scopedClass}-card` : ""}`}
      style={{
        background: cardColors.cardBg,
        borderColor: open ? cardColors.cardBorderActive : cardColors.cardBorder,
        boxShadow: open ? "0 4px 14px rgba(37,99,235,0.08)" : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
      >
        <span
          className="text-sm font-bold leading-snug transition-colors duration-200"
          style={{
            color: open
              ? cardColors.questionActiveColor
              : cardColors.questionColor,
          }}
        >
          {faq.question}
        </span>
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300"
          style={{
            background: open
              ? cardColors.chevronActiveBg
              : cardColors.chevronBg,
            color: open
              ? cardColors.chevronActiveColor
              : cardColors.chevronColor,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <i className="ti ti-chevron-down text-sm" />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-7 pb-6">
          <div
            className="w-full h-px mb-4"
            style={{ background: cardColors.cardBorder }}
          />
          <p
            className="text-sm leading-relaxed"
            style={{ color: cardColors.answerColor }}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export const FaqAccordion = {
  label: "FAQ Accordion",
  fields: {
    showSearch: {
      type: "radio",
      label: "Show Search Box",
      options: [
        { label: "On", value: true },
        { label: "Off", value: false },
      ],
    },
    showCategoryFilter: {
      type: "radio",
      label: "Show Category Filter Tags",
      options: [
        { label: "On", value: true },
        { label: "Off", value: false },
      ],
    },
    // Managed independently from `items` — admin adds/edits/removes the
    // filter tags directly here rather than them being auto-derived
    // from whatever category strings happen to be typed into items
    // below. "All" is always shown first automatically and isn't part
    // of this list. Match an item's `category` text to one of these
    // labels for it to show up under that tag.
    categories: {
      type: "array",
      label: "Filter Tags",
      getItemSummary: (item) => item.label || "New tag",
      defaultItemProps: { label: "New Tag" },
      arrayFields: {
        label: { type: "text", label: "Tag Label" },
      },
    },
    items: {
      type: "array",
      label: "FAQ Items",
      getItemSummary: (item) => item.question || "New question",
      defaultItemProps: {
        category: "General",
        question: "",
        answer: "",
      },
      arrayFields: {
        category: { type: "text", label: "Category (must match a tag above)" },
        question: { type: "text", label: "Question" },
        answer: { type: "textarea", label: "Answer" },
      },
    },

    // ── Tag colors ──
    tagBg: colorField("Tag Background (inactive)", [
      { label: "White", value: "#ffffff" },
      { label: "Transparent", value: "transparent" },
    ]),
    tagTextColor: colorField("Tag Text (inactive)", [
      { label: "Slate", value: "#64748b" },
      { label: "Dark", value: "#1e293b" },
    ]),
    tagBorderColor: colorField("Tag Border (inactive)", [
      { label: "Light gray", value: "#e5e7eb" },
      { label: "Slate", value: "#cbd5e1" },
    ]),
    tagActiveBg: colorField("Tag Background (active)", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
    ]),
    tagActiveTextColor: colorField("Tag Text (active)", [
      { label: "White", value: "#ffffff" },
    ]),

    // ── Search bar colors ──
    searchBg: colorField("Search Background", [
      { label: "Light gray", value: "#f8fafc" },
      { label: "White", value: "#ffffff" },
    ]),
    searchTextColor: colorField("Search Text", [
      { label: "Dark", value: "#1e293b" },
      { label: "Slate", value: "#64748b" },
    ]),
    searchBorderColor: colorField("Search Border", [
      { label: "Light gray", value: "#e2e8f0" },
      { label: "Slate", value: "#cbd5e1" },
    ]),
    searchIconColor: colorField("Search Icon", [
      { label: "Slate", value: "#94a3b8" },
      { label: "Brand blue", value: "#2563eb" },
    ]),

    // ── FAQ card colors ──
    cardBg: colorField("Card Background", [
      { label: "White", value: "#ffffff" },
      { label: "Light gray", value: "#f8fafc" },
    ]),
    cardBorder: colorField("Card Border", [
      { label: "Light gray", value: "#f1f5f9" },
      { label: "Slate", value: "#e2e8f0" },
    ]),
    cardBorderActive: colorField("Card Border (open)", [
      { label: "Blue", value: "#bfdbfe" },
      { label: "Brand blue", value: "#2563eb" },
    ]),
    questionColor: colorField("Question Text", [
      { label: "Dark", value: "#1e293b" },
      { label: "Slate", value: "#334155" },
    ]),
    questionActiveColor: colorField("Question Text (open)", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#1e293b" },
    ]),
    answerColor: colorField("Answer Text", [
      { label: "Slate", value: "#64748b" },
      { label: "Light slate", value: "#94a3b8" },
    ]),
    chevronBg: colorField("Chevron Background (inactive)", [
      { label: "Light gray", value: "#f1f5f9" },
      { label: "White", value: "#ffffff" },
    ]),
    chevronColor: colorField("Chevron Icon (inactive)", [
      { label: "Slate", value: "#94a3b8" },
    ]),
    chevronActiveBg: colorField("Chevron Background (open)", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
    ]),
    chevronActiveColor: colorField("Chevron Icon (open)", [
      { label: "White", value: "#ffffff" },
    ]),
  },
  defaultProps: {
    id: "faq-default",
    showSearch: true,
    showCategoryFilter: true,
    categories: [
      { label: "General" },
      { label: "Courses" },
      { label: "Enrollment" },
    ],
    items: [
      {
        category: "General",
        question: "What is IELTS7+ and who is it for?",
        answer:
          "IELTS7+ is a premium IELTS preparation institute based in Dhaka, Bangladesh. We offer structured, expert-led courses for students, professionals, and anyone planning to study or migrate abroad who needs to achieve a Band 7 or above in the IELTS exam.",
      },
      {
        category: "Courses",
        question: "How many courses do you offer?",
        answer:
          "We currently offer four courses: IELTS Preparation, Spoken English, Advanced Writing, and Grammar & Writing. Each course is designed for a specific learning goal and skill level.",
      },
      {
        category: "Enrollment",
        question: "How do I enroll in a course?",
        answer:
          "You can enroll by clicking the Enroll Now button on any course or batch page, or by contacting us directly via phone or WhatsApp. Our team will guide you through the registration and payment process.",
      },
    ],
    tagBg: "#ffffff",
    tagTextColor: "#64748b",
    tagBorderColor: "#e5e7eb",
    tagActiveBg: "#2563eb",
    tagActiveTextColor: "#ffffff",
    searchBg: "#f8fafc",
    searchTextColor: "#1e293b",
    searchBorderColor: "#e2e8f0",
    searchIconColor: "#94a3b8",
    cardBg: "#ffffff",
    cardBorder: "#f1f5f9",
    cardBorderActive: "#bfdbfe",
    questionColor: "#1e293b",
    questionActiveColor: "#2563eb",
    answerColor: "#64748b",
    chevronBg: "#f1f5f9",
    chevronColor: "#94a3b8",
    chevronActiveBg: "#2563eb",
    chevronActiveColor: "#ffffff",
  },
  render: function FaqAccordionRender({
    id,
    showSearch,
    showCategoryFilter,
    categories,
    items,
    tagBg,
    tagTextColor,
    tagBorderColor,
    tagActiveBg,
    tagActiveTextColor,
    searchBg,
    searchTextColor,
    searchBorderColor,
    searchIconColor,
    cardBg,
    cardBorder,
    cardBorderActive,
    questionColor,
    questionActiveColor,
    answerColor,
    chevronBg,
    chevronColor,
    chevronActiveBg,
    chevronActiveColor,
  }) {
    const { themeColors } = useThemeColors();
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    const faqs = items || [];
    const tagLabels = (categories || []).map((c) => c.label).filter(Boolean);
    const tags = ["All", ...tagLabels];

    const filtered = faqs.filter((f) => {
      const matchCategory =
        activeCategory === "All" || f.category === activeCategory;
      const matchSearch =
        (f.question || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.answer || "").toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    const showBar = showSearch || (showCategoryFilter && tagLabels.length > 0);

    const resolvedTagBg = resolveColor(tagBg, themeColors);
    const resolvedTagTextColor = resolveColor(tagTextColor, themeColors);
    const resolvedTagBorderColor = resolveColor(tagBorderColor, themeColors);
    const resolvedTagActiveBg = resolveColor(tagActiveBg, themeColors);
    const resolvedTagActiveTextColor = resolveColor(
      tagActiveTextColor,
      themeColors,
    );

    const resolvedSearchBg = resolveColor(searchBg, themeColors);
    const resolvedSearchTextColor = resolveColor(searchTextColor, themeColors);
    const resolvedSearchBorderColor = resolveColor(
      searchBorderColor,
      themeColors,
    );
    const resolvedSearchIconColor = resolveColor(searchIconColor, themeColors);

    const cardColors = {
      cardBg: resolveColor(cardBg, themeColors),
      cardBorder: resolveColor(cardBorder, themeColors),
      cardBorderActive: resolveColor(cardBorderActive, themeColors),
      questionColor: resolveColor(questionColor, themeColors),
      questionActiveColor: resolveColor(questionActiveColor, themeColors),
      answerColor: resolveColor(answerColor, themeColors),
      chevronBg: resolveColor(chevronBg, themeColors),
      chevronColor: resolveColor(chevronColor, themeColors),
      chevronActiveBg: resolveColor(chevronActiveBg, themeColors),
      chevronActiveColor: resolveColor(chevronActiveColor, themeColors),
    };

    const scopedClass = `pb-faq-${id}`;

    // Plain :hover/:focus rules can't be expressed via inline style, so
    // this restores the interactivity the original Tailwind version had
    // (tag hover border/text, card hover shadow/border, search focus
    // ring) using the SAME resolved colors as the rest of the widget —
    // hover states just reuse the "active" tag colors and the open-card
    // border color, so everything stays consistent with whatever the
    // admin picked, rather than introducing more color fields.
    // !important is needed to beat this element's own inline style
    // (the same reasoning as buildHoverCss in hoverField.js).
    const hoverCss = `
.${scopedClass}-tag:hover {
  border-color: ${resolvedTagActiveBg} !important;
  color: ${resolvedTagActiveBg} !important;
}
.${scopedClass}-search:focus {
  border-color: ${resolvedTagActiveBg} !important;
  box-shadow: 0 0 0 3px ${resolvedTagActiveBg}22 !important;
}
.${scopedClass}-card:hover {
  border-color: ${cardColors.cardBorderActive} !important;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06) !important;
}
`;

    return (
      <div className="flex flex-col gap-8">
        <style>{hoverCss}</style>

        {showBar && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {showCategoryFilter && tagLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isActive = activeCategory === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveCategory(tag)}
                      className={`text-sm font-semibold px-5 py-2 rounded-full border transition-all duration-200 ${!isActive ? `${scopedClass}-tag` : ""}`}
                      style={{
                        background: isActive
                          ? resolvedTagActiveBg
                          : resolvedTagBg,
                        color: isActive
                          ? resolvedTagActiveTextColor
                          : resolvedTagTextColor,
                        borderColor: isActive
                          ? resolvedTagActiveBg
                          : resolvedTagBorderColor,
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}

            {showSearch && (
              <div className="relative flex-1 min-w-[240px] max-w-sm ml-auto">
                <i
                  className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none"
                  style={{ color: resolvedSearchIconColor }}
                />
                <input
                  type="text"
                  placeholder="Search your question..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${scopedClass}-search w-full text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none border transition-all`}
                  style={{
                    background: resolvedSearchBg,
                    color: resolvedSearchTextColor,
                    borderColor: resolvedSearchBorderColor,
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-colors"
                    style={{ color: resolvedSearchIconColor }}
                  >
                    <i className="ti ti-x" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                cardColors={cardColors}
                scopedClass={scopedClass}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-search-off" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-2">
              No results found
            </h3>
            <p className="text-sm text-slate-400">
              Try a different keyword or browse by category.
            </p>
          </div>
        )}
      </div>
    );
  },
};
