import { genId } from "../genId";

// Starting point for the "site-footer" Page — dark background, 4
// columns (logo+text+social / quick links / resources / contact),
// matching the real Footer.jsx's structure.
//
// KNOWN GAPS vs the real Footer.jsx:
//   - Social icon row and the contact-info block use HtmlBlock (raw
//     HTML, inline styles) since no widget covers icon-only link rows
//     or a labeled icon+text list — same reasoning as the CTA
//     template's avatar row.
//   - The newsletter signup input+button is dropped entirely — no
//     widget handles form submission, and building one is out of scope
//     here. Add it back via HtmlBlock (display only, won't actually
//     submit anywhere) or wire up a real form widget later if needed.
export function footerTemplate() {
  const sectionId = genId("section");
  const dividerSectionId = genId("section");
  const bottomSectionId = genId("section");

  return {
    content: [
      {
        type: "Section",
        props: {
          id: sectionId,
          columns: "4-equal",
          columnGap: "32px",
          bgType: "color",
          bgColor: "#111827",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "80" },
            right: { desktop: "24" },
            bottom: { desktop: "40" },
            left: { desktop: "24" },
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
      {
        type: "Section",
        props: {
          id: dividerSectionId,
          columns: "1",
          columnGap: "0px",
          bgType: "color",
          bgColor: "#1f2937",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "1px",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "0" },
            right: { desktop: "24" },
            bottom: { desktop: "0" },
            left: { desktop: "24" },
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
      {
        type: "Section",
        props: {
          id: bottomSectionId,
          columns: "2-equal",
          columnGap: "16px",
          columnAlign: "center",
          bgType: "color",
          bgColor: "#111827",
          bgImage: "",
          overlayType: "none",
          overlayColor: "#000000",
          overlayColorFrom: "#1e3a8a",
          overlayColorTo: "#1d4ed8",
          overlayDirection: "to right",
          overlayOpacity: "0",
          minHeight: "auto",
          verticalAlign: "flex-start",
          contentWidth: { desktop: "80rem" },
          contentAlign: "center",
          padding: {
            top: { desktop: "24" },
            right: { desktop: "24" },
            bottom: { desktop: "24" },
            left: { desktop: "24" },
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
      [`${bottomSectionId}:col-0`]: [
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "© 2026 IELTS7+. All rights reserved.",
            size: { desktop: "0.75rem" },
            align: { desktop: "left" },
            color: "#4b5563",
            maxWidth: { desktop: "none" },
            blockAlign: { desktop: "left" },
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
          },
        },
      ],
      [`${bottomSectionId}:col-1`]: [
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              { label: "Privacy Policy", href: "/privacy", children: [] },
              { label: "Terms of Service", href: "/terms", children: [] },
              { label: "Cookie Policy", href: "/cookies", children: [] },
            ],
            orientation: "horizontal",
            textColor: "#4b5563",
            hoverColor: "#9ca3af",
            fontSize: { desktop: "0.75rem" },
            gap: "24px",
            blockAlign: { desktop: "right" },
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
      [`${sectionId}:col-0`]: [
        {
          type: "ImageBlock",
          props: {
            id: genId("image"),
            src: "/images/IELTS7.jpeg",
            alt: "IELTS7+ logo",
            href: "/",
            width: "50%",
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
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Text",
          props: {
            id: genId("text"),
            text: "Your trusted partner for achieving IELTS band 7 and above. Expert-led courses, real practice tests, and personalized feedback.",
            size: { desktop: "0.9375rem" },
            align: { desktop: "left" },
            color: "#9ca3af",
            maxWidth: { desktop: "none" },
            blockAlign: { desktop: "left" },
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
              bottom: { desktop: "20" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div style="display:flex;gap:8px;">
  <a href="https://www.facebook.com/ielts7plus" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-facebook"></i></a>
  <a href="https://www.instagram.com/ielts.7plus" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-instagram"></i></a>
  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-youtube"></i></a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:1px solid #374151;color:#9ca3af;text-decoration:none;"><i class="ti ti-brand-linkedin"></i></a>
</div>`,
            blockAlign: { desktop: "left" },
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
      [`${sectionId}:col-1`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Quick Links",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
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
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              {
                label: "IELTS",
                href: "/courses/ielts-preparation",
                children: [],
              },
              {
                label: "IELTS Preparation",
                href: "/courses/ielts-preparation",
                children: [],
              },
              {
                label: "IELTS Score Calculator",
                href: "/courses",
                children: [],
              },
              { label: "Course Fees", href: "/course-fee", children: [] },
              {
                label: "Batch Schedule",
                href: "/batch-schedule",
                children: [],
              },
              {
                label: "Success Stories",
                href: "/success-stories",
                children: [],
              },
            ],
            orientation: "vertical",
            textColor: "#d1d5db",
            hoverColor: "#f87171",
            fontSize: { desktop: "0.9375rem" },
            gap: "10px",
            blockAlign: { desktop: "left" },
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
      [`${sectionId}:col-2`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Resources",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
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
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "Menu",
          props: {
            id: genId("menu"),
            items: [
              { label: "Blog", href: "/blog", children: [] },
              { label: "Events", href: "/events", children: [] },
              { label: "Podcast", href: "#", children: [] },
              { label: "FAQs", href: "/faq", children: [] },
              { label: "Community", href: "#", children: [] },
              { label: "Support", href: "/contact", children: [] },
            ],
            orientation: "vertical",
            textColor: "#d1d5db",
            hoverColor: "#f87171",
            fontSize: { desktop: "0.9375rem" },
            gap: "10px",
            blockAlign: { desktop: "left" },
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
      [`${sectionId}:col-3`]: [
        {
          type: "Heading",
          props: {
            id: genId("heading"),
            text: "Contact Us",
            tag: "h3",
            size: { desktop: "1.125rem" },
            align: { desktop: "left" },
            color: "#ffffff",
            weight: "font-medium",
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
              bottom: { desktop: "16" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
        {
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div style="display:flex;flex-direction:column;gap:12px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-mail" style="font-size:1.25rem;color:#f87171;"></i>
    <a href="mailto:info@ielts7plus.co.uk" style="color:#d1d5db;text-decoration:none;">info@ielts7plus.co.uk</a>
  </div>
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-phone" style="font-size:1.25rem;color:#f87171;"></i>
    <a href="tel:+8801711153678" style="color:#d1d5db;text-decoration:none;">+8801711153678</a>
  </div>
  <div style="display:flex;align-items:center;gap:12px;">
    <i class="ti ti-map-pin" style="font-size:1.25rem;color:#f87171;"></i>
    <span style="color:#d1d5db;">Dhaka, Bangladesh</span>
  </div>
</div>`,
            blockAlign: { desktop: "left" },
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
        {
          // NEWSLETTER — added below Contact Us info. Inline styles
          // (not Tailwind classes) for the same reason the social-icon
          // row and contact-info blocks above use them: this html is
          // served via dangerouslySetInnerHTML, so Tailwind's JIT never
          // scans it and would purge any classes referenced here.
          // Hover on the button uses inline onmouseover/onmouseout
          // since inline styles can't express :hover.
          // NOTE: this is DISPLAY ONLY — the form has no onsubmit
          // handler, so clicking Subscribe does not currently POST
          // anywhere. Wire it to a real endpoint (e.g. an
          // /api/newsletter route) if/when you want it functional.
          type: "HtmlBlock",
          props: {
            id: genId("html"),
            html: `<div>
  <p style="margin:0 0 8px 0;font-size:0.75rem;color:#6b7280;">Subscribe to our newsletter</p>
  <div style="display:flex;overflow:hidden;border-radius:8px;border:1px solid #374151;">
    <input
      type="email"
      placeholder="Your email address"
      style="flex:1 1 0%;min-width:0;background-color:#1f2937;padding:8px 12px;font-size:0.875rem;color:#ffffff;outline:none;border:none;"
    />
    <button
      style="background-color:#ef4444;flex-shrink:0;padding:8px 16px;font-size:0.875rem;font-weight:500;color:#ffffff;border:none;cursor:pointer;transition:background-color 0.2s;"
      onmouseover="this.style.backgroundColor='#f87171'"
      onmouseout="this.style.backgroundColor='#ef4444'"
    >
      Subscribe
    </button>
  </div>
</div>`,
            blockAlign: { desktop: "left" },
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
            padding: {
              top: { desktop: "0" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: true,
              unit: "px",
            },
            margin: {
              top: { desktop: "20" },
              right: { desktop: "0" },
              bottom: { desktop: "0" },
              left: { desktop: "0" },
              linked: false,
              unit: "px",
            },
          },
        },
      ],
    },
  };
}
