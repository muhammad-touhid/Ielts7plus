import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BatchStudentsPage({ params }) {
  const { id } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    select: { name: true, startDate: true, seats: true },
  });

  if (!batch) notFound();

  const enrollments = await prisma.enrollment.findMany({
    where: { batchId: id, status: "confirmed" },
    orderBy: { createdAt: "desc" },
  });

  const confirmed = enrollments.filter((e) => e.status === "confirmed");
  const pending = enrollments.filter((e) => e.status === "pending");
  const cancelled = enrollments.filter((e) => e.status === "cancelled");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/batches"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            {batch.name}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Student roster · Starts {batch.startDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Confirmed Students",
            value: enrollments.length,
            color: "bg-emerald-50 text-emerald-600",
            icon: "ti ti-circle-check",
          },
          {
            label: "Seats Remaining",
            value: batch.seats,
            color: "bg-blue-50 text-blue-600",
            icon: "ti ti-armchair",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${s.color}`}
            >
              <i className={s.icon} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">
                {s.value}
              </p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">All Students</h2>
          <span className="text-xs text-slate-400">
            {enrollments.length} total
          </span>
        </div>

        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Enrolled On
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((e, index) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{e.name}</p>
                      <p className="text-xs text-slate-400">{e.email}</p>
                      <p className="text-xs text-slate-400">{e.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {e.paymentMethod ? (
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {e.paymentMethod}
                          </p>
                          {e.transactionId && (
                            <p className="text-xs text-slate-400 font-mono">
                              {e.transactionId}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(e.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full
                        ${
                          e.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-600"
                            : e.status === "cancelled"
                              ? "bg-rose-100 text-rose-600"
                              : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-users" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No students enrolled yet
            </p>
            <p className="text-xs text-slate-400">
              Students who enroll in this batch will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
