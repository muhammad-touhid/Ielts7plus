import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminMockTestsPage() {
  const submissions = await prisma.mockTestSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalPending = submissions.filter((s) => s.status === "pending").length;
  const totalEvaluated = submissions.filter(
    (s) => s.status === "evaluated",
  ).length;
  const totalResultSent = submissions.filter((s) => s.resultSent).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Mock Test Submissions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View and manage student mock test responses.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Submissions",
            value: submissions.length,
            icon: "ti ti-clipboard-text",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Pending Review",
            value: totalPending,
            icon: "ti ti-clock",
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Evaluated",
            value: totalEvaluated,
            icon: "ti ti-circle-check",
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Result Sent",
            value: totalResultSent,
            icon: "ti ti-mail",
            color: "bg-indigo-50 text-indigo-600",
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
        {submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Target Band
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{sub.name}</p>
                        <p className="text-xs text-slate-400">{sub.email}</p>
                        <p className="text-xs text-slate-400">{sub.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-blue-600">
                        {sub.targetBand ? (
                          `Band ${sub.targetBand}`
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {["listening", "reading", "writing", "speaking"].map(
                          (m) => (
                            <span
                              key={m}
                              className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize
                              ${
                                sub.completedModules.includes(m)
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-slate-100 text-slate-300"
                              }`}
                            >
                              {m.charAt(0).toUpperCase() + m.slice(1)}
                            </span>
                          ),
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full
                        ${
                          sub.status === "evaluated"
                            ? "bg-emerald-100 text-emerald-600"
                            : sub.status === "reviewing"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full
                        ${sub.resultSent ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {sub.resultSent ? "Sent" : "Not Sent"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/mock-tests/${sub.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                      >
                        <i className="ti ti-eye text-sm" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-clipboard-text" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No submissions yet
            </p>
            <p className="text-xs text-slate-400">
              Mock test submissions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
