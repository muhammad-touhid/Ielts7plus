"use client";

import React, { useState, useEffect, useRef } from "react";

// Self-contained 30-minute timer — the parent page doesn't pass timer props
// to ListeningScreen (same pattern as Reading/Writing/Speaking screens).
function useTimer(seconds, active) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    ref.current = setInterval(
      () => setTimeLeft((t) => (t > 0 ? t - 1 : 0)),
      1000,
    );
    return () => clearInterval(ref.current);
  }, [active]);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  return { timeLeft, display: `${mm}:${ss}` };
}

// Renders the optional custom text block above a question — supports old
// data where groupHeading was a plain string, and new data where it's
// { text, tag, align }.
function GroupHeadingBlock({ groupHeading }) {
  if (!groupHeading) return null;
  const block =
    typeof groupHeading === "string"
      ? { text: groupHeading, tag: "h3", align: "left" }
      : groupHeading;
  if (!block.text) return null;

  const tag = block.tag || "h3";
  const alignClass =
    block.align === "center"
      ? "text-center"
      : block.align === "right"
        ? "text-right"
        : "text-left";
  const sizeClass =
    {
      h2: "text-2xl font-extrabold text-slate-800",
      h3: "text-xl font-extrabold text-slate-800",
      h4: "text-lg font-bold text-slate-800",
      h5: "text-base font-bold text-slate-700",
      h6: "text-sm font-bold text-slate-700",
      p: "text-sm text-slate-600",
    }[tag] || "text-xl font-extrabold text-slate-800";

  return React.createElement(
    tag,
    { className: `${sizeClass} ${alignClass} mt-2` },
    block.text,
  );
}

function TimerBadge({ display, warn }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${warn ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"}`}
    >
      <i className={`ti ti-clock text-base ${warn ? "animate-pulse" : ""}`} />
      {display}
    </div>
  );
}

// Type 1: MCQ
function MCQRenderer({ question, answers, onChange }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
      <p className="text-sm font-bold text-slate-700 mb-4">
        {question.content.text}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {question.content.options.map((opt, oi) => {
          const letter = ["A", "B", "C", "D"][oi];
          const selected = answers[question.id] === opt;
          return (
            <button
              key={oi}
              onClick={() => onChange(question.id, opt)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 ${selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {letter}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Type 1b: Multi-Select MCQ — "Choose TWO/THREE letters"
function MultiSelectRenderer({ question, answers, onChange }) {
  const { instruction, questionText, options, selectCount } = question.content;
  const key = question.id;
  const selected = answers[key] || [];

  const toggle = (label) => {
    let next;
    if (selected.includes(label)) {
      next = selected.filter((l) => l !== label);
    } else if (selected.length < selectCount) {
      next = [...selected, label];
    } else {
      return; // already at max — ignore extra clicks
    }
    onChange(key, next);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <p className="text-sm font-bold text-slate-700">{questionText}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 ${isSelected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {opt.label}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        {selected.length} of {selectCount} selected
      </p>
    </div>
  );
}

// Type 2: Form Completion
function FormCompletionRenderer({ question, answers, onChange, startNumber }) {
  const { instruction, noteTitle, fields } = question.content;
  let num = startNumber;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-2.5">
        {noteTitle && (
          <h4 className="text-sm font-extrabold text-slate-800 text-center pb-3 mb-1 border-b border-slate-100">
            {noteTitle}
          </h4>
        )}
        {fields.map((field, i) => {
          const kind = field.kind || "label";
          const isExample = !!field.isExample;

          if (kind === "bullet") {
            const text = field.text || "";
            const parts = text.split("___");
            return (
              <div key={i} className="flex flex-col gap-1">
                {field.sectionBreakBefore && (
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mt-2">
                    {field.sectionBreakBefore}
                  </p>
                )}
                <div className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-slate-400 flex-shrink-0 mt-0.5">•</span>
                  <p className="flex-1">
                    {parts.map((part, pi) => {
                      const isLast = pi === parts.length - 1;
                      if (isLast) return <span key={pi}>{part}</span>;

                      if (isExample) {
                        const exampleAnswer = field.answers?.[pi] || "";
                        return (
                          <span key={pi}>
                            {part}
                            <span className="italic text-slate-500">
                              {exampleAnswer}{" "}
                              <span className="text-xs text-slate-400 not-italic">
                                (Example)
                              </span>
                            </span>
                          </span>
                        );
                      }

                      const key = `${question.id}-field-${i}-blank-${pi}`;
                      const displayNum = num;
                      num += 1;
                      return (
                        <span key={pi}>
                          {part}
                          <span className="inline-flex items-center gap-1 mx-1">
                            <span className="text-xs font-bold text-blue-600">
                              {displayNum}
                            </span>
                            <input
                              type="text"
                              value={answers[key] || ""}
                              onChange={(e) => onChange(key, e.target.value)}
                              className="inline-block w-28 bg-slate-50 text-slate-700 text-sm text-center px-2 py-1 rounded-lg border-2 border-blue-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 align-baseline"
                            />
                          </span>
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>
            );
          }

          // kind === "label"
          const key = `${question.id}-field-${i}`;
          const displayNum = isExample ? null : num;
          if (!isExample) num += 1;
          return (
            <div key={i} className="flex flex-col gap-1">
              {field.sectionBreakBefore && (
                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mt-2">
                  {field.sectionBreakBefore}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap text-sm">
                <span className="font-semibold text-slate-600 flex-shrink-0">
                  {field.label}:
                </span>
                {isExample ? (
                  <span className="text-slate-500 italic">
                    {field.answer}{" "}
                    <span className="text-xs text-slate-400 not-italic">
                      (Example)
                    </span>
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-bold text-blue-600 flex-shrink-0 w-4 text-right">
                      {displayNum}
                    </span>
                    <input
                      type="text"
                      placeholder="......."
                      value={answers[key] || ""}
                      onChange={(e) => onChange(key, e.target.value)}
                      className="flex-1 min-w-[120px] bg-slate-50 text-slate-700 text-sm px-3 py-2 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type 2b: Table Completion — grid with inline blanks marked as "___" in cell text
function TableCompletionRenderer({ question, answers, onChange, startNumber }) {
  const { instruction, tableTitle, columns, rows } = question.content;
  let num = startNumber;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {tableTitle && (
          <h4 className="text-sm font-extrabold text-slate-800 text-center py-3 border-b border-slate-100 bg-slate-50">
            {tableTitle}
          </h4>
        )}
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                {columns.map((col, ci) => (
                  <th
                    key={ci}
                    className="text-left px-4 py-3 text-sm font-extrabold text-slate-800 border-r border-slate-200 last:border-r-0 break-words"
                    style={{ width: `${100 / columns.length}%` }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  {row.cells.map((cell, ci) => {
                    const parts = cell.text.split("___");
                    return (
                      <td
                        key={ci}
                        className="px-4 py-3 text-slate-600 align-top border-r border-slate-100 last:border-r-0 whitespace-pre-line break-words"
                      >
                        {parts.map((part, pi) => {
                          const isLast = pi === parts.length - 1;
                          if (isLast) return <span key={pi}>{part}</span>;
                          const key = `${question.id}-table-${ri}-${ci}-${pi}`;
                          const displayNum = num;
                          num += 1;
                          return (
                            <span key={pi}>
                              {part}
                              <span className="inline-flex items-center gap-1 mx-1">
                                <span className="text-xs font-bold text-blue-600">
                                  {displayNum}
                                </span>
                                <input
                                  type="text"
                                  value={answers[key] || ""}
                                  onChange={(e) =>
                                    onChange(key, e.target.value)
                                  }
                                  className="inline-block w-24 bg-slate-50 text-slate-700 text-xs text-center px-2 py-1 rounded-lg border-2 border-blue-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 align-baseline"
                                />
                              </span>
                            </span>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Type 3: Sentence Completion
function SentenceCompletionRenderer({ question, answers, onChange }) {
  const { instruction, sentences } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {sentences.map((sent, i) => {
          const key = `${question.id}-sent-${i}`;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center flex-wrap gap-2 text-sm text-slate-700"
            >
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                {i + 1}
              </span>
              {sent.before && (
                <span className="font-medium">{sent.before}</span>
              )}
              <input
                type="text"
                placeholder="..."
                value={answers[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-32 bg-slate-50 text-slate-700 text-sm text-center px-3 py-1.5 rounded-lg border-2 border-blue-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {sent.after && <span className="font-medium">{sent.after}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type 4: Short Answer
function ShortAnswerRenderer({ question, answers, onChange }) {
  const { instruction, questions } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {questions.map((q, i) => {
          const key = `${question.id}-q-${i}`;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex items-start gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-slate-700">{q.text}</p>
              </div>
              <input
                type="text"
                placeholder="Your answer..."
                value={answers[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="sm:w-48 bg-slate-50 text-slate-700 text-sm px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type 5: Matching
function MatchingRenderer({ question, answers, onChange }) {
  const { instruction, items, options } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      {/* Options box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Answer Options
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => (
            <div
              key={opt.label}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                {opt.label}
              </span>
              <span>{opt.text}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Items to match */}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => {
          const key = `${question.id}-match-${i}`;
          const selected = answers[key];
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {item.text}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => onChange(key, opt.label)}
                    className={`w-9 h-9 rounded-full text-xs font-bold border-2 transition-all duration-200 ${selected === opt.label ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type 6: Map / Diagram Labelling
function MapLabellingRenderer({ question, answers, onChange }) {
  const { instruction, imageUrl, labels } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      {imageUrl && (
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <img
            src={imageUrl}
            alt="Map/Diagram"
            className="w-full rounded-lg object-contain max-h-80"
          />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {labels.map((label, i) => {
          const key = `${question.id}-label-${i}`;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3"
            >
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {label.number}
              </span>
              <input
                type="text"
                placeholder="Label this location..."
                value={answers[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="flex-1 bg-slate-50 text-slate-700 text-sm px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Count how many answer slots a question has
function countAnswerSlots(question) {
  switch (question.type) {
    case "mcq":
      return 1;
    case "multi-select":
      return question.content.selectCount || 2;
    case "form-completion":
      return (
        question.content.fields?.reduce((acc, f) => {
          if (f.isExample) return acc;
          if ((f.kind || "label") === "bullet") {
            return acc + (f.answers?.length || 0);
          }
          return acc + 1;
        }, 0) || 0
      );
    case "table-completion":
      return (
        question.content.rows?.reduce(
          (acc, row) =>
            acc +
            row.cells.reduce((a, cell) => a + (cell.answers?.length || 0), 0),
          0,
        ) || 0
      );
    case "sentence-completion":
      return question.content.sentences?.length || 0;
    case "short-answer":
      return question.content.questions?.length || 0;
    case "matching":
      return question.content.items?.length || 0;
    case "map-labelling":
      return question.content.labels?.length || 0;
    default:
      return 0;
  }
}

// Count how many answers the student has filled
function countAnswered(question, answers) {
  switch (question.type) {
    case "mcq":
      return answers[question.id] ? 1 : 0;
    case "multi-select":
      return Math.min(
        (answers[question.id] || []).length,
        question.content.selectCount || 2,
      );
    case "form-completion": {
      let count = 0;
      question.content.fields?.forEach((f, i) => {
        if (f.isExample) return;
        if ((f.kind || "label") === "bullet") {
          (f.answers || []).forEach((_, bi) => {
            const key = `${question.id}-field-${i}-blank-${bi}`;
            if (answers[key]?.trim()) count += 1;
          });
        } else {
          const key = `${question.id}-field-${i}`;
          if (answers[key]?.trim()) count += 1;
        }
      });
      return count;
    }
    case "table-completion": {
      let count = 0;
      question.content.rows?.forEach((row, ri) => {
        row.cells.forEach((cell, ci) => {
          (cell.answers || []).forEach((_, bi) => {
            const key = `${question.id}-table-${ri}-${ci}-${bi}`;
            if (answers[key]?.trim()) count += 1;
          });
        });
      });
      return count;
    }
    case "sentence-completion":
      return (
        question.content.sentences?.filter((_, i) =>
          answers[`${question.id}-sent-${i}`]?.trim(),
        ).length || 0
      );
    case "short-answer":
      return (
        question.content.questions?.filter((_, i) =>
          answers[`${question.id}-q-${i}`]?.trim(),
        ).length || 0
      );
    case "matching":
      return (
        question.content.items?.filter(
          (_, i) => answers[`${question.id}-match-${i}`],
        ).length || 0
      );
    case "map-labelling":
      return (
        question.content.labels?.filter((_, i) =>
          answers[`${question.id}-label-${i}`]?.trim(),
        ).length || 0
      );
    default:
      return 0;
  }
}

/**
 * settings (optional prop): {
 *   sectionLocked, audioLocked, autoPlayAudio, autoAdvanceSection,
 *   noPauseRewind, previewTimeEnabled, previewSeconds,
 *   audioSection1..4
 * }
 * Any omitted field defaults to "off" — fully unlocked practice mode.
 */
export default function ListeningScreen({
  onComplete,
  onBack,
  questions,
  timerDisplay: timerDisplayProp,
  timeLeft: timeLeftProp,
  settings,
}) {
  const sectionLocked = settings?.sectionLocked ?? false;
  const audioLocked = settings?.audioLocked ?? false;
  const autoPlayAudio = settings?.autoPlayAudio ?? false;
  const autoAdvanceSection = settings?.autoAdvanceSection ?? false;
  const noPauseRewind = settings?.noPauseRewind ?? false;
  const previewTimeEnabled = settings?.previewTimeEnabled ?? false;
  const previewSeconds = settings?.previewSeconds ?? 30;

  // Use internally-managed 30 min timer unless the parent explicitly passes one.
  const internalTimer = useTimer(30 * 60, timerDisplayProp === undefined);
  const timerDisplay = timerDisplayProp ?? internalTimer.display;
  const timeLeft = timeLeftProp ?? internalTimer.timeLeft;

  const [answers, setAnswers] = useState({});
  const [activeSection, setActiveSection] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  // Per-section playback phase: "idle" | "preview" | "ready" | "playing" | "ended"
  const [sectionPhase, setSectionPhase] = useState({});
  const [previewCountdown, setPreviewCountdown] = useState(0);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef(null);

  const handleChange = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const sections = [1, 2, 3, 4].map((num) => ({
    num,
    questions: questions
      .filter((q) => (q.section || 1) === num)
      .sort((a, b) => a.order - b.order),
  }));

  // Global question numbering: each section continues numbering from the previous one
  let runningNumber = 1;
  const sectionStartNumbers = {};
  sections.forEach((s) => {
    sectionStartNumbers[s.num] = runningNumber;
    runningNumber += s.questions.reduce(
      (acc, q) => acc + countAnswerSlots(q),
      0,
    );
  });

  const totalSlots = questions.reduce((acc, q) => acc + countAnswerSlots(q), 0);
  const totalAnswered = questions.reduce(
    (acc, q) => acc + countAnswered(q, answers),
    0,
  );

  const currentSection = sections.find((s) => s.num === activeSection);
  const isLastSection = activeSection === 4;
  const currentAudioUrl = settings?.[`audioSection${activeSection}`];
  const phase = sectionPhase[activeSection] || "idle";

  // Initialize this section's phase the first time it's visited
  useEffect(() => {
    setSectionPhase((prev) => {
      if (prev[activeSection]) return prev;
      let initial;
      if (previewTimeEnabled) initial = "preview";
      else if (autoPlayAudio) initial = "playing";
      else initial = "ready";
      return { ...prev, [activeSection]: initial };
    });
    setAutoplayBlocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // Reading-time countdown before audio starts
  useEffect(() => {
    if (phase !== "preview") return;
    setPreviewCountdown(previewSeconds);
    const interval = setInterval(() => {
      setPreviewCountdown((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSectionPhase((prev) => ({
            ...prev,
            [activeSection]: autoPlayAudio ? "playing" : "ready",
          }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeSection]);

  // Attempt autoplay whenever phase becomes "playing"
  useEffect(() => {
    if (phase === "playing" && audioRef.current) {
      const p = audioRef.current.play();
      if (p?.catch) {
        p.catch(() => setAutoplayBlocked(true));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, activeSection]);

  // Auto-advance countdown once audio ends
  useEffect(() => {
    if (phase !== "ended" || !autoAdvanceSection || !currentAudioUrl) return;
    setAutoAdvanceCountdown(3);
    const interval = setInterval(() => {
      setAutoAdvanceCountdown((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleContinue();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, autoAdvanceSection, currentAudioUrl]);

  const handleManualPlay = () => {
    setSectionPhase((prev) => ({ ...prev, [activeSection]: "playing" }));
    setAutoplayBlocked(false);
  };

  const handleAudioEnded = () => {
    setSectionPhase((prev) => ({ ...prev, [activeSection]: "ended" }));
  };

  const goToSection = (num) => {
    if (sectionLocked && num > maxUnlocked) return;
    setActiveSection(num);
  };

  const handleContinue = () => {
    if (isLastSection) {
      onComplete("listening", answers);
    } else {
      const next = activeSection + 1;
      setMaxUnlocked((m) => Math.max(m, next));
      setActiveSection(next);
    }
  };

  // If this section has audio and auto-advance is off, require the audio to
  // have finished before letting the student move on manually — mirrors the
  // real test's "you can't move on mid-recording" rule. No audio uploaded =
  // nothing to wait for.
  const continueDisabled = !!currentAudioUrl && phase !== "ended";
  const showManualContinue = !autoAdvanceSection || !currentAudioUrl;

  let qNum = sectionStartNumbers[activeSection];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="mb-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <i className="ti ti-arrow-left text-base" /> Back to Modules
            </button>
          </div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Listening Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Section {activeSection}
          </h2>
        </div>
        <TimerBadge display={timerDisplay} warn={timeLeft < 300} />
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-2">
        {sections.map((s) => {
          const locked = sectionLocked && s.num > maxUnlocked;
          const active = s.num === activeSection;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => goToSection(s.num)}
              disabled={locked}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                active
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : locked
                    ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                    : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"
              }`}
            >
              {locked && <i className="ti ti-lock text-xs" />}
              Section {s.num}
            </button>
          );
        })}
      </div>

      {currentSection && currentSection.questions.length > 0 ? (
        <>
          {/* Audio area — phase-driven */}
          {!currentAudioUrl ? (
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-music-off text-white text-xl" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">
                  No audio uploaded for Section {activeSection}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  The admin hasn't added a recording for this section yet.
                </p>
              </div>
            </div>
          ) : phase === "preview" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-clock-hour-4 text-amber-600 text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-700">
                  Reading time — Section {activeSection}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Look through the questions below. Audio starts automatically
                  in {previewCountdown}s.
                </p>
              </div>
              <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
                0:{String(previewCountdown).padStart(2, "0")}
              </span>
            </div>
          ) : phase === "ended" && audioLocked ? (
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                <i className="ti ti-lock text-white text-xl" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">
                  Section {activeSection} audio locked
                </p>
                <p className="text-white/50 text-xs mt-1">
                  You've already listened to this recording.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-bold">
                  Recording — Section {activeSection}
                </p>
                {phase === "playing" && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Playing
                  </span>
                )}
              </div>

              {phase === "ready" && (
                <button
                  type="button"
                  onClick={handleManualPlay}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all self-start"
                >
                  <i className="ti ti-player-play" /> Play Section Audio
                </button>
              )}

              {(phase === "playing" || phase === "ended") && (
                <>
                  <audio
                    key={`section-${activeSection}-audio`}
                    ref={audioRef}
                    src={currentAudioUrl}
                    controls={!noPauseRewind}
                    controlsList="nodownload noplaybackrate"
                    onEnded={handleAudioEnded}
                    autoPlay={phase === "playing"}
                    className="w-full"
                    style={{ colorScheme: "dark" }}
                  />
                  {noPauseRewind && phase === "playing" && (
                    <p className="text-xs text-white/50">
                      <i className="ti ti-info-circle mr-1" />
                      Audio is playing — no pause or rewind, same as the real
                      test.
                    </p>
                  )}
                  {autoplayBlocked && phase === "playing" && (
                    <button
                      type="button"
                      onClick={handleManualPlay}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg self-start"
                    >
                      <i className="ti ti-player-play" /> Tap to start audio
                      (autoplay was blocked by your browser)
                    </button>
                  )}
                </>
              )}

              {phase === "ended" && autoAdvanceSection && (
                <p className="text-xs text-white/50">
                  Moving to{" "}
                  {isLastSection
                    ? "submission"
                    : `Section ${activeSection + 1}`}{" "}
                  in {autoAdvanceCountdown}s...
                </p>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-700">
            <i className="ti ti-info-circle flex-shrink-0" />
            Read all questions carefully before listening. You hear the
            recording once.
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-6">
            {currentSection.questions.map((question) => {
              // Standalone text block — not a scored question, renders as-is
              // wherever its Order places it in the sequence.
              if (question.type === "text-block") {
                return (
                  <GroupHeadingBlock
                    key={question.id}
                    groupHeading={question.content}
                  />
                );
              }

              const slots = countAnswerSlots(question);
              const startNum = qNum;
              qNum += slots;

              return (
                <div key={question.id} className="flex flex-col gap-2">
                  {/* Question number badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      {slots === 1
                        ? `Question ${startNum}`
                        : `Questions ${startNum}–${startNum + slots - 1}`}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        question.type === "mcq"
                          ? "bg-blue-50 text-blue-600"
                          : question.type === "form-completion"
                            ? "bg-violet-50 text-violet-600"
                            : question.type === "table-completion"
                              ? "bg-cyan-50 text-cyan-600"
                              : question.type === "sentence-completion"
                                ? "bg-emerald-50 text-emerald-600"
                                : question.type === "short-answer"
                                  ? "bg-amber-50 text-amber-600"
                                  : question.type === "matching"
                                    ? "bg-rose-50 text-rose-600"
                                    : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {question.type.replace(/-/g, " ")}
                    </span>
                  </div>

                  {question.type === "mcq" && (
                    <MCQRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                  {question.type === "multi-select" && (
                    <MultiSelectRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                  {question.type === "form-completion" && (
                    <FormCompletionRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                      startNumber={startNum}
                    />
                  )}
                  {question.type === "table-completion" && (
                    <TableCompletionRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                      startNumber={startNum}
                    />
                  )}
                  {question.type === "sentence-completion" && (
                    <SentenceCompletionRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                  {question.type === "short-answer" && (
                    <ShortAnswerRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                  {question.type === "matching" && (
                    <MatchingRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                  {question.type === "map-labelling" && (
                    <MapLabellingRenderer
                      question={question}
                      answers={answers}
                      onChange={handleChange}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center text-slate-400 text-sm">
          <i className="ti ti-mood-empty text-3xl mb-2 block" />
          No questions have been added for Section {activeSection} yet.
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-100">
        <p className="text-sm text-slate-400">
          <span
            className={`font-bold ${totalAnswered === totalSlots ? "text-emerald-600" : "text-slate-600"}`}
          >
            {totalAnswered}
          </span>{" "}
          of {totalSlots} answered (all sections)
        </p>
        {showManualContinue && (
          <button
            onClick={handleContinue}
            disabled={continueDisabled}
            className={`inline-flex items-center gap-2 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all duration-200 ${
              continueDisabled
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 shadow-md shadow-blue-200 hover:bg-blue-700"
            }`}
          >
            {isLastSection ? (
              <>
                Submit Listening <i className="ti ti-arrow-right text-sm" />
              </>
            ) : (
              <>
                Continue to Section {activeSection + 1}{" "}
                <i className="ti ti-arrow-right text-sm" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
