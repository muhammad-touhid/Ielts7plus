import prisma from "@/lib/prisma";
import DeleteSubscriberButton from "./DeleteSubscriberButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewsletterAdminPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {subscribers.length} total subscriber
            {subscribers.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href={"/api/admin/newsletter/export"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Export CSV
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Subscribed At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sub.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <DeleteSubscriberButton id={sub.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
