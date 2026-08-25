// src/app/(student)/dashboard/layout.js
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SessionWrapper from "@/components/common/SessionWrapper";
import PageRenderer from "@/app/(public)/PageRenderer";
import { getPublishedPageData } from "@/lib/pageBuilder/getPublishedPage";

export const dynamic = "force-dynamic";

const STAFF_ROLES = ["admin", "teacher", "moderator"];

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (STAFF_ROLES.includes(session.user?.role)) {
    redirect("/admin");
  }

  const [headerData, footerData] = await Promise.all([
    getPublishedPageData("site-header"),
    getPublishedPageData("site-footer"),
  ]);

  return (
    <SessionWrapper>
      {headerData && <PageRenderer data={headerData} />}
      <main>{children}</main>
      {footerData && <PageRenderer data={footerData} />}
    </SessionWrapper>
  );
}
