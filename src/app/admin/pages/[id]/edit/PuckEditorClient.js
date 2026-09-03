// src/app/admin/pages/[id]/edit/PuckEditorClient.js
"use client";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import { config } from "@/lib/pageBuilder/config";
import TemplatesSection from "./TemplatesSection";
import CollapsibleSection from "./CollapsibleSection";
import HeaderActions from "./HeaderActions";
import OutlineSidebar from "./OutlineSidebar";
import RenamePageForm from "./RenamePageForm";
import SeoPanel from "./SeoPanel";
import { PUCK_VIEWPORTS } from "@/lib/pageBuilder/fields/breakpoints";
import { ThemeColorsProvider } from "@/lib/pageBuilder/theme/ThemeColorsContext";

export default function PuckEditorClient({ page }) {
  const router = useRouter();
  const [status, setStatus] = useState(page.status);
  const [saving, setSaving] = useState(false);
  const [pageMeta, setPageMeta] = useState({
    title: page.title,
    slug: page.slug,
  });
  const [seoOpen, setSeoOpen] = useState(false);
  const [seoMeta, setSeoMeta] = useState({
    metaTitle: page.metaTitle || "",
    metaDescription: page.metaDescription || "",
    metaKeywords: page.metaKeywords || "",
  });

  const initialContent = page.draftData ||
    page.data || { content: [], root: {}, zones: {} };
  const [pageData, setPageData] = useState(initialContent);

  const [remountKey, setRemountKey] = useState(0);

  const lastSavedRef = useRef(JSON.stringify(initialContent));

  async function persist(content, action) {
    setSaving(true);
    const res = await fetch(`/api/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, action }),
    });
    setSaving(false);
    if (res.ok) {
      if (action === "publish") setStatus("published");
      lastSavedRef.current = JSON.stringify(content);
      router.refresh();
    }
  }

  function handleChange(data) {
    setPageData(data);
  }

  function handleSaveDraft(data) {
    persist(data, "draft");
  }

  function handlePublishClick(data) {
    persist(data, "publish");
  }

  function handleInsertTemplate(fragment) {
    const next = {
      ...pageData,
      content: [...(pageData.content || []), ...fragment.content],
      zones: { ...(pageData.zones || {}), ...fragment.zones },
    };
    setPageData(next);
    setRemountKey((k) => k + 1);
  }

  function handleRenamed(updatedPage) {
    setPageMeta({ title: updatedPage.title, slug: updatedPage.slug });
    router.refresh();
  }

  return (
    <ThemeColorsProvider>
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/pages"
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← All Pages
            </Link>
            <RenamePageForm
              pageId={page.id}
              initialTitle={pageMeta.title}
              initialSlug={pageMeta.slug}
              onRenamed={handleRenamed}
            />
            <button
              onClick={() => setSeoOpen(true)}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-3 py-1.5"
            >
              SEO
            </button>
            {page.draftData && status === "published" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Draft changes pending
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Puck
            key={remountKey}
            config={config}
            data={pageData}
            onChange={handleChange}
            viewports={PUCK_VIEWPORTS}
            overrides={{
              drawer: ({ children }) => (
                <div>
                  <CollapsibleSection title="Templates" defaultOpen={true}>
                    <TemplatesSection onInsert={handleInsertTemplate} />
                  </CollapsibleSection>
                  <CollapsibleSection title="Elements" defaultOpen={true}>
                    {children}
                  </CollapsibleSection>
                </div>
              ),
              outline: () => <OutlineSidebar />,
              headerActions: () => (
                <HeaderActions
                  status={status}
                  saving={saving}
                  lastSavedRef={lastSavedRef}
                  onSaveDraft={handleSaveDraft}
                  onPublish={handlePublishClick}
                />
              ),
            }}
          />
        </div>
      </div>

      <SeoPanel
        pageId={page.id}
        open={seoOpen}
        onClose={() => setSeoOpen(false)}
        initialMetaTitle={seoMeta.metaTitle}
        initialMetaDescription={seoMeta.metaDescription}
        initialMetaKeywords={seoMeta.metaKeywords}
        onSaved={(updated) => setSeoMeta(updated)}
      />
    </ThemeColorsProvider>
  );
}
