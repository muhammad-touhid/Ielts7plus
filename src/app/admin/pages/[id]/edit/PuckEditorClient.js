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

export default function PuckEditorClient({ page }) {
  const router = useRouter();
  const [status, setStatus] = useState(page.status);
  const [saving, setSaving] = useState(false);

  // Resume editing wherever you left off: prefer the pending draft if one
  // exists, otherwise start from the live published content.
  const initialContent = page.draftData || page.data || { content: [], root: {}, zones: {} };
  const [pageData, setPageData] = useState(initialContent);

  // Forces <Puck> to fully remount, which is how it picks up `pageData`
  // after we mutate it from outside the editor (Insert Template flow).
  const [remountKey, setRemountKey] = useState(0);

  // Tracks the last successfully-saved JSON (draft OR published, whichever
  // happened most recently), so the buttons can tell "nothing to save"
  // apart from "there are unsaved changes".
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

  // No autosave — the canvas only changes locally as you edit. Nothing
  // reaches the database until Save Draft or Publish/Update is clicked.
  function handleChange(data) {
    setPageData(data);
  }

  function handleSaveDraft(data) {
    persist(data, "draft");
  }

  function handlePublishClick(data) {
    persist(data, "publish");
  }

  // Merge a template fragment (real component data) into the current
  // page, then remount Puck so it renders the new layers as separate,
  // editable components. Not saved until Save Draft/Publish is clicked.
  function handleInsertTemplate(fragment) {
    const next = {
      ...pageData,
      content: [...(pageData.content || []), ...fragment.content],
      zones: { ...(pageData.zones || {}), ...fragment.zones },
    };
    setPageData(next);
    setRemountKey((k) => k + 1);
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-800">
            ← All Pages
          </Link>
          <span className="text-sm font-medium text-gray-900">{page.title}</span>
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
          overrides={{
            // Consolidates everything into Puck's ONE native left sidebar:
            // Templates (custom, top) + Elements (Puck's own drag
            // palette, passed through as `children`) — both collapsible.
            // Puck's "Outline" section stacks below this automatically.
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
  );
}
