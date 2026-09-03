"use client";

import { useState } from "react";
import Link from "next/link";
import DeletePageButton from "./DeletePageButton";

export default function CategoryAccordion({
  label,
  count,
  pages,
  defaultOpen,
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="font-semibold text-gray-800 text-sm">{label}</span>
          <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {pages.map((page) => {
            const publicHref = page.isHome ? "/" : `/${page.slug}`;
            return (
              <div
                key={page.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {page.title}
                    {page.isHome && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Homepage
                      </span>
                    )}
                    {page.isChrome && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {page.chromeLabel}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {page.isChrome
                      ? "Site chrome — no standalone URL"
                      : publicHref}{" "}
                    &middot;{" "}
                    <span
                      className={
                        page.status === "published"
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      {page.status}
                    </span>
                    {page.hasDraftPending && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Draft changes pending
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Created{" "}
                    {new Date(page.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    by{" "}
                    <span className="text-gray-500 font-medium">
                      {page.createdByName || "Unknown"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/admin/pages/${page.id}/edit`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Edit
                  </Link>
                  {page.status === "published" && !page.isChrome && (
                    <Link
                      href={publicHref}
                      target="_blank"
                      className="text-gray-500 hover:underline text-sm"
                    >
                      View
                    </Link>
                  )}
                  <DeletePageButton pageId={page.id} pageTitle={page.title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
