// src/app/admin/pages/page.js
export const dynamic = "force-dynamic";
import Link from "next/link";
import prisma from "@/lib/prisma";
import NewPageForm from "./NewPageForm";
import DeletePageButton from "./DeletePageButton";

export default async function AdminPagesList() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pages</h1>

      <NewPageForm />

      <div className="mt-8 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        {pages.length === 0 && (
          <p className="p-6 text-sm text-gray-500">
            No pages yet. Create your first one above.
          </p>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between p-4 bg-white"
          >
            <div>
              <p className="font-medium text-gray-900">{page.title}</p>
              <p className="text-sm text-gray-500">
                /{page.slug} &middot;{" "}
                <span
                  className={
                    page.status === "published"
                      ? "text-green-600"
                      : "text-amber-600"
                  }
                >
                  {page.status}
                </span>
                {page.draftData && page.status === "published" && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Draft changes pending
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/pages/${page.id}/edit`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit
              </Link>
              {page.status === "published" && (
                <Link
                  href={`/p/${page.slug}`}
                  target="_blank"
                  className="text-gray-500 hover:underline text-sm"
                >
                  View
                </Link>
              )}
              <DeletePageButton pageId={page.id} pageTitle={page.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
