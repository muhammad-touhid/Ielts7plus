// src/app/admin/site-theme/page.js
export const dynamic = "force-dynamic";

import SiteThemeForm from "./SiteThemeForm";
import prisma from "@/lib/prisma";

const DEFAULT_COLORS = {
  primary: "#2563eb",
  secondary: "#f59e0b",
  text: "#111827",
  background: "#ffffff",
};
const DEFAULT_FONTS = {
  heading: "Poppins",
  paragraph: "Inter",
  button: "Inter",
  badge: "Inter",
};

export default async function SiteThemePage() {
  const row = await prisma.siteTheme.findUnique({ where: { id: 1 } });
  const colors = row?.colors || DEFAULT_COLORS;
  const fonts = row?.fonts || DEFAULT_FONTS;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Site Theme</h1>
      <p className="text-sm text-gray-500 mb-6">
        These colors and fonts power the &quot;Theme&quot; options across the
        page builder.
      </p>
      <SiteThemeForm initialColors={colors} initialFonts={fonts} />
    </div>
  );
}
