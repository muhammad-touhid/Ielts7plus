import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import UpdateStatusButton from "./UpdateStatusButton";

export default async function MockTestDetailPage({ params }) {
  const { id } = await params;
  const sub = await prisma.mockTestSubmission.findUnique({ where: { id } });
  if (!sub) notFound();

  const answers = sub.answers;
  const modules = ["listening", "reading", "writing", "speaking"];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/mock-tests"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Submission Detail
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {sub.name} — {sub.email}
          </p>
        </div>
      </div>

      {/* Student info + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-user text-blue-600" />
            Student Details
          </h2>
          <ul className="flex flex-col gap-3">
            {[
              { label: "Name", value: sub.name, icon: "ti ti-user" },
              { label: "Email", value: sub.email, icon: "ti ti-mail" },
              { label: "Phone", value: sub.phone, icon: "ti ti-phone" },
              {
                label: "Target Band",
                value: sub.targetBand
                  ? `Band ${sub.targetBand}`
                  : "Not specified",
                icon: "ti ti-target",
              },
              {
                label: "Submitted",
                value: new Date(sub.createdAt).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
                icon: "ti ti-calendar",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <i
                  className={`${item.icon} text-blue-500 text-base mt-0.5 flex-shrink-0`}
                />
                <div>
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Modules completed */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-list-check text-blue-600" />
            Modules Attempted
          </h2>
          <ul className="flex flex-col gap-3">
            {modules.map((m) => {
              const done = sub.completedModules.includes(m);
              return (
                <li key={m} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600 capitalize">
                    <i
                      className={`ti ${m === "listening" ? "ti-headphones" : m === "reading" ? "ti-book" : m === "writing" ? "ti-pencil" : "ti-microphone"} text-blue-500`}
                    />
                    {m}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                  >
                    {done ? "Submitted" : "Not attempted"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Status management */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
          <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-settings text-blue-600" />
            Manage Status
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Current Status</p>
              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-full
                ${
                  sub.status === "evaluated"
                    ? "bg-emerald-100 text-emerald-600"
                    : sub.status === "reviewing"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                }`}
              >
                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Result Sent</p>
              <span
                className={`text-sm font-bold px-3 py-1.5 rounded-full ${sub.resultSent ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
              >
                {sub.resultSent ? "Yes — Result Sent" : "No — Not Sent Yet"}
              </span>
            </div>
            <div className="w-full h-px bg-slate-100" />
            <UpdateStatusButton
              id={sub.id}
              currentStatus={sub.status}
              currentResultSent={sub.resultSent}
            />
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="flex flex-col gap-5">
        <h2 className="text-base font-extrabold text-slate-800">
          Submitted Answers
        </h2>

        {/* Listening */}
        {answers?.listening && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h3 className="text-sm font-extrabold text-slate-700 mb-5 flex items-center gap-2">
              <i className="ti ti-headphones text-blue-600" />
              Listening Answers
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(answers.listening).map(([qId, answer]) => (
                <div
                  key={qId}
                  className="flex items-start gap-3 bg-slate-50 rounded-xl p-4"
                >
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
                    Q{qId}
                  </span>
                  <span className="text-sm text-slate-700">{answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading */}
        {answers?.reading && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h3 className="text-sm font-extrabold text-slate-700 mb-5 flex items-center gap-2">
              <i className="ti ti-book text-blue-600" />
              Reading Answers
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(answers.reading).map(([qId, answer]) => (
                <div
                  key={qId}
                  className="flex items-start gap-3 bg-slate-50 rounded-xl p-4"
                >
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
                    Q{qId}
                  </span>
                  <span className="text-sm text-slate-700">{answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Writing */}
        {answers?.writing && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h3 className="text-sm font-extrabold text-slate-700 mb-5 flex items-center gap-2">
              <i className="ti ti-pencil text-blue-600" />
              Writing Responses
            </h3>
            <div className="flex flex-col gap-5">
              {Object.entries(answers.writing).map(([taskId, text]) => (
                <div key={taskId}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {taskId === "task1"
                      ? "Task 1 — Academic Report"
                      : "Task 2 — Essay"}
                  </p>
                  <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                    {text || (
                      <span className="text-slate-300 italic">
                        Not attempted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speaking */}
        {answers?.speaking && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h3 className="text-sm font-extrabold text-slate-700 mb-5 flex items-center gap-2">
              <i className="ti ti-microphone text-blue-600" />
              Speaking Responses
            </h3>
            <div className="flex flex-col gap-4">
              {Object.entries(answers.speaking).map(([key, text]) => {
                const [part, q] = key.split("-");
                return (
                  <div
                    key={key}
                    className="bg-slate-50 rounded-xl p-5 border border-slate-100"
                  >
                    <p className="text-xs font-bold text-blue-600 mb-2">
                      Part {parseInt(part) + 1} — Q{parseInt(q) + 1}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {text || (
                        <span className="text-slate-300 italic">
                          No response
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
