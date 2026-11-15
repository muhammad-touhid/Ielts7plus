import { genId } from "../genId";

// Starting point for the "site-header" Page (see reservedSlugs.js /
// getPublishedPage.js) — logo (links home) + horizontal Menu with
// dropdowns matching the real Header.jsx's nav structure + a Sign In /
// Dashboard auth button.
//
// KNOWN GAPS vs the real Header.jsx (accepted when choosing full
// replacement over keeping the real Header):
//   - No scroll-triggered background/color change (Section has no
//     scroll-aware behavior).
//   - Logo sizing is approximate — ImageBlock's width field is
//     percentage-only, not fixed px, same limitation flagged for the
//     CTA template's avatar row. The logo slot is a fixed 5rem wide
//     (80px, same as the old Header.jsx logo) and the image fills it.
//   - 3-equal column split (logo | menu | auth button) is a rough
//     approximation of the real header's logo-left/nav-center/cta-right
//     layout, not a pixel match.
//
// MOBILE: columnsMobile is "row", so the three columns stay side by
// side on phones (logo | hamburger | profile) instead of stacking.
export function headerTemplate() {
  const sectionId = genId("section");
  const logoSectionId = genId("section");
  const menuSectionId = genId("section");
  const buttonSectionId = genId("section");

  // Nested-Section-per-slot helper — same pattern as heroTemplate's
  // inner content Section and ctaTemplate's button-row Section. Each
  // slot gets its OWN contentWidth (resizable) and contentAlign
  // (horizontal position), independent of the other slots — this is
  // what actually gives you per-slot alignment control, rather than
  // relying on each widget's own blockAlign inside a rigid equal-width
  // grid column.
  function slotSection(slotId, align, width) {
    return {
      type: "Section",
      props: {
        id: slotId,
        columns: "1",
        columnGap: "0px",
        columnAlign: "center", // vertical centering within the slot
        bgType: "color",
        bgColor: "transparent",
        bgImage: "",
        overlayType: "none",
        overlayColor: "#000000",
        overlayColorFrom: "#1e3a8a",
        overlayColorTo: "#1d4ed8",
        overlayDirection: "to right",
        overlayOpacity: "0",
        minHeight: "auto",
        verticalAlign: "center",
        // MUST be narrower than the slot's actual column width for
        // contentAlign's left/center/right margin trick to have any
        // visible effect — "none" (no constraint) makes the box fill
        // 100% of the column, leaving zero free space to shift within,
        // so contentAlign silently does nothing regardless of value.
        // Resize freely in the editor — just don't set it back to "none".
        contentWidth: { desktop: width },
        contentAlign: align, // "left" | "center" | "right"
        stickyMode: "static",
        padding: {
          top: { desktop: "0" },
          right: { desktop: "0" },
          bottom: { desktop: "0" },
          left: { desktop: "0" },
          linked: false,
          unit: "px",
        },
        margin: {
          top: { desktop: "0" },
          right: { desktop: "0" },
          bottom: { desktop: "0" },
          left: { desktop: "0" },
          linked: false,
          unit: "px",
        },
        borderWidth: "0px",
        borderStyle: "none",
        borderColor: "transparent",
        borderRadius: {
          topLeft: { desktop: "0px" },
          topRight: { desktop: "0px" },
          bottomRight: { desktop: "0px" },
          bottomLeft: { desktop: "0px" },
          linked: true,
        },
      },
    };
  }

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "3-equal",
          columnsMobile: "row", // keep logo | menu | profile on one row on phones
          columnsMobileTracks: "1fr auto auto", // logo takes the space; hamburger + avatar hug the right edge
          columnGap: "8px",
          columnAlign: "center",
          bgType: "color",
          bgColor: "transparent", // transparent at top — hero shows through
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "center",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          // "fixed", not "sticky" — sticky stays in normal document
          // flow until you scroll past it, which pushes Hero down
          // below it instead of the header floating transparently on
          // top of Hero from the first pixel. Fixed removes the header
          // from flow entirely so Hero starts at the true top of the
          // page. Tradeoff: any OTHER page's content that immediately
          // follows the header and does NOT want to be covered by it
          // will need manual top padding added in the editor — Hero
          // wants the overlap, most other first-sections won't.
          stickyMode: "fixed",
          scrollBgColor: "#ffffff",
          scrollThreshold: 10,
          padding: {
            top: { desktop: "16" },
            right: { desktop: "24", mobile: "12" },
            bottom: { desktop: "16" },
            left: { desktop: "24", mobile: "12" },
            linked: false,
            unit: "px",
          },
          margin: {
            top: { desktop: "0" },
            right: { desktop: "0" },
            bottom: { desktop: "0" },
            left: { desktop: "0" },
            linked: false,
            unit: "px",
          },
          borderWidth: "0px",
          borderStyle: "none",
          borderColor: "transparent",
          borderRadius: {
            topLeft: { desktop: "0px" },
            topRight: { desktop: "0px" },
            bottomRight: { desktop: "0px" },
            bottomLeft: { desktop: "0px" },
            linked: true,
          },
        },
      },
    ],
    zones: {
      [`${sectionId}:col-0`]: [slotSection(logoSectionId, "left", "5rem")],
      [`${sectionId}:col-1`]: [slotSection(menuSectionId, "center", "40rem")],
      [`${sectionId}:col-2`]: [slotSection(buttonSectionId, "right", "24rem")],

      [`${logoSectionId}:col-0`]: [
        {
          type: "ImageBlock",
          props: {
            id: genId("image"),
            src: "/images/IELTS7.jpeg",
            alt: "IELTS7+ logo",
            href: "/",
            width: "100%",
            height: "auto",
            fit: "object-cover",
            blockAlign: { desktop: "left" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "8px" },
              topRight: { desktop: "8px" },
              bottomRight: { desktop: "8px" },
              bottomLeft: { desktop: "8px" },
              linked: true,
            },
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
      [`${menuSectionId}:col-0`]: [
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              {
                label: "Courses",
                href: "/courses",
                children: [
                  { label: "All Courses", href: "/courses" },
                  { label: "Batch Schedule", href: "/batch-schedule" },
                  { label: "IELTS", href: "/courses/ielts-preparation" },
                  {
                    label: "Spoken English",
                    href: "/courses/spoken-english",
                  },
                  {
                    label: "Advanced Writing",
                    href: "/courses/advanced-writing",
                  },
                  {
                    label: "Grammar & Writing",
                    href: "/courses/grammar-writing",
                  },
                ],
              },
              {
                label: "Mock Test",
                href: "/mock-test",
                children: [
                  { label: "Mock Test", href: "/mock-test" },
                  { label: "IELTS Calculator", href: "/band-calculator" },
                ],
              },
              {
                label: "About Us",
                href: "/about",
                children: [
                  { label: "About Us", href: "/about" },
                  { label: "Success Stories", href: "/success-stories" },
                  { label: "Guides", href: "/guides" },
                  { label: "FAQ", href: "/faq" },
                ],
              },
              { label: "Events", href: "/events", children: [] },
              { label: "Blog", href: "/blog", children: [] },
              { label: "Contact", href: "/contact", children: [] },
            ],
            orientation: "horizontal",
            textColor: "#374151",
            hoverColor: "#2563eb",
            fontSize: { desktop: "0.9375rem" },
            gap: "18px",
            blockAlign: { desktop: "center", mobile: "right" },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
      [`${buttonSectionId}:col-0`]: [
        {
          type: "ButtonBlock",
          props: {
            id: genId("button"),
            isAuthButton: true,
            text: "Sign In",
            href: "",
            variant: "filled",
            font: { type: "theme", token: "button" },
            bgColor: "#2563eb",
            bgOpacity: "100",
            textColor: "#ffffff",
            weight: "font-bold",
            textCase: "none",
            icon: "ti-login",
            iconPosition: "left",
            width: "inline-block",
            size: { desktop: "0.875rem" },
            align: { desktop: "right" },
            borderWidth: "0px",
            borderStyle: "none",
            borderColor: "transparent",
            borderRadius: {
              topLeft: { desktop: "8px" },
              topRight: { desktop: "8px" },
              bottomRight: { desktop: "8px" },
              bottomLeft: { desktop: "8px" },
              linked: true,
            },
            padding: {
              top: { desktop: "10" },
              right: { desktop: "18" },
              bottom: { desktop: "10" },
              left: { desktop: "18" },
              linked: false,
              unit: "px",
            },
            margin: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
            dashboardLabel: "Dashboard",
            signOutLabel: "Sign Out",
            avatarColor: "#2563eb",
            nameColor: "#1e293b",
          },
        },
      ],
    },
  };
}
