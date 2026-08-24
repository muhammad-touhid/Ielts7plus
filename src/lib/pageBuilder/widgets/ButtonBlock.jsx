// src/lib/pageBuilder/widgets/ButtonBlock.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SignInModal from "@/components/common/SignInModal";
import { TEXT_SIZE_PRESETS, TEXT_ALIGN_PRESETS } from "../fields/flexibleSize";
import { responsiveField } from "../fields/responsiveField";
import { colorField, resolveColor, hexToRgba } from "../fields/colorField";
import { fontField, resolveFont } from "../fields/fontField";
import {
  borderFieldSet,
  borderDefaultProps,
  borderToEntries,
} from "../fields/borderFields";
import {
  ResponsiveStyle,
  alignToJustifyEntries,
} from "../fields/responsiveStyle";
import {
  spacingBoxField,
  spacingBoxToEntries,
} from "../fields/spacingBoxField";
import {
  hoverFieldSet,
  hoverDefaultProps,
  buildHoverCss,
} from "../fields/hoverField";
import {
  shadowField,
  shadowDefaultProps,
  resolveShadow,
} from "../fields/shadowField";
import { useThemeColors } from "../theme/ThemeColorsContext";

// One widget, two behaviors, switched by the `isAuthButton` toggle:
//
//   - OFF (default): a plain configurable button — real <Link href>,
//     full styling control (variant, font, colors, icon, padding,
//     border, shadow, hover).
//   - ON: session-aware. Logged out, same button styling but onClick
//     opens SignInModal instead of navigating. Logged in, swaps
//     entirely to an avatar+name trigger with a Dashboard/Sign Out
//     dropdown — structurally different from a text button, so that
//     state gets its own small extra fields (avatarColor, nameColor)
//     via resolveFields.
//
// Field panel switching uses Puck's resolveFields API (v0.15+,
// confirmed against Puck's own docs/changelog) — href is hidden and
// dashboardLabel/signOutLabel/avatarColor/nameColor appear only when
// isAuthButton is checked.
//
// defaultProps includes ALL possible fields (auth ones too) regardless
// of isAuthButton's default value, so nothing is undefined the moment
// the toggle flips.
//
// Dropdown uses position:"fixed" computed from getBoundingClientRect()
// on click, not "absolute" — escapes a Section ancestor's hardcoded
// overflow:"hidden", same reasoning as Menu's dropdown.

// colorField's "Inherit" preset is stored as {type:"custom",
// value:"inherit"} (colorField always wraps preset selections in this
// shape), NOT the plain string "inherit" — comparing the raw prop
// directly against "inherit" silently fails and falls through to
// resolveColor(), which returns the literal CSS keyword `inherit`
// (valid CSS, but "inherit from parent element" — an unrelated
// mechanism from the intended CSS variable) instead of ever reading
// the variable. Module-scoped so both ButtonRender and
// ButtonBlockRender (the logged-in branch) can use it.
function isInheritColor(v) {
  return (
    v === "inherit" || (v && typeof v === "object" && v.value === "inherit")
  );
}

function buttonFieldSet({ hideHref = false } = {}) {
  return {
    text: { type: "text", label: "Button Text" },
    ...(hideHref ? {} : { href: { type: "text", label: "Link URL" } }),
    variant: {
      type: "radio",
      label: "Fill",
      options: [
        { label: "Filled", value: "filled" },
        {
          label: "Transparent (use border below for outline)",
          value: "transparent",
        },
      ],
    },
    font: fontField("Font", "button"),
    bgColor: colorField("Background Color", [
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
      { label: "White", value: "#ffffff" },
      { label: "Emerald", value: "#10b981" },
    ]),
    bgOpacity: {
      type: "select",
      label: "Background Opacity",
      options: [
        { label: "100%", value: "100" },
        { label: "75%", value: "75" },
        { label: "50%", value: "50" },
        { label: "25%", value: "25" },
        { label: "10%", value: "10" },
      ],
    },
    textColor: colorField("Text Color", [
      {
        label: "Inherit (follows parent Section's scroll color)",
        value: "inherit",
      },
      { label: "White", value: "#ffffff" },
      { label: "Brand blue", value: "#2563eb" },
      { label: "Dark", value: "#111827" },
    ]),
    weight: {
      type: "select",
      label: "Font Weight",
      options: [
        { label: "Normal", value: "font-normal" },
        { label: "Medium", value: "font-medium" },
        { label: "Bold", value: "font-bold" },
        { label: "Extra Bold", value: "font-extrabold" },
      ],
    },
    textCase: {
      type: "select",
      label: "Text Case",
      options: [
        { label: "None", value: "none" },
        { label: "UPPERCASE", value: "uppercase" },
        { label: "lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ],
    },
    icon: {
      type: "text",
      label: "Icon Class (blank = no icon, e.g. ti-arrow-right)",
    },
    iconPosition: {
      type: "radio",
      label: "Icon Position",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    width: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Auto", value: "inline-block" },
        { label: "Full width", value: "block w-full text-center" },
      ],
    },
    size: responsiveField("Text Size", TEXT_SIZE_PRESETS),
    align: responsiveField("Alignment", TEXT_ALIGN_PRESETS),
    padding: spacingBoxField("Padding"),
    margin: spacingBoxField("Margin"),
    ...borderFieldSet(),
    shadow: shadowField(),
    ...hoverFieldSet(),
  };
}

function buttonDefaultProps() {
  return {
    text: "Get Started",
    href: "/",
    variant: "filled",
    font: { type: "theme", token: "button" },
    bgColor: "#2563eb",
    bgOpacity: "100",
    textColor: "#ffffff",
    weight: "font-medium",
    textCase: "none",
    icon: "",
    iconPosition: "right",
    width: "inline-block",
    size: { desktop: "1rem" },
    align: { desktop: "left" },
    padding: {
      top: { desktop: "12" },
      right: { desktop: "24" },
      bottom: { desktop: "12" },
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
    ...borderDefaultProps(),
    ...hoverDefaultProps(),
    ...shadowDefaultProps(),
  };
}

// as: "link" (real navigation) | "button" (onClick, e.g. opening a modal)
function ButtonRender({
  id,
  text,
  href,
  as = "link",
  onClick,
  variant,
  font,
  bgColor,
  bgOpacity,
  textColor,
  weight,
  textCase,
  icon,
  iconPosition,
  width,
  size,
  align,
  padding,
  margin,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
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
  shadow,
}) {
  const { themeColors, themeFonts } = useThemeColors();
  const scopedClass = `pb-button-${id}`;
  const resolvedBgHex = resolveColor(bgColor, themeColors);
  const resolvedTextHex = isInheritColor(textColor)
    ? "var(--pb-scroll-text-color, #ffffff)"
    : resolveColor(textColor, themeColors);
  const resolvedBg =
    variant === "filled"
      ? hexToRgba(resolvedBgHex, parseInt(bgOpacity, 10))
      : "transparent";
  const resolvedFont = resolveFont(font, themeFonts);

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

  const sharedClassName = `${width} ${weight} ${scopedClass} inline-flex items-center justify-center gap-2`;
  const sharedStyle = {
    backgroundColor: resolvedBg,
    color: resolvedTextHex,
    textTransform: textCase,
    fontFamily: resolvedFont ? `'${resolvedFont}', sans-serif` : undefined,
    boxShadow: resolveShadow(shadow) || undefined,
  };
  const content = (
    <>
      {icon && iconPosition === "left" && <i className={`ti ${icon}`} />}
      {text}
      {icon && iconPosition === "right" && <i className={`ti ${icon}`} />}
    </>
  );

  return (
    <div className={`${scopedClass}-wrap`}>
      <ResponsiveStyle
        className={`${scopedClass}-wrap`}
        entries={[{ property: "text-align", value: align }]}
      />
      <ResponsiveStyle
        className={scopedClass}
        entries={[
          { property: "font-size", value: size },
          ...spacingBoxToEntries("padding", padding),
          ...spacingBoxToEntries("margin", margin),
          ...borderToEntries({
            borderWidth,
            borderStyle,
            borderColor,
            borderRadius,
          }),
        ]}
      />
      {hoverCss && <style>{hoverCss}</style>}
      {as === "button" ? (
        <button
          type="button"
          onClick={onClick}
          className={sharedClassName}
          style={{ ...sharedStyle, border: "none", cursor: "pointer" }}
        >
          {content}
        </button>
      ) : (
        <Link
          href={href || "#"}
          className={sharedClassName}
          style={sharedStyle}
        >
          {content}
        </Link>
      )}
    </div>
  );
}

const IS_AUTH_BUTTON_FIELD = {
  type: "radio",
  label: "Button Type",
  options: [
    { label: "Regular Button", value: false },
    { label: "Auth Button (Sign In / Dashboard)", value: true },
  ],
};

// Built exactly once at module load, same fix as Section.jsx —
// resolveFields must never recreate these, or every custom field's
// input loses focus after one keystroke (React remounts the DOM node
// because it sees a "different" render function every time).
const STATIC_BUTTON_FIELDS = {
  isAuthButton: IS_AUTH_BUTTON_FIELD,
  ...buttonFieldSet(),
};
const AUTH_BUTTON_FIELDS = {
  isAuthButton: IS_AUTH_BUTTON_FIELD,
  ...buttonFieldSet({ hideHref: true }),
};

const DASHBOARD_LABEL_FIELD = { type: "text", label: "Dashboard Link Text" };
const SIGN_OUT_LABEL_FIELD = { type: "text", label: "Sign Out Text" };
const AVATAR_COLOR_FIELD = colorField(
  "Logged-in Avatar Color (fallback initial)",
  [
    { label: "Brand blue", value: "#2563eb" },
    { label: "Dark", value: "#111827" },
    { label: "Red accent", value: "#f87171" },
  ],
);
const NAME_COLOR_FIELD = colorField("Logged-in Name Color", [
  {
    label: "Inherit (follows parent Section's scroll color)",
    value: "inherit",
  },
  { label: "Dark", value: "#1e293b" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#9ca3af" },
]);

export const ButtonBlock = {
  label: "Button",
  fields: STATIC_BUTTON_FIELDS,
  resolveFields: (data) => {
    const isAuth = !!data.props.isAuthButton;
    if (isAuth) {
      return {
        ...AUTH_BUTTON_FIELDS,
        dashboardLabel: DASHBOARD_LABEL_FIELD,
        signOutLabel: SIGN_OUT_LABEL_FIELD,
        avatarColor: AVATAR_COLOR_FIELD,
        nameColor: NAME_COLOR_FIELD,
      };
    }
    return STATIC_BUTTON_FIELDS;
  },
  defaultProps: {
    isAuthButton: false,
    ...buttonDefaultProps(),
    dashboardLabel: "Dashboard",
    signOutLabel: "Sign Out",
    avatarColor: "#2563eb",
    nameColor: "#1e293b",
  },
  render: function ButtonBlockRender(props) {
    const {
      id,
      isAuthButton,
      dashboardLabel,
      signOutLabel,
      avatarColor,
      nameColor,
      align,
      margin,
    } = props;

    // Hooks called unconditionally (rules of hooks) — results just go
    // unused in the non-auth branch.
    const { themeColors } = useThemeColors();
    const { data: session } = useSession();
    const [showSignIn, setShowSignIn] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    if (!isAuthButton) {
      return <ButtonRender {...props} as="link" />;
    }

    const isLoggedIn = !!session;

    if (!isLoggedIn) {
      return (
        <>
          <ButtonRender
            {...props}
            as="button"
            onClick={() => setShowSignIn(true)}
          />
          {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
        </>
      );
    }

    // Logged in — avatar + name trigger, Dashboard/Sign Out dropdown.
    const scopedClass = `pb-button-${id}`;
    const wrapClass = `${scopedClass}-wrap`;
    const resolvedAvatar = resolveColor(avatarColor, themeColors);
    const resolvedName = isInheritColor(nameColor)
      ? "var(--pb-scroll-text-color, #1e293b)"
      : resolveColor(nameColor, themeColors);
    const role = session?.user?.role;
    const dashboardHref =
      role === "admin" || role === "teacher" || role === "moderator"
        ? "/admin"
        : "/dashboard";

    function handleUserButtonClick(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.right - 208 });
      setShowUserMenu((v) => !v);
    }

    function handleSignOut() {
      setShowUserMenu(false);
      signOut({ callbackUrl: "/" });
    }

    return (
      <>
        <ResponsiveStyle
          className={wrapClass}
          entries={alignToJustifyEntries(align)}
        />
        <ResponsiveStyle
          className={scopedClass}
          entries={spacingBoxToEntries("margin", margin)}
        />
        <div className={wrapClass}>
          <div className={scopedClass}>
            <button
              type="button"
              onClick={handleUserButtonClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                borderRadius: 10,
              }}
            >
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "9999px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "9999px",
                    background: resolvedAvatar,
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                  }}
                >
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <span
                style={{
                  color: resolvedName,
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                }}
              >
                {session.user?.name?.split(" ")[0]}
              </span>
            </button>

            {showUserMenu && (
              <div
                onMouseLeave={() => setShowUserMenu(false)}
                style={{
                  position: "fixed",
                  top: menuPos.top,
                  left: menuPos.left,
                  width: 208,
                  background: "#ffffff",
                  border: "1px solid #f1f5f9",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  padding: 6,
                  zIndex: 9999,
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid #f1f5f9",
                    marginBottom: 4,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {session.user?.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {session.user?.email}
                  </p>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    color: "#475569",
                    textDecoration: "none",
                  }}
                >
                  <i className="ti ti-layout-dashboard" />
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    color: "#f43f5e",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <i className="ti ti-logout" />
                  {signOutLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  },
};
