import prisma from "@/lib/prisma";
import DeleteRegistrationButton from "./DeleteRegistrationButton";

export const dynamic = "force-dynamic";

export default async function AdminEventRegistrationsPage() {
  const registrations = await prisma.eventRegistration.findMany({
    include: { event: { select: { title: true, date: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          Event Registrations
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Students who registered for upcoming events.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {registrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{reg.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-600 flex items-center gap-1.5">
                          <i className="ti ti-mail text-slate-300" />
                          {reg.email}
                        </span>
                        <span className="text-xs text-slate-600 flex items-center gap-1.5">
                          <i className="ti ti-phone text-slate-300" />
                          {reg.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-700 text-xs font-semibold">
                          {reg.event?.title ?? (
                            <span className="text-slate-300">
                              Event deleted
                            </span>
                          )}
                        </p>
                        {reg.event?.date && (
                          <p className="text-slate-400 text-xs">
                            {reg.event.date}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[220px]">
                      {reg.message ? (
                        <p className="text-slate-500 text-xs line-clamp-2">
                          {reg.message}
                        </p>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <DeleteRegistrationButton id={reg.id} name={reg.name} />
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
              No registrations yet
            </p>
            <p className="text-xs text-slate-400">
              Event sign-ups will appear here once students register.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
