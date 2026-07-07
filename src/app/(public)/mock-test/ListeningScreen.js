"use client";

import { useState } from "react";

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

// Type 2: Form Completion
function FormCompletionRenderer({ question, answers, onChange }) {
  const { instruction, fields } = question.content;
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col gap-4">
      {instruction && (
        <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl">
          <i className="ti ti-info-circle mr-1" />
          {instruction}
        </p>
      )}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
        {fields.map((field, i) => {
          const key = `${question.id}-field-${i}`;
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-2"
            >
              <span className="text-sm font-semibold text-slate-600 sm:w-48 flex-shrink-0">
                {field.label}
              </span>
              <input
                type="text"
                placeholder="Write your answer..."
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
    case "form-completion":
      return question.content.fields?.length || 0;
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
    case "form-completion":
      return (
        question.content.fields?.filter((_, i) =>
          answers[`${question.id}-field-${i}`]?.trim(),
        ).length || 0
      );
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

export default function ListeningScreen({
  onComplete,
  onBack,
  questions,
  timerDisplay,
  timeLeft,
}) {
  const [answers, setAnswers] = useState({});

  const handleChange = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const totalSlots = questions.reduce((acc, q) => acc + countAnswerSlots(q), 0);
  const totalAnswered = questions.reduce(
    (acc, q) => acc + countAnswered(q, answers),
    0,
  );

  // Group questions by order for display
  let questionNumber = 1;

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
          <h2 className="text-xl font-extrabold text-slate-800">Section 1</h2>
        </div>
        <TimerBadge display={timerDisplay} warn={timeLeft < 300} />
      </div>

      {/* Audio player placeholder */}
      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <i className="ti ti-player-play text-white text-xl" />
        </div>
        <div className="flex-1 w-full">
          <p className="text-white text-sm font-bold mb-2">
            Recording — Accommodation Office Call
          </p>
          <div className="w-full h-2 bg-white/20 rounded-full">
            <div className="h-full bg-blue-500 rounded-full w-0" />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>0:00</span>
            <span>4:30</span>
          </div>
        </div>
        <p className="text-xs text-white/50 text-center">
          Audio will be connected
          <br />
          in next phase
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-700">
        <i className="ti ti-info-circle flex-shrink-0" />
        Read all questions carefully before listening. You hear the recording
        once.
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {questions.map((question, qi) => {
          const slots = countAnswerSlots(question);
          const startNum = questionNumber;
          questionNumber += slots;

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
                        : question.type === "sentence-completion"
                          ? "bg-emerald-50 text-emerald-600"
                          : question.type === "short-answer"
                            ? "bg-amber-50 text-amber-600"
                            : question.type === "matching"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {question.type.replace("-", " ")}
                </span>
              </div>

              {question.type === "mcq" && (
                <MCQRenderer
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

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-100">
        <p className="text-sm text-slate-400">
          <span
            className={`font-bold ${totalAnswered === totalSlots ? "text-emerald-600" : "text-slate-600"}`}
          >
            {totalAnswered}
          </span>{" "}
          of {totalSlots} answered
        </p>
        <button
          onClick={() => onComplete("listening", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Listening <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}
