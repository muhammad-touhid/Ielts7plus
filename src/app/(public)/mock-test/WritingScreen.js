"use client";

import { useState, useEffect, useRef } from "react";

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

function wordCount(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
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

function BackButton({ onClick, label = "Back" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
    >
      <i className="ti ti-arrow-left text-base" />
      {label}
    </button>
  );
}

const VISUAL_TYPE_LABELS = {
  "line-graph": "Line Graph",
  "bar-chart": "Bar Chart",
  "pie-chart": "Pie Chart",
  table: "Table",
  "process-diagram": "Process Diagram",
  map: "Map",
  mixed: "Mixed Charts",
};

const LETTER_TYPE_LABELS = {
  formal: "Formal Letter",
  "semi-formal": "Semi-Formal Letter",
  informal: "Informal Letter",
};

const ESSAY_TYPE_LABELS = {
  opinion: "Opinion Essay",
  discussion: "Discussion Essay",
  "advantages-disadvantages": "Advantages & Disadvantages Essay",
  "problem-solution": "Problem & Solution Essay",
  "two-part": "Two-Part Question Essay",
};

// Recommended checkpoint, in seconds elapsed from the start of the 60-minute
// session, for moving from Task 1 to Task 2 (20 min in).
const TASK1_RECOMMENDED_SECONDS = 20 * 60;

function PacingHint({ elapsedSeconds, activeTaskNumber }) {
  if (activeTaskNumber === 1 && elapsedSeconds > TASK1_RECOMMENDED_SECONDS) {
    const over = Math.floor((elapsedSeconds - TASK1_RECOMMENDED_SECONDS) / 60);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-700">
        <i className="ti ti-hourglass-low flex-shrink-0" />
        You're {over > 0 ? `${over} min ` : ""}past the recommended 20 minutes
        for Task 1 — Task 2 needs 40 minutes and carries twice the marks.
        Consider moving on.
      </div>
    );
  }
  if (activeTaskNumber === 1) {
    const remaining = Math.ceil(
      (TASK1_RECOMMENDED_SECONDS - elapsedSeconds) / 60,
    );
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-blue-600">
        <i className="ti ti-clock flex-shrink-0" />
        Recommended: about {remaining} more minute{remaining !== 1 ? "s" : ""}{" "}
        on Task 1, then move to Task 2 (40 minutes, 2× the marks).
      </div>
    );
  }
  return null;
}

export default function WritingScreen({ onComplete, onBack, tasks, testType }) {
  const [answers, setAnswers] = useState({});
  const [activeTask, setActiveTask] = useState(0);
  const { display, timeLeft } = useTimer(60 * 60, true);
  const elapsedSeconds = 60 * 60 - timeLeft;

  const task = tasks[activeTask];
  const taskId = task?.id;
  const wc = wordCount(answers[taskId] ?? "");
  const meetsMin = wc >= (task?.content?.minWords ?? 0);

  const taskNumber = task?.content?.taskNumber;
  const typeLabel =
    taskNumber === 1
      ? testType === "academic"
        ? VISUAL_TYPE_LABELS[task?.content?.visualType]
        : LETTER_TYPE_LABELS[task?.content?.letterType]
      : ESSAY_TYPE_LABELS[task?.content?.essayType];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="mb-2">
            <BackButton onClick={onBack} label="Back to Modules" />
          </div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Writing Module
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-extrabold text-slate-800">
              {testType === "academic"
                ? "Academic Writing"
                : "General Training Writing"}
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

      <div
        className={`rounded-xl px-5 py-3 flex items-center gap-3 text-sm ${testType === "academic" ? "bg-blue-50 border border-blue-100 text-blue-700" : "bg-emerald-50 border border-emerald-100 text-emerald-700"}`}
      >
        <i className="ti ti-info-circle flex-shrink-0" />
        {testType === "academic"
          ? "Task 1: Describe a graph, chart, table or diagram (150+ words). Task 2: Write an essay (250+ words, worth twice the marks of Task 1)."
          : "Task 1: Write a letter — formal, semi-formal or informal (150+ words). Task 2: Write an essay (250+ words, worth twice the marks of Task 1)."}
      </div>

      <div className="flex gap-2">
        {tasks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTask(i)}
            className={`text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${activeTask === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
          >
            Task {t.content?.taskNumber ?? i + 1}
            {answers[t.id]?.trim() && (
              <i className="ti ti-circle-check-filled text-emerald-400 text-xs" />
            )}
          </button>
        ))}
      </div>

      {task && (
        <>
          <PacingHint
            elapsedSeconds={elapsedSeconds}
            activeTaskNumber={taskNumber}
          />

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
                <i className="ti ti-clock" />
                {task.content.timeLabel}
              </div>
              {typeLabel && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-blue-600 border border-blue-200">
                  {typeLabel}
                </span>
              )}
            </div>

            {task.content.imageUrl && (
              <div className="bg-white rounded-xl border border-blue-100 p-3">
                <img
                  src={task.content.imageUrl}
                  alt="Chart, graph, or diagram to describe"
                  className="w-full rounded-lg object-contain max-h-96"
                />
              </div>
            )}

            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {task.content.prompt}
            </p>

            {task.content.bulletPoints?.length > 0 && (
              <div className="bg-white rounded-xl border border-blue-100 p-4">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                  You should:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {task.content.bulletPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">
                        •
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              rows={12}
              placeholder="Write your response here..."
              value={answers[taskId] ?? ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [taskId]: e.target.value }))
              }
              className="w-full bg-white text-slate-700 text-sm placeholder-slate-400 p-5 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs px-1">
              <span
                className={`font-bold ${meetsMin ? "text-emerald-500" : "text-slate-400"}`}
              >
                {wc} words {!meetsMin && `(minimum ${task.content.minWords})`}
              </span>
              {!meetsMin && (
                <span className="text-slate-400">
                  {task.content.minWords - wc} more words needed
                </span>
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <p className="text-sm text-slate-400">
          {tasks.filter((t) => answers[t.id]?.trim()).length} of {tasks.length}{" "}
          tasks attempted
        </p>
        <button
          onClick={() => onComplete("writing", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Writing <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}
