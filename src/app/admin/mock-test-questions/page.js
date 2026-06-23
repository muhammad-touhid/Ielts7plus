import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteQuestionButton from "./DeleteQuestionButton";

const moduleColors = {
  listening: "bg-sky-100 text-sky-600",
  reading: "bg-indigo-100 text-indigo-600",
  writing: "bg-emerald-100 text-emerald-600",
  speaking: "bg-amber-100 text-amber-600",
};

const typeColors = {
  mcq: "bg-blue-50 text-blue-600",
  passage: "bg-violet-50 text-violet-600",
  task: "bg-rose-50 text-rose-600",
  part: "bg-orange-50 text-orange-600",
};

export default async function AdminMockTestQuestionsPage() {
  const questions = await prisma.mockTestQuestion.findMany({
    orderBy: [{ module: "asc" }, { order: "asc" }],
  });

  const modules = ["listening", "reading", "writing", "speaking"];
  const counts = modules.reduce((acc, m) => {
    acc[m] = questions.filter((q) => q.module === m).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Mock Test Questions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage questions for all four modules.
          </p>
        </div>
        <Link
          href="/admin/mock-test-questions/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          <i className="ti ti-plus text-base" />
          Add New Question
        </Link>
      </div>

      {/* Module stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((m) => (
          <div
            key={m}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${moduleColors[m]}`}
            >
              <i
                className={`ti ${m === "listening" ? "ti-headphones" : m === "reading" ? "ti-book" : m === "writing" ? "ti-pencil" : "ti-microphone"}`}
              />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">
                {counts[m]}
              </p>
              <p className="text-xs text-slate-400 capitalize">{m}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Questions by module */}
      {modules.map((m) => {
        const moduleQuestions = questions.filter((q) => q.module === m);
        if (moduleQuestions.length === 0) return null;
        return (
          <div
            key={m}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Module header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${moduleColors[m]}`}
                >
                  {m}
                </span>
                <span className="text-xs text-slate-400">
                  {moduleQuestions.length} questions
                </span>
              </div>
            </div>

            {/* Questions table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moduleQuestions.map((q) => {
                    const content = q.content;
                    const preview =
                      q.type === "mcq"
                        ? content.text
                        : q.type === "passage"
                          ? content.title
                          : q.type === "task"
                            ? content.label
                            : content.part;

                    return (
                      <tr
                        key={q.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {q.order}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${typeColors[q.type]}`}
                          >
                            {q.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 max-w-md truncate">
                            {preview}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${q.published ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                          >
                            {q.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/mock-test-questions/${q.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                            >
                              <i className="ti ti-edit text-sm" />
                              Edit
                            </Link>
                            <DeleteQuestionButton id={q.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {questions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
            <i className="ti ti-help-circle" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">
            No questions yet
          </p>
          <p className="text-xs text-slate-400 mb-5">
            Add your first mock test question.
          </p>
          <Link
            href="/admin/mock-test-questions/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            <i className="ti ti-plus" />
            Add Question
          </Link>
        </div>
      )}
    </div>
  );
}
