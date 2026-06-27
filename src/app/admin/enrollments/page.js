import prisma from "@/lib/prisma";
import UpdateEnrollmentStatus from "./UpdateEnrollmentStatus";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: { batch: { select: { name: true } } },
  });

  const total = enrollments.length;
  const pending = enrollments.filter((e) => e.status === "pending").length;
  const confirmed = enrollments.filter((e) => e.status === "confirmed").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Enrollments</h1>
        <p className="text-slate-400 text-sm mt-1">
          All student enrollment submissions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Enrollments",
            value: total,
            icon: "ti ti-users",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Pending",
            value: pending,
            icon: "ti ti-clock",
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Confirmed",
            value: confirmed,
            icon: "ti ti-circle-check",
            color: "bg-emerald-50 text-emerald-600",
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{e.name}</p>
                      <p className="text-xs text-slate-400">{e.email}</p>
                      <p className="text-xs text-slate-400">{e.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {e.batch?.name ?? (
                        <span className="text-slate-300">—</span>
                      )}
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
                      <UpdateEnrollmentStatus
                        id={e.id}
                        currentStatus={e.status}
                      />
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
              No enrollments yet
            </p>
            <p className="text-xs text-slate-400">
              Enrollment submissions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
