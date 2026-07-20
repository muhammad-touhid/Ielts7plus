"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RecordAnswer from "./RecordAnswer";

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

function getPreferredVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-GB") ||
    voices.find((v) => v.lang?.startsWith("en")) ||
    voices[0] ||
    null
  );
}

/**
 * parts: MockTestQuestion[] type "part", content: {
 *   part, instruction, format: "qa" | "cue-card",
 *   questions: [{ text, audioUrl }],                // qa format
 *   cueCardTopic, cueCardNotes: [], prepSeconds, speakSeconds,  // cue-card format
 * }
 * settings: mock test settings — reads settings.speakingShowQuestionText
 */
export default function SpeakingScreen({
  onComplete,
  onBack,
  parts,
  settings,
}) {
  const { display, timeLeft } = useTimer(15 * 60, true);
  const showQuestionText = settings?.speakingShowQuestionText ?? true;

  const [answers, setAnswers] = useState({});
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // "not-started" | "prep" | "question" | "ready" | "advancing" | "part-done" | "all-done"
  const [partPhase, setPartPhase] = useState("not-started");
  const [ttsUnsupported, setTtsUnsupported] = useState(false);

  const voiceRef = useRef(null);
  const audioElRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setTtsUnsupported(true);
      return;
    }
    voiceRef.current = getPreferredVoice();
    window.speechSynthesis.onvoiceschanged = () => {
      voiceRef.current = getPreferredVoice();
    };
  }, []);

  const part = parts[currentPartIndex];
  const format = part?.content?.format || "qa";
  const isLastPart = currentPartIndex === parts.length - 1;

  const speakText = useCallback((text, onEnd) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    if (voiceRef.current) utter.voice = voiceRef.current;
    utter.onend = () => onEnd?.();
    utter.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utter);
  }, []);

  const playQuestion = useCallback(
    (question) => {
      setPartPhase("question");
      if (question.audioUrl) {
        const audioEl = new Audio(question.audioUrl);
        audioElRef.current = audioEl;
        audioEl.onended = () => setPartPhase("ready");
        audioEl.onerror = () => setPartPhase("ready");
        audioEl.play().catch(() => setPartPhase("ready"));
      } else {
        speakText(question.text, () => setPartPhase("ready"));
      }
    },
    [speakText],
  );

  const startPart = () => {
    if (format === "cue-card") {
      setPartPhase("prep");
    } else {
      setCurrentQuestionIndex(0);
      playQuestion(part.content.questions[0]);
    }
  };

  const replayCurrentQuestion = () => {
    if (format === "qa") {
      playQuestion(part.content.questions[currentQuestionIndex]);
    }
  };

  const handleAnswerSaved = (url) => {
    const key =
      format === "cue-card"
        ? `${currentPartIndex}-cuecard`
        : `${currentPartIndex}-${currentQuestionIndex}`;
    setAnswers((a) => ({ ...a, [key]: url }));

    if (format === "cue-card") {
      setPartPhase("part-done");
      return;
    }

    const isLastQuestionInPart =
      currentQuestionIndex === part.content.questions.length - 1;
    if (isLastQuestionInPart) {
      setPartPhase("part-done");
    } else {
      setPartPhase("advancing");
      setTimeout(() => {
        const nextIdx = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIdx);
        playQuestion(part.content.questions[nextIdx]);
      }, 1200);
    }
  };

  const startNextPart = () => {
    setCurrentPartIndex((i) => i + 1);
    setCurrentQuestionIndex(0);
    setPartPhase("not-started");
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
      audioElRef.current?.pause();
    };
  }, []);

  if (!parts || parts.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton onClick={onBack} label="Back to Modules" />
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center text-slate-400 text-sm">
          No speaking questions have been added yet.
        </div>
      </div>
    );
  }

  const currentQuestion =
    format === "qa" ? part.content.questions[currentQuestionIndex] : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="mb-2">
            <BackButton onClick={onBack} label="Back to Modules" />
          </div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Speaking Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            {part.content.part || `Part ${currentPartIndex + 1}`}
          </h2>
        </div>
        <TimerBadge display={display} warn={timeLeft < 300} />
      </div>

      {ttsUnsupported && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-rose-600">
          <i className="ti ti-alert-circle flex-shrink-0" />
          Your browser doesn't support reading questions aloud — please read the
          question text instead.
        </div>
      )}

      {/* Part not started yet — explicit start gate, no autoplay */}
      {partPhase === "not-started" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
            <i className="ti ti-microphone" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-800">
              {part.content.part || `Part ${currentPartIndex + 1}`}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {part.content.instruction}
            </p>
            {format === "cue-card" && (
              <p className="text-xs text-slate-400 mt-2">
                You'll see the topic and notes, then record one continuous
                answer whenever you're ready.
              </p>
            )}
          </div>
          <button
            onClick={startPart}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all"
          >
            <i className="ti ti-player-play" />
            Start {part.content.part || `Part ${currentPartIndex + 1}`}
          </button>
        </div>
      )}

      {/* Cue card — student reads topic/notes, clicks Ready when they want to record */}
      {partPhase === "prep" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
            <i className="ti ti-notes" /> Cue Card
          </span>
          <p className="text-base font-bold text-slate-800">
            {part.content.cueCardTopic}
          </p>
          {part.content.cueCardNotes?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                You should say:
              </p>
              <ul className="flex flex-col gap-1.5">
                {part.content.cueCardNotes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">
                      •
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => setPartPhase("ready")}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl self-center transition-all"
          >
            <i className="ti ti-microphone" />
            Ready to Record
          </button>
        </div>
      )}

      {/* Q&A question playing / ready to record / advancing */}
      {format === "qa" &&
        ["question", "ready", "advancing"].includes(partPhase) &&
        currentQuestion && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
            {part.content.instruction && (
              <p className="text-xs text-slate-400">
                {part.content.instruction}
              </p>
            )}

            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  partPhase === "question"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <i
                  className={`ti ${partPhase === "question" ? "ti-volume text-lg animate-pulse" : "ti-message-circle text-lg"}`}
                />
              </div>
              {showQuestionText ? (
                <p className="text-base font-semibold text-slate-800 leading-relaxed pt-1.5">
                  {currentQuestion.text}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic pt-2.5">
                  Listen to the question — text hidden for this test
                </p>
              )}
            </div>

            {partPhase === "question" && (
              <p className="text-xs font-bold text-blue-500 flex items-center gap-1.5 pl-[52px]">
                <i className="ti ti-loader-2 animate-spin" />
                Playing question...
              </p>
            )}

            {partPhase === "ready" && (
              <div className="flex items-center gap-3 pl-[52px]">
                <RecordAnswer
                  key={`${currentPartIndex}-${currentQuestionIndex}`}
                  disabled={false}
                  onSaved={handleAnswerSaved}
                />
                <button
                  type="button"
                  onClick={replayCurrentQuestion}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <i className="ti ti-repeat text-sm" />
                  Replay question
                </button>
              </div>
            )}

            {partPhase === "advancing" && (
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 pl-[52px]">
                <i className="ti ti-circle-check-filled" />
                Answer saved — next question coming up...
              </p>
            )}
          </div>
        )}

      {/* Cue card ready to record */}
      {format === "cue-card" && partPhase === "ready" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
          <p className="text-base font-bold text-slate-800">
            {part.content.cueCardTopic}
          </p>
          {part.content.cueCardNotes?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">
                You should say:
              </p>
              <ul className="flex flex-col gap-1.5">
                {part.content.cueCardNotes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-700"
                  >
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">
                      •
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-slate-400">
            Speak for about{" "}
            {Math.round((part.content.speakSeconds || 120) / 60)} minute
            {part.content.speakSeconds >= 120 ? "s" : ""} — one continuous
            recording for this whole topic.
          </p>
          <RecordAnswer
            key={`${currentPartIndex}-cuecard`}
            disabled={false}
            onSaved={handleAnswerSaved}
          />
        </div>
      )}

      {/* Part finished — start next part or finish test */}
      {partPhase === "part-done" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-7 flex flex-col items-center text-center gap-4">
          <i className="ti ti-circle-check-filled text-emerald-500 text-3xl" />
          <p className="text-sm font-bold text-emerald-700">
            {part.content.part || `Part ${currentPartIndex + 1}`} complete
          </p>
          {isLastPart ? (
            <button
              onClick={() => setPartPhase("all-done")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all"
            >
              Finish Speaking Test <i className="ti ti-arrow-right text-sm" />
            </button>
          ) : (
            <button
              onClick={startNextPart}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 transition-all"
            >
              <i className="ti ti-player-play" />
              Start{" "}
              {parts[currentPartIndex + 1]?.content?.part ||
                `Part ${currentPartIndex + 2}`}
            </button>
          )}
        </div>
      )}

      {/* All parts finished */}
      {partPhase === "all-done" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <i className="ti ti-circle-check-filled text-emerald-500 text-2xl flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-700">
                All speaking parts answered!
              </p>
              <p className="text-xs text-emerald-600">
                Your recordings will be reviewed by an examiner.
              </p>
            </div>
          </div>
          <button
            onClick={() => onComplete("speaking", answers)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
          >
            Submit Speaking <i className="ti ti-arrow-right text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
