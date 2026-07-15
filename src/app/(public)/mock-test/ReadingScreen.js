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

// Type: Multi-Select MCQ — "Choose TWO/THREE letters"
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

// Type: True/False/Not Given and Yes/No/Not Given — same structure, different option set
function TFStatementsRenderer({ question, answers, onChange, options }) {
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
                <span className="text-blue-600 font-bold mr-1">{i + 1}.</span>
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
function MatchingHeadingsRenderer({ question, answers, onChange }) {
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
              <span className="text-sm font-bold text-slate-700">
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

// Type: Summary / Sentence Completion
function SummaryCompletionRenderer({ question, answers, onChange }) {
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
              <input
                type="text"
                value={answers[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
                className="inline-block w-32 mx-1 bg-slate-50 text-slate-700 text-sm text-center px-2 py-1 rounded-lg border-2 border-blue-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 align-baseline"
              />{" "}
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
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {currentSection.passage?.content?.passage ??
                "Passage not available."}
            </div>
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        {slots === 1
                          ? `Question ${startNum}`
                          : `Questions ${startNum}–${startNum + slots - 1}`}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
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
                    {(question.type === "true-false-ng" ||
                      question.type === "yes-no-ng") && (
                      <TFStatementsRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
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
                      />
                    )}
                    {(question.type === "matching-information" ||
                      question.type === "matching-features") && (
                      <MatchingRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
                      />
                    )}
                    {question.type === "summary-completion" && (
                      <SummaryCompletionRenderer
                        question={question}
                        answers={answers}
                        onChange={handleChange}
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
