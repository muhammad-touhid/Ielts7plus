"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const moduleTypes = {
  listening: [
    "mcq",
    "form-completion",
    "sentence-completion",
    "short-answer",
    "matching",
    "map-labelling",
  ],
  reading: ["passage", "mcq"],
  writing: ["task"],
  speaking: ["part"],
};

const typeLabels = {
  mcq: "Multiple Choice (MCQ)",
  "form-completion": "Form / Note / Table Completion",
  "sentence-completion": "Sentence Completion",
  "short-answer": "Short Answer",
  matching: "Matching",
  "map-labelling": "Map / Diagram Labelling",
  passage: "Reading Passage",
  task: "Writing Task",
  part: "Speaking Part",
};

const supportsTestType = ["reading", "writing"];

const defaultContent = {
  mcq: { text: "", options: ["", "", "", ""], correctAnswer: "" },
  "form-completion": { instruction: "", fields: [{ label: "", answer: "" }] },
  "sentence-completion": {
    instruction: "",
    sentences: [{ before: "", after: "", answer: "" }],
  },
  "short-answer": { instruction: "", questions: [{ text: "", answer: "" }] },
  matching: {
    instruction: "",
    items: [{ text: "" }],
    options: [{ label: "A", text: "" }],
    answers: {},
  },
  "map-labelling": {
    instruction: "",
    imageUrl: "",
    labels: [{ number: 1, answer: "" }],
  },
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
  const [testType, setTestType] = useState(question?.testType ?? "both");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModuleChange = (val) => {
    setModule(val);
    const firstType = moduleTypes[val][0];
    setType(firstType);
    setContent(defaultContent[firstType]);
    if (!supportsTestType.includes(val)) setTestType("both");
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
        body: JSON.stringify({
          module,
          type,
          order,
          content,
          published,
          testType,
        }),
      });
      if (res.ok) {
        router.refresh();
        router.push("/admin/mock-test-questions");
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
  const addBtn =
    "inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all";
  const removeBtn =
    "w-7 h-7 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all flex-shrink-0";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <i className="ti ti-alert-circle flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-settings text-blue-600" /> Question Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
          <div>
            <label className={labelClass}>Question Type *</label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {moduleTypes[module].map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t] || t}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>
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

        {/* Test Type for Reading/Writing */}
        {supportsTestType.includes(module) ? (
          <div>
            <label className={labelClass}>Test Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  value: "academic",
                  label: "Academic Only",
                  icon: "ti-school",
                  color: "border-blue-600 bg-blue-50 text-blue-700",
                },
                {
                  value: "general",
                  label: "General Only",
                  icon: "ti-briefcase",
                  color: "border-emerald-600 bg-emerald-50 text-emerald-700",
                },
                {
                  value: "both",
                  label: "Both Types",
                  icon: "ti-circles-relation",
                  color: "border-violet-600 bg-violet-50 text-violet-700",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTestType(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${testType === opt.value ? opt.color : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                >
                  <i className={`ti ${opt.icon} text-xl`} />
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl px-5 py-3 flex items-center gap-3 border border-slate-100">
            <i className="ti ti-info-circle text-slate-400" />
            <p className="text-xs text-slate-500">
              <span className="font-bold capitalize">{module}</span> is the same
              for both test types — shown to all students.
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
        <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
          <i className="ti ti-edit text-blue-600" /> Question Content
          <span className="text-xs font-normal text-slate-400 ml-1">
            — {typeLabels[type]}
          </span>
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
                        const u = [...content.options];
                        u[i] = e.target.value;
                        setContent((c) => ({ ...c, options: u }));
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

        {/* Form Completion */}
        {type === "form-completion" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Complete the form. Write NO MORE THAN TWO WORDS for each answer."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Fields *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      fields: [...c.fields, { label: "", answer: "" }],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Field
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.fields.map((field, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Field Label (shown to student)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Name of hotel:"
                        value={field.label}
                        onChange={(e) => {
                          const u = [...content.fields];
                          u[i] = { ...u[i], label: e.target.value };
                          setContent((c) => ({ ...c, fields: u }));
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-slate-400 mb-1 block">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Grand Plaza"
                          value={field.answer}
                          onChange={(e) => {
                            const u = [...content.fields];
                            u[i] = { ...u[i], answer: e.target.value };
                            setContent((c) => ({ ...c, fields: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                      {content.fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              fields: c.fields.filter((_, idx) => idx !== i),
                            }))
                          }
                          className={`${removeBtn} mt-6`}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sentence Completion */}
        {type === "sentence-completion" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Complete the sentences. Write NO MORE THAN THREE WORDS."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Sentences *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      sentences: [
                        ...c.sentences,
                        { before: "", after: "", answer: "" },
                      ],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Sentence
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.sentences.map((sent, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Sentence {i + 1}
                      </span>
                      {content.sentences.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              sentences: c.sentences.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Before blank
                        </label>
                        <input
                          type="text"
                          placeholder="The train departs at"
                          value={sent.before}
                          onChange={(e) => {
                            const u = [...content.sentences];
                            u[i] = { ...u[i], before: e.target.value };
                            setContent((c) => ({ ...c, sentences: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          After blank (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="in the morning"
                          value={sent.after}
                          onChange={(e) => {
                            const u = [...content.sentences];
                            u[i] = { ...u[i], after: e.target.value };
                            setContent((c) => ({ ...c, sentences: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. nine thirty"
                          value={sent.answer}
                          onChange={(e) => {
                            const u = [...content.sentences];
                            u[i] = { ...u[i], answer: e.target.value };
                            setContent((c) => ({ ...c, sentences: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">
                      Preview: "{sent.before}{" "}
                      <span className="font-bold text-blue-500">___</span>{" "}
                      {sent.after}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Short Answer */}
        {type === "short-answer" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Answer the questions. Write NO MORE THAN TWO WORDS."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Questions *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      questions: [...c.questions, { text: "", answer: "" }],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Question
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 items-start"
                  >
                    <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 mt-3">
                      {i + 1}
                    </span>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Question
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. What time does the library close?"
                          value={q.text}
                          onChange={(e) => {
                            const u = [...content.questions];
                            u[i] = { ...u[i], text: e.target.value };
                            setContent((c) => ({ ...c, questions: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Correct Answer
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 9 pm / nine pm"
                          value={q.answer}
                          onChange={(e) => {
                            const u = [...content.questions];
                            u[i] = { ...u[i], answer: e.target.value };
                            setContent((c) => ({ ...c, questions: u }));
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>
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
                        className={`${removeBtn} mt-3`}
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

        {/* Matching */}
        {type === "matching" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Match each person with the correct statement."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            {/* Options box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Answer Options (the box)</label>
                <button
                  type="button"
                  onClick={() => {
                    const nextLabel = String.fromCharCode(
                      65 + content.options.length,
                    );
                    setContent((c) => ({
                      ...c,
                      options: [...c.options, { label: nextLabel, text: "" }],
                    }));
                  }}
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Option
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                      {opt.label}
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${opt.label} text`}
                      value={opt.text}
                      onChange={(e) => {
                        const u = [...content.options];
                        u[i] = { ...u[i], text: e.target.value };
                        setContent((c) => ({ ...c, options: u }));
                      }}
                      className={`${inputClass} flex-1`}
                    />
                    {content.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            options: c.options.filter((_, idx) => idx !== i),
                          }))
                        }
                        className={removeBtn}
                      >
                        <i className="ti ti-x text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Items to match */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Items to Match</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      items: [...c.items, { text: "" }],
                      answers: { ...c.answers, [c.items.length]: "" },
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Item
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-500 flex-shrink-0 w-6">
                      {i + 1}.
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. John"
                      value={item.text}
                      onChange={(e) => {
                        const u = [...content.items];
                        u[i] = { text: e.target.value };
                        setContent((c) => ({ ...c, items: u }));
                      }}
                      className={`${inputClass} flex-1`}
                    />
                    <div className="relative w-28 flex-shrink-0">
                      <select
                        value={content.answers[i] || ""}
                        onChange={(e) =>
                          setContent((c) => ({
                            ...c,
                            answers: { ...c.answers, [i]: e.target.value },
                          }))
                        }
                        className={`${inputClass} appearance-none cursor-pointer text-xs`}
                      >
                        <option value="">Answer</option>
                        {content.options.map((opt) => (
                          <option key={opt.label} value={opt.label}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                    </div>
                    {content.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = content.items.filter(
                            (_, idx) => idx !== i,
                          );
                          const newAnswers = {};
                          newItems.forEach((_, idx) => {
                            newAnswers[idx] =
                              content.answers[idx >= i ? idx + 1 : idx] || "";
                          });
                          setContent((c) => ({
                            ...c,
                            items: newItems,
                            answers: newAnswers,
                          }));
                        }}
                        className={removeBtn}
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

        {/* Map Labelling */}
        {type === "map-labelling" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Label the map. Write NO MORE THAN TWO WORDS."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Map / Diagram Image URL</label>
              <input
                type="text"
                placeholder="https://... (upload image and paste URL)"
                value={content.imageUrl}
                onChange={(e) =>
                  setContent((c) => ({ ...c, imageUrl: e.target.value }))
                }
                className={inputClass}
              />
              {content.imageUrl && (
                <img
                  src={content.imageUrl}
                  alt="Map preview"
                  className="mt-2 rounded-xl border border-slate-200 max-h-48 object-contain"
                />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Labels *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      labels: [
                        ...c.labels,
                        { number: c.labels.length + 1, answer: "" },
                      ],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Label
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {content.labels.map((label, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                      {label.number}
                    </span>
                    <input
                      type="text"
                      placeholder="Correct answer for this label"
                      value={label.answer}
                      onChange={(e) => {
                        const u = [...content.labels];
                        u[i] = { ...u[i], answer: e.target.value };
                        setContent((c) => ({ ...c, labels: u }));
                      }}
                      className={`${inputClass} flex-1`}
                    />
                    {content.labels.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            labels: c.labels.filter((_, idx) => idx !== i),
                          }))
                        }
                        className={removeBtn}
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

        {/* Reading Passage */}
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
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Question
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
                        const u = [...content.questions];
                        u[i] = e.target.value;
                        setContent((c) => ({ ...c, questions: u }));
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
                        className={`${removeBtn} mt-3`}
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
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 transition-all duration-200 cursor-pointer"
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
