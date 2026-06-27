import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteBatchButton from "./DeleteBatchButton";

export default async function AdminBatchesPage() {
  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Batches</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage all upcoming batches.
          </p>
        </div>
        <Link
          href="/admin/batches/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          <i className="ti ti-plus text-base" />
          Add New Batch
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {batches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{batch.name}</p>
                        <p className="text-xs text-slate-400">{batch.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {batch.course?.name ?? (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-700 text-xs font-semibold">
                          {batch.schedule}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {batch.duration}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 text-xs font-semibold">
                      {batch.startDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${batch.seats <= 5 ? "bg-rose-100 text-rose-600" : batch.seats <= 10 ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}
                      >
                        {batch.seats} left
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${batch.published ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {batch.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/batches/${batch.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                          <i className="ti ti-edit text-sm" />
                          Edit
                        </Link>
                        <Link
                          href={`/admin/batches/${batch.id}/students`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all duration-200"
                        >
                          <i className="ti ti-users text-sm" />
                          Students
                        </Link>
                        <DeleteBatchButton id={batch.id} name={batch.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-calendar-event" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No batches yet
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Get started by adding your first batch.
            </p>
            <Link
              href="/admin/batches/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              <i className="ti ti-plus" />
              Add New Batch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
