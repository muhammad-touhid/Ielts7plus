import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditUserForm from "./EditUserForm";

export default async function EditUserPage({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
        include: { batch: { select: { name: true } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <a
          href="/admin/users"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </a>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Edit User</h1>
          <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
        </div>
      </div>

      <EditUserForm user={user} />

      {/* Enrollments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Enrollments</h2>
        </div>
        {user.enrollments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {user.enrollments.map((e) => (
              <div
                key={e.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-slate-700 text-sm">
                    {e.batch?.name ?? "—"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(e.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
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
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-8">
            No enrollments yet.
          </p>
        )}
      </div>
    </div>
  );
}
