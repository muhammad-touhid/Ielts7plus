"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const moduleTypes = {
  listening: ["mcq"],
  reading: ["passage", "mcq"],
  writing: ["task"],
  speaking: ["part"],
};

const defaultContent = {
  mcq: { text: "", options: ["", "", "", ""], correctAnswer: "" },
  passage: { title: "", passage: "" },
  task: { label: "", prompt: "", minWords: 150, timeLabel: "" },
  part: { part: "", instruction: "", questions: [""] },
};

export default function MockTestQuestionForm({ question }) {
  const router = useRouter();
  const isEdit = !!question;

  const [module, setModule] = useState(question?.module ?? "listening");
  const [type, setType] = useState(question?.type ?? "mcq");
  const [order, setOrder] = useState(question?.order ?? 0);
  const [published, setPublished] = useState(question?.published ?? false);
  const [content, setContent] = useState(
    question?.content ?? defaultContent["mcq"],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModuleChange = (val) => {
    setModule(val);
    const firstType = moduleTypes[val][0];
    setType(firstType);
    setContent(defaultContent[firstType]);
  };

  const handleTypeChange = (val) => {
    setType(val);
    setContent(defaultContent[val]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEdit
        ? `/api/mock-test-questions/${question.id}`
        : "/api/mock-test-questions";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, type, order, content, published }),
      });

      if (res.ok) {
        router.push("/admin/mock-test-questions");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <i className="ti ti-alert-circle flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Module, Type, Order */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-settings text-blue-600" />
          Question Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module */}
          <div>
            <label className={labelClass}>Module *</label>
            <div className="relative">
              <select
                value={module}
                onChange={(e) => handleModuleChange(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="listening">Listening</option>
                <option value="reading">Reading</option>
                <option value="writing">Writing</option>
                <option value="speaking">Speaking</option>
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className={labelClass}>Type *</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {moduleTypes[module].map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>

          {/* Order */}
          <div>
            <label className={labelClass}>Display Order *</label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className={inputClass}
              placeholder="0 = show first"
            />
          </div>
        </div>
      </div>

      {/* Dynamic content fields */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-edit text-blue-600" />
          Question Content
        </h2>

        {/* MCQ */}
        {type === "mcq" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Question Text *</label>
              <textarea
                required
                rows={3}
                placeholder="Enter the question..."
                value={content.text}
                onChange={(e) =>
                  setContent((c) => ({ ...c, text: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Options *</label>
              <div className="flex flex-col gap-2">
                {content.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${["A", "B", "C", "D"][i]}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...content.options];
                        updated[i] = e.target.value;
                        setContent((c) => ({ ...c, options: updated }));
                      }}
                      className={`${inputClass} flex-1`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Correct Answer *</label>
              <div className="relative">
                <select
                  required
                  value={content.correctAnswer}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, correctAnswer: e.target.value }))
                  }
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">— Select correct answer —</option>
                  {content.options.map(
                    (opt, i) =>
                      opt && (
                        <option key={i} value={opt}>
                          {["A", "B", "C", "D"][i]}: {opt}
                        </option>
                      ),
                  )}
                </select>
                <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Passage */}
        {type === "passage" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Passage Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Emotional Intelligence"
                value={content.title}
                onChange={(e) =>
                  setContent((c) => ({ ...c, title: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Passage Text *</label>
              <textarea
                required
                rows={10}
                placeholder="Enter the full reading passage..."
                value={content.passage}
                onChange={(e) =>
                  setContent((c) => ({ ...c, passage: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Writing Task */}
        {type === "task" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Task Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Task 1"
                  value={content.label}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, label: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Time Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20 minutes recommended"
                  value={content.timeLabel}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, timeLabel: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Minimum Words *</label>
              <input
                type="number"
                required
                min="1"
                value={content.minWords}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    minWords: parseInt(e.target.value),
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Task Prompt *</label>
              <textarea
                required
                rows={6}
                placeholder="Enter the writing task prompt..."
                value={content.prompt}
                onChange={(e) =>
                  setContent((c) => ({ ...c, prompt: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Speaking Part */}
        {type === "part" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Part Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Part 1 — Introduction"
                  value={content.part}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, part: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Instruction *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Answer naturally..."
                  value={content.instruction}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, instruction: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Questions *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      questions: [...c.questions, ""],
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all"
                >
                  <i className="ti ti-plus text-xs" />
                  Add Question
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.questions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 mt-3">
                      {i + 1}
                    </span>
                    <textarea
                      rows={2}
                      required
                      placeholder={`Question ${i + 1}`}
                      value={q}
                      onChange={(e) => {
                        const updated = [...content.questions];
                        updated[i] = e.target.value;
                        setContent((c) => ({ ...c, questions: updated }));
                      }}
                      className={`${inputClass} flex-1 resize-none`}
                    />
                    {content.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            questions: c.questions.filter(
                              (_, idx) => idx !== i,
                            ),
                          }))
                        }
                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all mt-3 flex-shrink-0"
                      >
                        <i className="ti ti-x text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publish + Submit */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative" onClick={() => setPublished((p) => !p)}>
            <div
              className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer ${published ? "bg-blue-600" : "bg-slate-200"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${published ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">
              {published ? "Published" : "Draft"}
            </p>
            <p className="text-xs text-slate-400">
              {published ? "Visible in mock test" : "Hidden from mock test"}
            </p>
          </div>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/mock-test-questions")}
            className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-600 text-sm font-bold px-6 py-3 rounded-xl hover:border-slate-300 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 transition-all duration-200"
          >
            {loading ? (
              <>
                <i className="ti ti-loader-2 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <i className="ti ti-check" />
                {isEdit ? "Update Question" : "Create Question"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
