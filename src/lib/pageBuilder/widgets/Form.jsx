"use client";

import { useState } from "react";
import { useThemeColors } from "../theme/ThemeColorsContext";
import { colorField, resolveColor } from "../fields/colorField";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
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

const ACCENT_COLOR_PRESETS = [
  { label: "Brand blue", value: "#2563eb" },
  { label: "Dark", value: "#111827" },
  { label: "Emerald", value: "#059669" },
];

const BOX_BG_COLOR_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Light gray", value: "#f9fafb" },
  { label: "Transparent", value: "transparent" },
];

const FIELD_TYPE_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "tel" },
  { label: "Textarea", value: "textarea" },
  { label: "Select (dropdown)", value: "select" },
];

const FIELD_WIDTH_OPTIONS = [
  { label: "Full Width", value: "full" },
  { label: "Half Width", value: "half" },
  { label: "One Third Width", value: "third" },
];

// A 6-column grid gives exact proportions regardless of which widths
// sit next to each other — Half = 3/6, Third = 2/6, Full spans all 6.
// (The previous auto-fit/minmax approach only ever produced roughly
// "as many equal columns as fit," which is why Half was rendering as
// a third whenever three fields ended up sharing a row.)
const WIDTH_SPAN = {
  full: "1 / -1",
  half: "span 3",
  third: "span 2",
};

// Sensible default icon per field type — admin can override per field
// via the optional Icon field below if a specific one is wanted.
const DEFAULT_FIELD_ICONS = {
  text: "ti-user",
  email: "ti-mail",
  tel: "ti-phone",
  textarea: "ti-message",
  select: "ti-tag",
};

// Turns a field's label into a stable data key, e.g. "Full Name" ->
// "full-name". This is the key each field's value is stored under in
// FormSubmission.data — no separate "field key" input needed.
function slugifyLabel(label) {
  return (
    (label || "field")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "field"
  );
}

const STATIC_FIELDS = {
  formHeading: { type: "text", label: "Form Heading (optional)" },
  formSubheading: { type: "textarea", label: "Form Subheading (optional)" },
  fields: {
    type: "array",
    label: "Form Fields",
    arrayFields: {
      label: { type: "text", label: "Field Label" },
      type: {
        type: "select",
        label: "Field Type",
        options: FIELD_TYPE_OPTIONS,
      },
      width: {
        type: "radio",
        label: "Field Width",
        options: FIELD_WIDTH_OPTIONS,
      },
      placeholder: { type: "text", label: "Placeholder" },
      required: {
        type: "radio",
        label: "Required",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
      },
      // Only used when type === "select" — comma-separated, e.g.
      // "Morning, Afternoon, Evening"
      options: {
        type: "text",
        label: "Options (comma-separated, Select only)",
      },
      // Optional — leave blank to use the sensible default for this
      // field's type (e.g. Email fields get ti-mail automatically).
      icon: { type: "text", label: "Icon Override (optional, e.g. ti-tag)" },
    },
    defaultItemProps: {
      label: "Field Label",
      type: "text",
      width: "full",
      placeholder: "",
      required: "no",
      options: "",
      icon: "",
    },
    getItemSummary: (item) => item?.label || "Field",
  },
  submitLabel: { type: "text", label: "Submit Button Text" },
  successTitle: { type: "text", label: "Success Title" },
  successMessage: { type: "textarea", label: "Success Message" },
  // Optional label stored with every submission from this widget
  // instance, so submissions can be filtered by purpose in the admin
  // list even if several forms share a page slug over time.
  formLabel: { type: "text", label: "Form Label (for admin submissions list)" },
  accentColor: colorField(
    "Accent Color (button, focus ring & hover)",
    ACCENT_COLOR_PRESETS,
  ),
  bgColor: colorField("Background Color", BOX_BG_COLOR_PRESETS),
  padding: spacingBoxField("Padding"),
  ...borderFieldSet(),
  shadow: shadowField(),
};

export const Form = {
  label: "Form",
  fields: STATIC_FIELDS,
  defaultProps: {
    id: "form-default",
    formHeading: "Get in Touch",
    formSubheading: "Fill in your details below and we'll be in touch.",
    fields: [
      {
        label: "Full Name",
        type: "text",
        width: "half",
        placeholder: "Your full name",
        required: "yes",
        options: "",
        icon: "",
      },
      {
        label: "Email Address",
        type: "email",
        width: "half",
        placeholder: "your@email.com",
        required: "yes",
        options: "",
        icon: "",
      },
      {
        label: "Phone Number",
        type: "tel",
        width: "half",
        placeholder: "+880 1700-000000",
        required: "no",
        options: "",
        icon: "",
      },
      {
        label: "Subject",
        type: "select",
        width: "half",
        placeholder: "Select a subject",
        required: "yes",
        options:
          "Course Inquiry, Batch Schedule, Fees & Payment, Free Consultation, Other",
        icon: "",
      },
      {
        label: "Your Message",
        type: "textarea",
        width: "full",
        placeholder: "Write your message here...",
        required: "yes",
        options: "",
        icon: "",
      },
    ],
    submitLabel: "Send Message",
    successTitle: "Thank You!",
    successMessage: "We've received your submission and will be in touch soon.",
    formLabel: "",
    accentColor: "#2563eb",
    bgColor: "#ffffff",
    padding: {
      top: { desktop: "28" },
      right: { desktop: "28" },
      bottom: { desktop: "28" },
      left: { desktop: "28" },
      linked: true,
      unit: "px",
    },
    ...borderDefaultProps(),
    ...shadowDefaultProps(),
  },
  render: function FormRender({
    id,
    formHeading,
    formSubheading,
    fields,
    submitLabel,
    successTitle,
    successMessage,
    formLabel,
    accentColor,
    bgColor,
    padding,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    shadow,
  }) {
    const { themeColors } = useThemeColors();
    const resolvedAccent = resolveColor(accentColor, themeColors);
    const resolvedBg = resolveColor(bgColor, themeColors);
    const scopedClass = `pb-form-${id}`;
    const list = Array.isArray(fields) ? fields : [];

    const [values, setValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    function handleChange(key, val) {
      setValues((v) => ({ ...v, [key]: val }));
    }

    async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/forms/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: values,
            formLabel: formLabel || formHeading || "",
            pageSlug:
              typeof window !== "undefined" ? window.location.pathname : "",
            pageTitle: typeof document !== "undefined" ? document.title : "",
          }),
        });
        if (res.ok) {
          setSuccess(true);
          setValues({});
        } else {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Something went wrong. Please try again.");
        }
      } catch {
        setError(
          "Failed to submit. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    // Focus ring/border, submit button hover — all keyed off Accent
    // Color so a single field drives the whole interactive palette.
    // Injected as a scoped <style> tag (same technique as buildHoverCss
    // elsewhere) since inline styles can't express :focus/:hover.
    const interactionCss = `
      .${scopedClass}-input:focus {
        border-color: ${resolvedAccent} !important;
        box-shadow: 0 0 0 3px ${resolvedAccent}26;
      }
      .${scopedClass}-submit:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -6px ${resolvedAccent}55;
      }
      /* Container query (not viewport-based) so Half/Third fields
         collapse to full width whenever THIS form is narrow — e.g.
         placed in a sidebar DropZone — even on a wide screen.
         Requires a modern browser (Chrome 105+, Safari 16+,
         Firefox 110+); older browsers simply keep the grid spans as
         set, which still looks fine on typical desktop widths. */
      .${scopedClass}-grid {
        container-type: inline-size;
      }
      @container (max-width: 420px) {
        .${scopedClass}-field {
          grid-column: 1 / -1 !important;
        }
      }
    `;

    const labelStyle = {
      fontSize: "11px",
      fontWeight: 700,
      color: "#475569",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "6px",
      display: "block",
    };

    if (success) {
      return (
        <div
          className={scopedClass}
          style={{ backgroundColor: resolvedBg, textAlign: "center" }}
        >
          <ResponsiveStyle
            className={scopedClass}
            entries={[
              ...spacingBoxToEntries("padding", padding),
              ...borderToEntries(
                { borderWidth, borderStyle, borderColor, borderRadius },
                themeColors,
              ),
            ]}
          />
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#ecfdf5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <i
              className="ti ti-circle-check"
              style={{ color: "#10b981", fontSize: 24 }}
            />
          </div>
          <h3 style={{ fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
            {successTitle}
          </h3>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
            {successMessage}
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: resolvedAccent,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit another response
          </button>
        </div>
      );
    }

    return (
      <div
        className={scopedClass}
        style={{
          backgroundColor: resolvedBg,
          boxShadow: resolveShadow(shadow) || undefined,
        }}
      >
        <ResponsiveStyle
          className={scopedClass}
          entries={[
            ...spacingBoxToEntries("padding", padding),
            ...borderToEntries(
              { borderWidth, borderStyle, borderColor, borderRadius },
              themeColors,
            ),
          ]}
        />
        <style>{interactionCss}</style>

        {formHeading && (
          <h3
            style={{
              fontWeight: 800,
              color: "#1e293b",
              fontSize: 18,
              marginBottom: 4,
            }}
          >
            {formHeading}
          </h3>
        )}
        {formSubheading && (
          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>
            {formSubheading}
          </p>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#e11d48",
              fontSize: 14,
              padding: "12px 16px",
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          <div
            className={`${scopedClass}-grid`}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 20,
              alignItems: "start",
            }}
          >
            {list.map((field, i) => {
              const key = slugifyLabel(field.label) + `-${i}`;
              const isRequired = field.required === "yes";
              const icon =
                field.icon || DEFAULT_FIELD_ICONS[field.type] || "ti-pencil";

              const fieldWrapperClass = `${scopedClass}-field`;
              const fieldWrapperStyle = {
                gridColumn: WIDTH_SPAN[field.width] || WIDTH_SPAN.full,
                display: "flex",
                flexDirection: "column",
              };

              const inputBoxStyle = {
                width: "100%",
                fontSize: "14px",
                padding: "14px 16px 14px 44px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: "#334155",
                outline: "none",
                boxSizing: "border-box",
              };

              if (field.type === "textarea") {
                return (
                  <div
                    key={key}
                    className={fieldWrapperClass}
                    style={fieldWrapperStyle}
                  >
                    <label style={labelStyle}>
                      {field.label}{" "}
                      {isRequired && (
                        <span style={{ color: "#f43f5e" }}>*</span>
                      )}
                    </label>
                    <div style={{ position: "relative" }}>
                      <i
                        className={`ti ${icon}`}
                        style={{
                          position: "absolute",
                          left: 16,
                          top: 18,
                          color: "#94a3b8",
                          fontSize: 16,
                          pointerEvents: "none",
                        }}
                      />
                      <textarea
                        rows={5}
                        required={isRequired}
                        placeholder={field.placeholder}
                        value={values[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={`${scopedClass}-input`}
                        style={{ ...inputBoxStyle, resize: "none" }}
                      />
                    </div>
                  </div>
                );
              }

              if (field.type === "select") {
                const opts = (field.options || "")
                  .split(",")
                  .map((o) => o.trim())
                  .filter(Boolean);
                return (
                  <div
                    key={key}
                    className={fieldWrapperClass}
                    style={fieldWrapperStyle}
                  >
                    <label style={labelStyle}>
                      {field.label}{" "}
                      {isRequired && (
                        <span style={{ color: "#f43f5e" }}>*</span>
                      )}
                    </label>
                    <div style={{ position: "relative" }}>
                      <i
                        className={`ti ${icon}`}
                        style={{
                          position: "absolute",
                          left: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                          fontSize: 16,
                          pointerEvents: "none",
                        }}
                      />
                      <select
                        required={isRequired}
                        value={values[key] || ""}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={`${scopedClass}-input`}
                        style={{
                          ...inputBoxStyle,
                          paddingRight: 40,
                          appearance: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>
                          {field.placeholder || "Select an option"}
                        </option>
                        {opts.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <i
                        className="ti ti-chevron-down"
                        style={{
                          position: "absolute",
                          right: 16,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                          fontSize: 14,
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  className={fieldWrapperClass}
                  style={fieldWrapperStyle}
                >
                  <label style={labelStyle}>
                    {field.label}{" "}
                    {isRequired && <span style={{ color: "#f43f5e" }}>*</span>}
                  </label>
                  <div style={{ position: "relative" }}>
                    <i
                      className={`ti ${icon}`}
                      style={{
                        position: "absolute",
                        left: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                        fontSize: 16,
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type={field.type || "text"}
                      required={isRequired}
                      placeholder={field.placeholder}
                      value={values[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={`${scopedClass}-input`}
                      style={inputBoxStyle}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${scopedClass}-submit`}
            style={{
              backgroundColor: resolvedAccent,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              padding: "16px",
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <i
                  className="ti ti-loader-2"
                  style={{ animation: "pb-form-spin 0.8s linear infinite" }}
                />
                Sending...
              </>
            ) : (
              <>
                <i className="ti ti-send" />
                {submitLabel}
              </>
            )}
          </button>
        </form>

        <style>{`
          @keyframes pb-form-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  },
};
