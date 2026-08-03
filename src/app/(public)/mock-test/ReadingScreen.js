"use client";

import React, { useState, useEffect, useRef } from "react";

// Self-contained 60-minute timer, matching Reading's real exam duration.
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

// Type: MCQ
function MCQRenderer({ question, answers, onChange, startNumber }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
      <p className="text-sm font-bold text-slate-700 mb-4">
        <span className="text-blue-600 mr-1.5">{startNumber}.</span>
        {question.content.text}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {question.content.options.map((opt, oi) => {
          const letter = String.fromCharCode(65 + oi);
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

// Type: Form / Note Completion — label:value fields and/or bullet-point
// lines with inline "___" blanks, same as Listening's version
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

// Type: Multi-Select MCQ — "Choose TWO/THREE letters"
function MultiSelectRenderer({ question, answers, onChange, startNumber }) {
  const { instruction, questionText, options, selectCount } = question.content;
  const key = question.id;
  const selected = answers[key] || [];
  const endNumber = startNumber + selectCount - 1;

  const toggle = (label) => {
    let next;
    if (selected.includes(label)) {
      next = selected.filter((l) => l !== label);
    } else if (selected.length < selectCount) {
      next = [...selected, label];
    } else {
      return;
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
      <p className="text-sm font-bold text-slate-700">
        <span className="text-blue-600 mr-1.5">
          {startNumber}–{endNumber}.
        </span>
        {questionText}
      </p>
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

// Type: True/False/Not Given and Yes/No/Not Given — same structure, different option set
function TFStatementsRenderer({
  question,
  answers,
  onChange,
  options,
  startNumber,
}) {
  const { instruction, statements } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {statements.map((s, i) => {
          const key = `${question.id}-stmt-${i}`;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3"
            >
              <p className="text-sm font-medium text-slate-700">
                <span className="text-blue-600 font-bold mr-1">
                  {startNumber + i}.
                </span>
                {s.text}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onChange(key, opt)}
                    className={`text-xs font-bold px-3 py-2.5 rounded-lg border-2 transition-all ${answers[key] === opt ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"}`}
                  >
                    {opt}
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

// Type: Matching Headings
function MatchingHeadingsRenderer({
  question,
  answers,
  onChange,
  startNumber,
}) {
  const { instruction, headings, paragraphs } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          List of Headings
        </p>
        <div className="flex flex-col gap-1.5">
          {headings.map((h) => (
            <div
              key={h.label}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <span className="font-bold text-violet-600 flex-shrink-0">
                {h.label}.
              </span>
              <span>{h.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {paragraphs.map((p, i) => {
          const key = `${question.id}-para-${i}`;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4"
            >
              <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                  {startNumber + i}
                </span>
                Paragraph {p.label}
              </span>
              <div className="relative w-44">
                <select
                  value={answers[key] || ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 text-xs px-3 py-2.5 rounded-lg border-2 border-slate-200 outline-none focus:border-blue-400 appearance-none cursor-pointer"
                >
                  <option value="">Select heading</option>
                  {headings.map((h) => (
                    <option key={h.label} value={h.label}>
                      {h.label}
                    </option>
                  ))}
                </select>
                <i className="ti ti-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Type: Matching Information / Matching Features — same shape as Listening's Matching
function MatchingRenderer({ question, answers, onChange, startNumber }) {
  const { instruction, items, options } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
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
                  {startNumber + i}
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

// Type: Summary / Sentence Completion
function SummaryCompletionRenderer({
  question,
  answers,
  onChange,
  startNumber,
}) {
  const { instruction, wordBank, sentences } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      {wordBank?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Word Bank
          </p>
          <div className="flex flex-wrap gap-2">
            {wordBank.map(
              (w, i) =>
                w && (
                  <span
                    key={i}
                    className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full"
                  >
                    {w}
                  </span>
                ),
            )}
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-slate-200 p-5 leading-loose text-sm text-slate-700">
        {sentences.map((sent, i) => {
          const key = `${question.id}-sum-${i}`;
          return (
            <span key={i}>
              {sent.before}{" "}
              <span className="inline-flex items-center gap-1 mx-1">
                <span className="text-xs font-bold text-blue-600">
                  {startNumber + i}
                </span>
                <input
                  type="text"
                  value={answers[key] || ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="inline-block w-28 bg-slate-50 text-slate-700 text-sm text-center px-2 py-1 rounded-lg border-2 border-blue-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 align-baseline"
                />
              </span>{" "}
              {sent.after}{" "}
            </span>
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
    case "true-false-ng":
    case "yes-no-ng":
      return question.content.statements?.length || 0;
    case "matching-headings":
      return question.content.paragraphs?.length || 0;
    case "matching-information":
    case "matching-features":
      return question.content.items?.length || 0;
    case "summary-completion":
      return question.content.sentences?.length || 0;
    default:
      return 0; // "passage" itself isn't a scored question
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
    case "true-false-ng":
    case "yes-no-ng":
      return (
        question.content.statements?.filter(
          (_, i) => answers[`${question.id}-stmt-${i}`],
        ).length || 0
      );
    case "matching-headings":
      return (
        question.content.paragraphs?.filter(
          (_, i) => answers[`${question.id}-para-${i}`],
        ).length || 0
      );
    case "matching-information":
    case "matching-features":
      return (
        question.content.items?.filter(
          (_, i) => answers[`${question.id}-match-${i}`],
        ).length || 0
      );
    case "summary-completion":
      return (
        question.content.sentences?.filter((_, i) =>
          answers[`${question.id}-sum-${i}`]?.trim(),
        ).length || 0
      );
    default:
      return 0;
  }
}

/**
 * questions: ALL reading questions across all 3 passages (including the
 * "passage" type entries that hold each passage's title/text).
 * testType: "academic" | "general" — used for the badge only.
 */
export default function ReadingScreen({
  onComplete,
  onBack,
  questions,
  testType,
}) {
  const [answers, setAnswers] = useState({});
  const [activeSection, setActiveSection] = useState(1);
  const { display, timeLeft } = useTimer(60 * 60, true);

  const handleChange = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const sections = [1, 2, 3].map((num) => {
    const sectionQuestions = questions.filter((q) => (q.section || 1) === num);
    const passage = sectionQuestions.find((q) => q.type === "passage");
    const items = sectionQuestions
      .filter((q) => q.type !== "passage")
      .sort((a, b) => a.order - b.order);
    return { num, passage, items };
  });

  // Global question numbering continues across all 3 passages
  let runningNumber = 1;
  const sectionStartNumbers = {};
  sections.forEach((s) => {
    sectionStartNumbers[s.num] = runningNumber;
    runningNumber += s.items.reduce((acc, q) => acc + countAnswerSlots(q), 0);
  });

  const totalSlots = questions.reduce((acc, q) => acc + countAnswerSlots(q), 0);
  const totalAnswered = questions.reduce(
    (acc, q) => acc + countAnswered(q, answers),
    0,
  );

  const currentSection = sections.find((s) => s.num === activeSection);
  let qNum = sectionStartNumbers[activeSection];
  const [previewImage, setPreviewImage] = useState(null);
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
            Reading Module
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-800">
              Passage {activeSection} —{" "}
              {currentSection?.passage?.content?.title ?? "Reading Passage"}
            </h2>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${testType === "academic" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
            >
              {testType}
            </span>
          </div>
        </div>
        <TimerBadge display={display} warn={timeLeft < 600} />
      </div>

      {/* Passage tabs — free navigation, no locking (real IELTS reading lets you move freely) */}
      <div className="flex items-center gap-2">
        {sections.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setActiveSection(s.num)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
              activeSection === s.num
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"
            }`}
          >
            <i className="ti ti-book text-sm" />
            Passage {s.num}
          </button>
        ))}
      </div>

      {currentSection && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage text */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 lg:sticky lg:top-4 lg:self-start lg:max-h-[80vh] lg:overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Reading Passage
            </h3>
            <div
              className=" prose  prose-slate  max-w-none text-sm leading-8 [&_img]:rounded-lg [&_img]:my-6 [&_img]:cursor-zoom-in"
              onClick={(e) => {
                if (e.target.tagName === "IMG") {
                  setPreviewImage(e.target.src);
                }
              }}
              dangerouslySetInnerHTML={{
                __html: currentSection.passage?.content?.passage || "",
              }}
            />
            {previewImage && (
              <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setPreviewImage(null)}
              >
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white text-slate-700 text-2xl font-bold flex items-center justify-center shadow-lg hover:bg-slate-100 transition cursor-pointer
                    "
                  >
                    ×
                  </button>

                  {/* Image */}
                  <img
                    src={previewImage}
                    alt="Preview"
                    className=" max-h-[80vh] rounded-lg object-contain max-w-[80vw]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Questions */}
          <div className="flex flex-col gap-6">
            {currentSection.items.length > 0 ? (
              currentSection.items.map((question) => {
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
                    {question.type === "mcq" && (
                      <MCQRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
                      />
                    )}
                    {question.type === "multi-select" && (
                      <MultiSelectRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
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
                    {(question.type === "true-false-ng" ||
                      question.type === "yes-no-ng") && (
                      <TFStatementsRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
                        options={
                          question.type === "true-false-ng"
                            ? ["TRUE", "FALSE", "NOT GIVEN"]
                            : ["YES", "NO", "NOT GIVEN"]
                        }
                      />
                    )}
                    {question.type === "matching-headings" && (
                      <MatchingHeadingsRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
                      />
                    )}
                    {(question.type === "matching-information" ||
                      question.type === "matching-features") && (
                      <MatchingRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
                      />
                    )}
                    {question.type === "summary-completion" && (
                      <SummaryCompletionRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                        startNumber={startNum}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center text-slate-400 text-sm">
                <i className="ti ti-mood-empty text-3xl mb-2 block" />
                No questions have been added for Passage {activeSection} yet.
              </div>
            )}
          </div>
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
          of {totalSlots} answered (all passages)
        </p>
        <button
          onClick={() => onComplete("reading", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Reading <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}
