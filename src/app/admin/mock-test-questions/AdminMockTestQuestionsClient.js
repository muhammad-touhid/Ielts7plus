"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteQuestionButton from "./DeleteQuestionButton";

const moduleConfig = {
  listening: {
    icon: "ti ti-headphones",
    color: "text-sky-600",
    bg: "bg-sky-50",
    activeBg: "bg-sky-500",
    border: "border-sky-500",
  },
  reading: {
    icon: "ti ti-book",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    activeBg: "bg-indigo-500",
    border: "border-indigo-500",
  },
  writing: {
    icon: "ti ti-pencil",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    activeBg: "bg-emerald-500",
    border: "border-emerald-500",
  },
  speaking: {
    icon: "ti ti-microphone",
    color: "text-amber-600",
    bg: "bg-amber-50",
    activeBg: "bg-amber-500",
    border: "border-amber-500",
  },
};

const typeColors = {
  mcq: "bg-blue-50 text-blue-600",
  passage: "bg-violet-50 text-violet-600",
  task: "bg-rose-50 text-rose-600",
  part: "bg-orange-50 text-orange-600",
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function AdminMockTestQuestionsClient({ questions }) {
  const modules = ["listening", "reading", "writing", "speaking"];

  const [activeModule, setActiveModule] = useState("listening");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Count per module
  const counts = modules.reduce((acc, m) => {
    acc[m] = questions.filter((q) => q.module === m).length;
    return acc;
  }, {});

  // Filter by module + search
  const filtered = questions.filter((q) => {
    const matchModule = q.module === activeModule;
    const content = q.content;
    const searchText =
      q.type === "mcq"
        ? content.text
        : q.type === "passage"
          ? content.title
          : q.type === "task"
            ? content.label
            : content.part;
    const matchSearch = searchText
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchModule && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page when module or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeModule, search]);

  const handleModuleSelect = (m) => {
    setActiveModule(m);
    setSearch("");
  };

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

      {/* Module Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modules.map((m) => {
          const cfg = moduleConfig[m];
          const isActive = activeModule === m;
          return (
            <button
              key={m}
              onClick={() => handleModuleSelect(m)}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5
                ${
                  isActive
                    ? `${cfg.border} bg-white shadow-lg`
                    : "border-slate-100 bg-white hover:border-slate-200 shadow-sm"
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200
                ${isActive ? `${cfg.activeBg} text-white` : `${cfg.bg} ${cfg.color}`}`}
              >
                <i className={cfg.icon} />
              </div>
              <div>
                <p
                  className={`text-2xl font-extrabold transition-colors ${isActive ? cfg.color : "text-slate-800"}`}
                >
                  {counts[m]}
                </p>
                <p className="text-xs text-slate-400 capitalize">{m}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table header with search + per page */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize
              ${moduleConfig[activeModule].bg} ${moduleConfig[activeModule].color}`}
            >
              {activeModule}
            </span>
            <span className="text-xs text-slate-400">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""}
              {search && ` matching "${search}"`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs placeholder-slate-400 pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all w-48"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="ti ti-x text-xs" />
                </button>
              )}
            </div>

            {/* Per page */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 text-slate-700 text-xs pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} per page
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        {paginated.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
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
                {paginated.map((q) => {
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
        ) : (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-search-off" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              {search
                ? "No questions match your search"
                : `No ${activeModule} questions yet`}
            </p>
            <p className="text-xs text-slate-400 mb-5">
              {search
                ? "Try a different keyword."
                : "Add your first question for this module."}
            </p>
            {!search && (
              <Link
                href="/admin/mock-test-questions/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
              >
                <i className="ti ti-plus" />
                Add Question
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-600">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-600">
                {Math.min(currentPage * itemsPerPage, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-600">
                {filtered.length}
              </span>{" "}
              questions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <i className="ti ti-chevron-left text-sm" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                      ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <i className="ti ti-chevron-right text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
