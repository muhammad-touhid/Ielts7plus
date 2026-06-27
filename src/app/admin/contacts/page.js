import prisma from "@/lib/prisma";

export default async function AdminContactsPage() {
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          Contact Submissions
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Messages received from the contact form.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Messages",
            value: contacts.length,
            icon: "ti ti-mail",
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "This Month",
            value: contacts.filter(
              (c) => new Date(c.createdAt).getMonth() === new Date().getMonth(),
            ).length,
            icon: "ti ti-calendar",
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Today",
            value: contacts.filter(
              (c) =>
                new Date(c.createdAt).toDateString() ===
                new Date().toDateString(),
            ).length,
            icon: "ti ti-clock",
            color: "bg-amber-50 text-amber-600",
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

      {/* Messages */}
      <div className="flex flex-col gap-4">
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <i className="ti ti-user text-base" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <i className="ti ti-mail text-slate-300" />
                        {c.email}
                      </span>
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <i className="ti ti-phone text-slate-300" />
                          {c.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                    {c.subject}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100" />

              {/* Message */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {c.message}
              </p>

              {/* Reply button */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${c.email}&su=Re: ${encodeURIComponent(c.subject)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  <i className="ti ti-mail-forward text-sm" />
                  Reply via Gmail
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-mail" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No messages yet
            </p>
            <p className="text-xs text-slate-400">
              Contact form submissions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
