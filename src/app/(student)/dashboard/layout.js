// src/app/(student)/dashboard/layout.js
import SessionWrapper from "@/components/common/SessionWrapper";
import PageRenderer from "@/app/(public)/PageRenderer";
import { getPublishedPageData } from "@/lib/pageBuilder/getPublishedPage";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
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
