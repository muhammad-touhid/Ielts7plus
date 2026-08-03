"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ImageUpload from "../ImageUpload";
import AudioUpload from "../AudioUpload";
import { QuillEditor } from "@/components/QuillEditor";

const moduleTypes = {
  listening: [
    "mcq",
    "multi-select",
    "form-completion",
    "table-completion",
    "sentence-completion",
    "short-answer",
    "matching",
    "map-labelling",
  ],
  reading: [
    "passage",
    "mcq",
    "multi-select",
    "short-answer",
    "form-completion",
    "true-false-ng",
    "yes-no-ng",
    "matching-headings",
    "matching-information",
    "matching-features",
    "summary-completion",
  ],
  writing: ["task"],
  speaking: ["part"],
};

const typeLabels = {
  mcq: "Multiple Choice (MCQ)",
  "multi-select": "Multiple Choice — Choose Multiple",
  "form-completion": "Form / Note Completion",
  "table-completion": "Table Completion",
  "sentence-completion": "Sentence Completion",
  "short-answer": "Short Answer",
  matching: "Matching",
  "map-labelling": "Map / Diagram Labelling",
  passage: "Reading Passage",
  "true-false-ng": "True / False / Not Given",
  "yes-no-ng": "Yes / No / Not Given",
  "matching-headings": "Matching Headings",
  "matching-information": "Matching Information",
  "matching-features": "Matching Features",
  "summary-completion": "Summary / Sentence Completion",
  "text-block": "Custom Text Block",
  task: "Writing Task",
  part: "Speaking Part",
};

const supportsTestType = ["reading", "writing"];
const supportsSection = ["listening", "reading"];
const SECTION_COUNT = { listening: 4, reading: 3 };
const SECTION_LABEL = {
  listening: "Listening Section",
  reading: "Reading Passage",
};

const defaultContent = {
  mcq: { text: "", options: ["", "", "", ""], correctAnswer: "" },
  "multi-select": {
    instruction: "",
    questionText: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
      { label: "E", text: "" },
    ],
    correctAnswers: [],
    selectCount: 2,
  },
  "form-completion": {
    instruction: "",
    noteTitle: "",
    fields: [
      {
        kind: "label",
        label: "",
        text: "",
        answer: "",
        answers: [],
        isExample: false,
        sectionBreakBefore: "",
      },
    ],
  },
  "table-completion": {
    instruction: "",
    tableTitle: "",
    columns: ["", ""],
    rows: [
      {
        cells: [
          { text: "", answers: [] },
          { text: "", answers: [] },
        ],
      },
    ],
  },
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
  "true-false-ng": {
    instruction: "",
    statements: [{ text: "", answer: "TRUE" }],
  },
  "yes-no-ng": { instruction: "", statements: [{ text: "", answer: "YES" }] },
  "matching-headings": {
    instruction: "",
    headings: [{ label: "i", text: "" }],
    paragraphs: [{ label: "A", answer: "" }],
  },
  "matching-information": {
    instruction: "",
    options: [{ label: "A", text: "" }],
    items: [{ text: "" }],
    answers: {},
  },
  "matching-features": {
    instruction: "",
    options: [{ label: "A", text: "" }],
    items: [{ text: "" }],
    answers: {},
  },
  "summary-completion": {
    instruction: "",
    wordBank: [],
    sentences: [{ before: "", after: "", answer: "" }],
  },
  "text-block": { text: "", tag: "h3", align: "left" },
  task: {
    taskNumber: 1,
    visualType: "",
    letterType: "",
    essayType: "",
    imageUrl: "",
    bulletPoints: [],
    prompt: "",
    minWords: 150,
    timeLabel: "20 minutes",
  },
  part: {
    part: "",
    instruction: "",
    format: "qa", // "qa" | "cue-card"
    questions: [{ text: "", audioUrl: "" }],
    cueCardTopic: "",
    cueCardNotes: [],
    prepSeconds: 60,
    speakSeconds: 120,
  },
};

export default function MockTestQuestionForm({ question }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!question;

  const initialModule =
    question?.module ?? searchParams.get("module") ?? "listening";
  const [module, setModule] = useState(initialModule);
  const [type, setType] = useState(
    question?.type ?? moduleTypes[initialModule][0],
  );
  // Order is no longer a manual field — new questions land at the end of the
  // list (a large number sorts after existing sequential 0,1,2... values)
  // and get dragged into position from the admin list. Edits keep their
  // existing order untouched. 1,000,000 comfortably fits in Postgres's Int
  // column (max ~2.14 billion) while still sorting after any realistic
  // number of existing questions.
  const [order] = useState(question?.order ?? 1000000);
  const [published, setPublished] = useState(question?.published ?? false);
  const [content, setContent] = useState(
    question?.content ?? defaultContent[moduleTypes[initialModule][0]],
  );
  const [testType, setTestType] = useState(question?.testType ?? "both");
  const [section, setSection] = useState(question?.section ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleModuleChange = (val) => {
    setModule(val);
    const firstType = moduleTypes[val][0];
    setType(firstType);
    setContent(defaultContent[firstType]);
    if (!supportsTestType.includes(val)) setTestType("both");
    if (!supportsSection.includes(val)) setSection(1);
  };

  const handleTypeChange = (val) => {
    setType(val);
    setContent(defaultContent[val]);
  };

  // --- Table Completion helpers ---
  const addColumn = () => {
    setContent((c) => ({
      ...c,
      columns: [...c.columns, ""],
      rows: c.rows.map((r) => ({
        cells: [...r.cells, { text: "", answers: [] }],
      })),
    }));
  };
  const removeColumn = (colIdx) => {
    setContent((c) => ({
      ...c,
      columns: c.columns.filter((_, i) => i !== colIdx),
      rows: c.rows.map((r) => ({
        cells: r.cells.filter((_, i) => i !== colIdx),
      })),
    }));
  };
  const addTableRow = () => {
    setContent((c) => ({
      ...c,
      rows: [
        ...c.rows,
        { cells: c.columns.map(() => ({ text: "", answers: [] })) },
      ],
    }));
  };
  const removeTableRow = (rowIdx) => {
    setContent((c) => ({
      ...c,
      rows: c.rows.filter((_, i) => i !== rowIdx),
    }));
  };
  const updateCellText = (rowIdx, colIdx, text) => {
    const blankCount = (text.match(/___/g) || []).length;
    setContent((c) => {
      const rows = [...c.rows];
      const cells = [...rows[rowIdx].cells];
      const prevAnswers = cells[colIdx].answers || [];
      const answers = Array.from(
        { length: blankCount },
        (_, i) => prevAnswers[i] || "",
      );
      cells[colIdx] = { text, answers };
      rows[rowIdx] = { cells };
      return { ...c, rows };
    });
  };
  const updateCellAnswer = (rowIdx, colIdx, blankIdx, value) => {
    setContent((c) => {
      const rows = [...c.rows];
      const cells = [...rows[rowIdx].cells];
      const answers = [...(cells[colIdx].answers || [])];
      answers[blankIdx] = value;
      cells[colIdx] = { ...cells[colIdx], answers };
      rows[rowIdx] = { cells };
      return { ...c, rows };
    });
  };

  // --- Form/Note Completion bullet-point field helpers ---
  const updateBulletFieldText = (fieldIdx, text) => {
    const blankCount = (text.match(/___/g) || []).length;
    setContent((c) => {
      const fields = [...c.fields];
      const prevAnswers = fields[fieldIdx].answers || [];
      const answers = Array.from(
        { length: blankCount },
        (_, i) => prevAnswers[i] || "",
      );
      fields[fieldIdx] = { ...fields[fieldIdx], text, answers };
      return { ...c, fields };
    });
  };
  const updateBulletFieldAnswer = (fieldIdx, blankIdx, value) => {
    setContent((c) => {
      const fields = [...c.fields];
      const answers = [...(fields[fieldIdx].answers || [])];
      answers[blankIdx] = value;
      fields[fieldIdx] = { ...fields[fieldIdx], answers };
      return { ...c, fields };
    });
  };
  const setFieldKind = (fieldIdx, kind) => {
    setContent((c) => {
      const fields = [...c.fields];
      fields[fieldIdx] = {
        ...fields[fieldIdx],
        kind,
        // reset the fields specific to the kind being switched away from
        ...(kind === "label"
          ? { text: "", answers: [] }
          : { label: "", answer: "" }),
      };
      return { ...c, fields };
    });
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
          content: content,
          published,
          testType,
          section: supportsSection.includes(module) ? section : 1,
        }),
      });
      if (res.ok) {
        router.refresh();
        router.push(`/admin/mock-test-questions?module=${module}`);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                {[
                  ...moduleTypes[module],
                  ...(isEdit && !moduleTypes[module].includes(type)
                    ? [type]
                    : []),
                ].map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t] || t}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 -mt-2">
          Order is set by dragging in the question list — new items land at the
          end, ready to be dragged into position.
        </p>

        {/* Section selector — listening (4) or reading (3) */}
        {supportsSection.includes(module) && (
          <div>
            <label className={labelClass}>{SECTION_LABEL[module]} *</label>
            <div
              className={`grid gap-3 ${SECTION_COUNT[module] === 3 ? "grid-cols-3" : "grid-cols-4"}`}
            >
              {Array.from(
                { length: SECTION_COUNT[module] },
                (_, i) => i + 1,
              ).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSection(num)}
                  className={`flex flex-col items-center gap-1 p-3.5 rounded-xl border-2 transition-all text-center ${
                    section === num
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <i
                    className={`ti ${module === "listening" ? "ti-headphones" : "ti-book"} text-lg`}
                  />
                  <span className="text-xs font-bold">
                    {module === "listening" ? "Section" : "Passage"} {num}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {module === "listening"
                ? "Determines which of the 4 listening sections this question appears in, and its question numbering."
                : 'Determines which of the 3 reading passages this question belongs to. Use type "Reading Passage" once per passage for the passage text itself.'}
            </p>
          </div>
        )}

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
              ]
                .filter(
                  (opt) =>
                    !(
                      module === "writing" &&
                      content.taskNumber === 1 &&
                      opt.value === "both"
                    ),
                )
                .map((opt) => (
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
            {module === "writing" && content.taskNumber === 1 && (
              <p className="text-xs text-slate-400 mt-2">
                Task 1 must be Academic or General specifically — Academic
                describes a chart/graph, General writes a letter, so they can't
                share one entry.
              </p>
            )}
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

        <div className="w-full h-px bg-slate-100" />

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
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Options *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      options: [...c.options, ""],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Option
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                        {letter}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${letter}`}
                        value={opt}
                        onChange={(e) => {
                          const u = [...content.options];
                          u[i] = e.target.value;
                          setContent((c) => ({ ...c, options: u }));
                        }}
                        className={`${inputClass} flex-1`}
                      />
                      {content.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            const removedValue = content.options[i];
                            const u = content.options.filter(
                              (_, idx) => idx !== i,
                            );
                            setContent((c) => ({
                              ...c,
                              options: u,
                              correctAnswer:
                                c.correctAnswer === removedValue
                                  ? ""
                                  : c.correctAnswer,
                            }));
                          }}
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Minimum 2 options — add as many as you need, no fixed count.
              </p>
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
                          {String.fromCharCode(65 + i)}: {opt}
                        </option>
                      ),
                  )}
                </select>
                <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Multi-Select MCQ — "Choose TWO/THREE letters" */}
        {type === "multi-select" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Choose TWO letters, A-E."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Question Text *</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Which TWO features had the greatest impact on the students?"
                value={content.questionText}
                onChange={(e) =>
                  setContent((c) => ({ ...c, questionText: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Number of Correct Answers *</label>
              <input
                type="number"
                min={2}
                max={content.options.length}
                value={content.selectCount}
                onChange={(e) => {
                  const val = Math.max(2, parseInt(e.target.value) || 2);
                  setContent((c) => ({
                    ...c,
                    selectCount: val,
                    correctAnswers: c.correctAnswers.slice(0, val),
                  }));
                }}
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                How many letters students must choose — e.g. "TWO" = 2. This
                also determines how many question numbers this block uses (e.g.
                selecting 2 shows as "Questions 21 and 22").
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Options *</label>
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
                {content.options.map((opt, i) => {
                  const isMarkedCorrect = content.correctAnswers.includes(
                    opt.label,
                  );
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => {
                            let correctAnswers;
                            if (c.correctAnswers.includes(opt.label)) {
                              correctAnswers = c.correctAnswers.filter(
                                (l) => l !== opt.label,
                              );
                            } else if (
                              c.correctAnswers.length < c.selectCount
                            ) {
                              correctAnswers = [...c.correctAnswers, opt.label];
                            } else {
                              correctAnswers = c.correctAnswers;
                            }
                            return { ...c, correctAnswers };
                          })
                        }
                        title="Mark as correct"
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-all ${
                          isMarkedCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                            : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {isMarkedCorrect ? (
                          <i className="ti ti-check text-sm" />
                        ) : (
                          opt.label
                        )}
                      </button>
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
                      {content.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              options: c.options.filter((_, idx) => idx !== i),
                              correctAnswers: c.correctAnswers.filter(
                                (l) => l !== opt.label,
                              ),
                            }))
                          }
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Click a letter badge to mark/unmark it as correct — marked:{" "}
                <span
                  className={
                    content.correctAnswers.length === content.selectCount
                      ? "font-bold text-emerald-600"
                      : "font-bold text-amber-600"
                  }
                >
                  {content.correctAnswers.length}/{content.selectCount}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Custom Text Block — a standalone heading/paragraph placed between
            questions via its own Order number, not tied to any question */}
        {type === "text-block" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Text *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Questions 1–6, or any note/instruction you want shown between questions."
                value={content.text}
                onChange={(e) =>
                  setContent((c) => ({ ...c, text: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Style</label>
                <div className="relative">
                  <select
                    value={content.tag}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, tag: e.target.value }))
                    }
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="h2">Heading 2 (largest)</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6 (smallest heading)</option>
                    <option value="p">Paragraph (plain text)</option>
                  </select>
                  <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "left", icon: "ti-align-left" },
                    { value: "center", icon: "ti-align-center" },
                    { value: "right", icon: "ti-align-right" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setContent((c) => ({ ...c, align: opt.value }))
                      }
                      className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all ${
                        content.align === opt.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <i className={`ti ${opt.icon} text-lg`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl px-5 py-3 flex items-center gap-3 border border-slate-100">
              <i className="ti ti-info-circle text-slate-400" />
              <p className="text-xs text-slate-500">
                This won't be scored or numbered — it just displays at the point
                in the sequence set by its <strong>Order</strong> value above,
                within the chosen Section.
              </p>
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
                placeholder="e.g. Complete the notes. Write NO MORE THAN THREE WORDS OR A NUMBER for each answer."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Note Title (optional)</label>
              <input
                type="text"
                placeholder="e.g. School Excursion"
                value={content.noteTitle || ""}
                onChange={(e) =>
                  setContent((c) => ({ ...c, noteTitle: e.target.value }))
                }
                className={inputClass}
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Shown as a centered heading inside the note box, above the
                fields — e.g. the title of a form or set of notes.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Fields *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      fields: [
                        ...c.fields,
                        {
                          kind: "label",
                          label: "",
                          text: "",
                          answer: "",
                          answers: [],
                          isExample: false,
                          sectionBreakBefore: "",
                        },
                      ],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Field
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.fields.map((field, i) => {
                  const kind = field.kind || "label";
                  return (
                    <div
                      key={i}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="grid grid-cols-2 gap-1.5 bg-white rounded-lg border border-slate-200 p-1">
                          <button
                            type="button"
                            onClick={() => setFieldKind(i, "label")}
                            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                              kind === "label"
                                ? "bg-blue-600 text-white"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            Label: Value
                          </button>
                          <button
                            type="button"
                            onClick={() => setFieldKind(i, "bullet")}
                            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${
                              kind === "bullet"
                                ? "bg-blue-600 text-white"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            Bullet Point
                          </button>
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
                            className={removeBtn}
                          >
                            <i className="ti ti-x text-xs" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Sub-heading before this field (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Activities Planned"
                          value={field.sectionBreakBefore || ""}
                          onChange={(e) => {
                            const u = [...content.fields];
                            u[i] = {
                              ...u[i],
                              sectionBreakBefore: e.target.value,
                            };
                            setContent((c) => ({ ...c, fields: u }));
                          }}
                          className={inputClass}
                        />
                      </div>

                      {kind === "label" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">
                              Field Label (shown to student)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Destination"
                              value={field.label}
                              onChange={(e) => {
                                const u = [...content.fields];
                                u[i] = { ...u[i], label: e.target.value };
                                setContent((c) => ({ ...c, fields: u }));
                              }}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 mb-1 block">
                              {field.isExample
                                ? "Example Answer (shown to student)"
                                : "Correct Answer"}
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Wednesday"
                              value={field.answer}
                              onChange={(e) => {
                                const u = [...content.fields];
                                u[i] = { ...u[i], answer: e.target.value };
                                setContent((c) => ({ ...c, fields: u }));
                              }}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">
                            Bullet Text — type{" "}
                            <code className="bg-slate-100 px-1 rounded">
                              ___
                            </code>{" "}
                            (three underscores) wherever a blank goes
                          </label>
                          <textarea
                            rows={2}
                            placeholder="e.g. Bring suitable clothing, a ___ and toiletries."
                            value={field.text || ""}
                            onChange={(e) =>
                              updateBulletFieldText(i, e.target.value)
                            }
                            className={`${inputClass} resize-none`}
                          />
                          {(field.answers || []).length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-2">
                              {field.answers.map((a, bi) => (
                                <input
                                  key={bi}
                                  type="text"
                                  placeholder={`Answer for blank ${bi + 1}`}
                                  value={a}
                                  onChange={(e) =>
                                    updateBulletFieldAnswer(
                                      i,
                                      bi,
                                      e.target.value,
                                    )
                                  }
                                  className="bg-white text-slate-700 text-xs px-3 py-2 rounded-lg border border-blue-200 outline-none focus:border-blue-400"
                                />
                              ))}
                            </div>
                          )}
                          {(field.answers || []).length === 0 && (
                            <p className="text-xs text-slate-400 mt-1.5">
                              No{" "}
                              <code className="bg-slate-100 px-1 rounded">
                                ___
                              </code>{" "}
                              detected yet — this will show as a plain
                              informational bullet with no blank.
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const u = [...content.fields];
                          u[i] = { ...u[i], isExample: !u[i].isExample };
                          setContent((c) => ({ ...c, fields: u }));
                        }}
                        className={`self-start flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-all ${
                          field.isExample
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <i
                          className={`ti ${field.isExample ? "ti-check" : "ti-plus"} text-xs`}
                        />
                        Mark as Example (shown filled-in, not scored, no number)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table Completion */}
        {type === "table-completion" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="e.g. Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Table Title (optional)</label>
              <input
                type="text"
                placeholder="e.g. Oyster Bay Sailing Club Courses"
                value={content.tableTitle || ""}
                onChange={(e) =>
                  setContent((c) => ({ ...c, tableTitle: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Columns</label>
                <button type="button" onClick={addColumn} className={addBtn}>
                  <i className="ti ti-plus text-xs" /> Add Column
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {content.columns.map((col, ci) => (
                  <div key={ci} className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder={`Column ${ci + 1} header`}
                      value={col}
                      onChange={(e) => {
                        const u = [...content.columns];
                        u[ci] = e.target.value;
                        setContent((c) => ({ ...c, columns: u }));
                      }}
                      className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-400 w-36"
                    />
                    {content.columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(ci)}
                        className={removeBtn}
                      >
                        <i className="ti ti-x text-xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Rows *</label>
                <button type="button" onClick={addTableRow} className={addBtn}>
                  <i className="ti ti-plus text-xs" /> Add Row
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Type <code className="bg-slate-100 px-1 rounded">___</code>{" "}
                (three underscores) anywhere in a cell to mark a blank —
                matching answer boxes appear automatically, in order, for each
                one you type.
              </p>
              <div className="flex flex-col gap-3">
                {content.rows.map((row, ri) => (
                  <div
                    key={ri}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Row {ri + 1}
                      </span>
                      {content.rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTableRow(ri)}
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      )}
                    </div>
                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${content.columns.length}, minmax(0,1fr))`,
                      }}
                    >
                      {row.cells.map((cell, ci) => (
                        <div key={ci} className="flex flex-col gap-1">
                          <label className="text-xs text-slate-400 truncate">
                            {content.columns[ci] || `Column ${ci + 1}`}
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Cell text, use ___ for a blank"
                            value={cell.text}
                            onChange={(e) =>
                              updateCellText(ri, ci, e.target.value)
                            }
                            className={`${inputClass} resize-none text-xs`}
                          />
                          {cell.answers.length > 0 && (
                            <div className="flex flex-col gap-1">
                              {cell.answers.map((a, bi) => (
                                <input
                                  key={bi}
                                  type="text"
                                  placeholder={`Answer for blank ${bi + 1}`}
                                  value={a}
                                  onChange={(e) =>
                                    updateCellAnswer(ri, ci, bi, e.target.value)
                                  }
                                  className="bg-white text-slate-700 text-xs px-2 py-1.5 rounded-lg border border-blue-200 outline-none focus:border-blue-400"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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

        {/* True / False / Not Given */}
        {type === "true-false-ng" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="Do the following statements agree with the information given in the passage?"
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Statements *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      statements: [
                        ...c.statements,
                        { text: "", answer: "TRUE" },
                      ],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Statement
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.statements.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Statement {i + 1}
                      </span>
                      {content.statements.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              statements: c.statements.filter(
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
                    <textarea
                      rows={2}
                      placeholder="Statement text..."
                      value={s.text}
                      onChange={(e) => {
                        const u = [...content.statements];
                        u[i] = { ...u[i], text: e.target.value };
                        setContent((c) => ({ ...c, statements: u }));
                      }}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const u = [...content.statements];
                            u[i] = { ...u[i], answer: opt };
                            setContent((c) => ({ ...c, statements: u }));
                          }}
                          className={`text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${s.answer === opt ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Yes / No / Not Given */}
        {type === "yes-no-ng" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="Do the following statements agree with the claims of the writer?"
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Statements *</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({
                      ...c,
                      statements: [
                        ...c.statements,
                        { text: "", answer: "YES" },
                      ],
                    }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Statement
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {content.statements.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Statement {i + 1}
                      </span>
                      {content.statements.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              statements: c.statements.filter(
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
                    <textarea
                      rows={2}
                      placeholder="Statement text..."
                      value={s.text}
                      onChange={(e) => {
                        const u = [...content.statements];
                        u[i] = { ...u[i], text: e.target.value };
                        setContent((c) => ({ ...c, statements: u }));
                      }}
                      className={`${inputClass} resize-none`}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {["YES", "NO", "NOT GIVEN"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            const u = [...content.statements];
                            u[i] = { ...u[i], answer: opt };
                            setContent((c) => ({ ...c, statements: u }));
                          }}
                          className={`text-xs font-bold px-3 py-2 rounded-lg border-2 transition-all ${s.answer === opt ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matching Headings */}
        {type === "matching-headings" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="Choose the correct heading for each paragraph from the list of headings below."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>List of Headings</label>
                <button
                  type="button"
                  onClick={() => {
                    const romanNumerals = [
                      "i",
                      "ii",
                      "iii",
                      "iv",
                      "v",
                      "vi",
                      "vii",
                      "viii",
                      "ix",
                      "x",
                      "xi",
                      "xii",
                    ];
                    const nextLabel =
                      romanNumerals[content.headings.length] ||
                      `h${content.headings.length + 1}`;
                    setContent((c) => ({
                      ...c,
                      headings: [...c.headings, { label: nextLabel, text: "" }],
                    }));
                  }}
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Heading
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.headings.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="min-w-9 h-7 px-2 rounded-lg bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                      {h.label}
                    </span>
                    <input
                      type="text"
                      placeholder="Heading text"
                      value={h.text}
                      onChange={(e) => {
                        const u = [...content.headings];
                        u[i] = { ...u[i], text: e.target.value };
                        setContent((c) => ({ ...c, headings: u }));
                      }}
                      className={`${inputClass} flex-1`}
                    />
                    {content.headings.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            headings: c.headings.filter((_, idx) => idx !== i),
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>
                  Paragraphs (correct heading for each)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const nextLabel = String.fromCharCode(
                      65 + content.paragraphs.length,
                    );
                    setContent((c) => ({
                      ...c,
                      paragraphs: [
                        ...c.paragraphs,
                        { label: nextLabel, answer: "" },
                      ],
                    }));
                  }}
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Paragraph
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {content.paragraphs.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-600 flex-shrink-0 w-20">
                      Paragraph {p.label}
                    </span>
                    <div className="relative flex-1">
                      <select
                        value={p.answer}
                        onChange={(e) => {
                          const u = [...content.paragraphs];
                          u[i] = { ...u[i], answer: e.target.value };
                          setContent((c) => ({ ...c, paragraphs: u }));
                        }}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">— Select correct heading —</option>
                        {content.headings.map(
                          (h) =>
                            h.text && (
                              <option key={h.label} value={h.label}>
                                {h.label}: {h.text}
                              </option>
                            ),
                        )}
                      </select>
                      <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                    </div>
                    {content.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setContent((c) => ({
                            ...c,
                            paragraphs: c.paragraphs.filter(
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Matching Information / Matching Features — identical shape, different framing */}
        {(type === "matching-information" || type === "matching-features") && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder={
                  type === "matching-information"
                    ? "Which paragraph contains the following information?"
                    : "Match each statement with the correct person / theory / feature."
                }
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>
                  {type === "matching-information"
                    ? "Paragraph Options (A, B, C...)"
                    : "Answer Options"}
                </label>
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
                      placeholder="Statement / item text"
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

        {/* Summary / Sentence Completion */}
        {type === "summary-completion" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Instruction</label>
              <input
                type="text"
                placeholder="Complete the summary using the list of words below."
                value={content.instruction}
                onChange={(e) =>
                  setContent((c) => ({ ...c, instruction: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Word Bank (optional)</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({ ...c, wordBank: [...c.wordBank, ""] }))
                  }
                  className={addBtn}
                >
                  <i className="ti ti-plus text-xs" /> Add Word
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.wordBank.map((w, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="word/phrase"
                      value={w}
                      onChange={(e) => {
                        const u = [...content.wordBank];
                        u[i] = e.target.value;
                        setContent((c) => ({ ...c, wordBank: u }));
                      }}
                      className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-400 w-32"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          wordBank: c.wordBank.filter((_, idx) => idx !== i),
                        }))
                      }
                      className={removeBtn}
                    >
                      <i className="ti ti-x text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Summary Segments *</label>
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
                  <i className="ti ti-plus text-xs" /> Add Blank
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Each row is one blank in the flowing summary. "Before" and
                "after" text join together in reading order to form one
                continuous paragraph on the student's screen.
              </p>
              <div className="flex flex-col gap-3">
                {content.sentences.map((sent, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        Blank {i + 1}
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
                          Text before blank
                        </label>
                        <input
                          type="text"
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
                          Text after blank (optional)
                        </label>
                        <input
                          type="text"
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
              <label className={labelClass}>Passage Title (Optional)</label>
              <input
                type="text"
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
              <QuillEditor
                value={content.passage}
                onChange={(value) =>
                  setContent((c) => ({
                    ...c,
                    passage: value,
                  }))
                }
                placeholder="Write your passage here..."
              />
            </div>
          </div>
        )}

        {/* Writing Task */}
        {type === "task" && (
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Task Number *</label>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setContent((c) => ({
                        ...c,
                        taskNumber: num,
                        minWords: num === 1 ? 150 : 250,
                        timeLabel: num === 1 ? "20 minutes" : "40 minutes",
                        // reset type-specific fields when switching task number
                        visualType: "",
                        letterType: "",
                        essayType: "",
                        imageUrl: "",
                        bulletPoints: [],
                      }));
                      // Task 1 can't be "both" — Academic (chart) and
                      // General (letter) are structurally different
                      if (num === 1 && testType === "both") {
                        setTestType("academic");
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all text-center ${
                      content.taskNumber === num
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm font-extrabold">Task {num}</span>
                    <span className="text-xs text-slate-400">
                      {num === 1
                        ? "20 min · 150+ words"
                        : "40 min · 250+ words"}
                    </span>
                    {num === 2 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5">
                        2× the marks of Task 1
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Task 1 — Academic: Visual Type + Image */}
            {content.taskNumber === 1 && testType === "academic" && (
              <>
                <div>
                  <label className={labelClass}>Visual Type *</label>
                  <div className="relative">
                    <select
                      required
                      value={content.visualType}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          visualType: e.target.value,
                        }))
                      }
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">— Select visual type —</option>
                      <option value="line-graph">Line Graph</option>
                      <option value="bar-chart">Bar Chart</option>
                      <option value="pie-chart">Pie Chart</option>
                      <option value="table">Table</option>
                      <option value="process-diagram">Process Diagram</option>
                      <option value="map">Map</option>
                      <option value="mixed">Mixed Charts</option>
                    </select>
                    <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Chart / Graph / Diagram Image
                  </label>
                  <ImageUpload
                    value={content.imageUrl}
                    onChange={(url) =>
                      setContent((c) => ({ ...c, imageUrl: url }))
                    }
                  />
                </div>
              </>
            )}

            {/* Task 1 — General: Letter Type + Bullet Points */}
            {content.taskNumber === 1 && testType === "general" && (
              <>
                <div>
                  <label className={labelClass}>Letter Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "formal", label: "Formal" },
                      { value: "semi-formal", label: "Semi-Formal" },
                      { value: "informal", label: "Informal" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setContent((c) => ({ ...c, letterType: opt.value }))
                        }
                        className={`text-xs font-bold px-3 py-3 rounded-xl border-2 transition-all ${
                          content.letterType === opt.value
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>
                      "You should" Bullet Points
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          bulletPoints: [...c.bulletPoints, ""],
                        }))
                      }
                      className={addBtn}
                    >
                      <i className="ti ti-plus text-xs" /> Add Point
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {content.bulletPoints.map((point, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-400 flex-shrink-0">•</span>
                        <input
                          type="text"
                          placeholder="e.g. explain the problem"
                          value={point}
                          onChange={(e) => {
                            const u = [...content.bulletPoints];
                            u[i] = e.target.value;
                            setContent((c) => ({ ...c, bulletPoints: u }));
                          }}
                          className={`${inputClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              bulletPoints: c.bulletPoints.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      </div>
                    ))}
                    {content.bulletPoints.length === 0 && (
                      <p className="text-xs text-slate-400">
                        e.g. "explain the problem", "request a solution", "ask
                        for compensation"
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Task 2 — Essay Type (same for Academic & General) */}
            {content.taskNumber === 2 && (
              <div>
                <label className={labelClass}>Essay Type *</label>
                <div className="relative">
                  <select
                    required
                    value={content.essayType}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, essayType: e.target.value }))
                    }
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">— Select essay type —</option>
                    <option value="opinion">Opinion Essay</option>
                    <option value="discussion">Discussion Essay</option>
                    <option value="advantages-disadvantages">
                      Advantages & Disadvantages Essay
                    </option>
                    <option value="problem-solution">
                      Problem & Solution Essay
                    </option>
                    <option value="two-part">Two-Part Question Essay</option>
                  </select>
                  <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Time Label</label>
                <input
                  type="text"
                  value={content.timeLabel}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, timeLabel: e.target.value }))
                  }
                  className={inputClass}
                />
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
            </div>

            <div>
              <label className={labelClass}>
                {content.taskNumber === 1 && testType === "general"
                  ? "Situation *"
                  : "Task Prompt / Question *"}
              </label>
              <textarea
                required
                rows={6}
                placeholder={
                  content.taskNumber === 1 && testType === "academic"
                    ? "e.g. The graph below shows the number of international students in Australia between 2015 and 2025. Summarise the information by selecting and reporting the main features..."
                    : content.taskNumber === 1 && testType === "general"
                      ? "e.g. You recently bought a product that does not work properly. Write a letter to the company."
                      : "e.g. Some people think universities should provide free education. To what extent do you agree or disagree?"
                }
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
          <div className="flex flex-col gap-5">
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
              <label className={labelClass}>Format *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setContent((c) => ({ ...c, format: "qa" }))}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all text-center ${
                    (content.format || "qa") === "qa"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-extrabold">
                    Question &amp; Answer
                  </span>
                  <span className="text-xs text-slate-400">
                    Separate questions, one recording each — for Part 1 &amp; 3
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContent((c) => ({ ...c, format: "cue-card" }))
                  }
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all text-center ${
                    content.format === "cue-card"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-extrabold">Cue Card</span>
                  <span className="text-xs text-slate-400">
                    One topic, prep time, one recording — for Part 2
                  </span>
                </button>
              </div>
            </div>

            {(content.format || "qa") === "qa" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Questions *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setContent((c) => ({
                        ...c,
                        questions: [...c.questions, { text: "", audioUrl: "" }],
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
                      className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0 mt-1">
                          {i + 1}
                        </span>
                        <textarea
                          rows={2}
                          required
                          placeholder={`Question ${i + 1}`}
                          value={q.text}
                          onChange={(e) => {
                            const u = [...content.questions];
                            u[i] = { ...u[i], text: e.target.value };
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
                            className={`${removeBtn} mt-1`}
                          >
                            <i className="ti ti-x text-xs" />
                          </button>
                        )}
                      </div>
                      <div className="pl-9">
                        <label className="text-xs text-slate-400 mb-1 block">
                          Question Audio (optional — uploads a real voice
                          recording instead of text-to-speech)
                        </label>
                        <AudioUpload
                          value={q.audioUrl}
                          onChange={(url) => {
                            const u = [...content.questions];
                            u[i] = { ...u[i], audioUrl: url };
                            setContent((c) => ({ ...c, questions: u }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {content.format === "cue-card" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Cue Card Topic *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Describe a book you enjoyed reading."
                    value={content.cueCardTopic}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        cueCardTopic: e.target.value,
                      }))
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>
                      "You should say:" Notes
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContent((c) => ({
                          ...c,
                          cueCardNotes: [...c.cueCardNotes, ""],
                        }))
                      }
                      className={addBtn}
                    >
                      <i className="ti ti-plus text-xs" /> Add Note
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {content.cueCardNotes.map((note, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-400 flex-shrink-0">•</span>
                        <input
                          type="text"
                          placeholder="e.g. what the book was"
                          value={note}
                          onChange={(e) => {
                            const u = [...content.cueCardNotes];
                            u[i] = e.target.value;
                            setContent((c) => ({ ...c, cueCardNotes: u }));
                          }}
                          className={`${inputClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setContent((c) => ({
                              ...c,
                              cueCardNotes: c.cueCardNotes.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                          className={removeBtn}
                        >
                          <i className="ti ti-x text-xs" />
                        </button>
                      </div>
                    ))}
                    {content.cueCardNotes.length === 0 && (
                      <p className="text-xs text-slate-400">
                        e.g. "what the book was", "when you read it", "why you
                        enjoyed it"
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>
                    Recommended Speak Time (seconds)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={300}
                    value={content.speakSeconds}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        speakSeconds: parseInt(e.target.value) || 120,
                      }))
                    }
                    className={inputClass}
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Real exam: 1–2 minutes (guidance only, shown to the student,
                    not a hard cutoff).
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl px-5 py-3 flex items-center gap-3 border border-slate-100">
                  <i className="ti ti-info-circle text-slate-400" />
                  <p className="text-xs text-slate-500">
                    The student gets one continuous recording for the whole cue
                    card response — not separate recordings per note.
                  </p>
                </div>
              </div>
            )}
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
            onClick={() =>
              router.push(`/admin/mock-test-questions?module=${module}`)
            }
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
