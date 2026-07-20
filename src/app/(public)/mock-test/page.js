"use client";

import { useState, useEffect, useRef } from "react";
import ListeningScreen from "./ListeningScreen";
import ReadingScreen from "./ReadingScreen";
import WritingScreen from "./WritingScreen";
import SpeakingScreen from "./SpeakingScreen";

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

function ProgressBar({ steps, current, onBack }) {
  return (
    <div>
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-16 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5 mt-10">
            IELTS7+ Mock Test Portal
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            Test Your Skills. Track Your Progress.
          </h1>
          <p className="text-blue-100 text-base leading-relaxed">
            Complete all four modules at your own pace, submit your responses,
            and receive a detailed band score report from our expert instructors
            — straight to your inbox.
          </p>
        </div>
      </section>

      {/* Steps bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => i < current && i > 0 && onBack(i)}
                  disabled={i >= current}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    i < current
                      ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                      : i === current
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-400 cursor-default"
                  }`}
                >
                  {i < current ? <i className="ti ti-check text-sm" /> : i + 1}
                </button>
                <span
                  className={`hidden sm:block text-xs font-semibold whitespace-nowrap ${
                    i === current
                      ? "text-blue-600"
                      : i < current
                        ? "text-emerald-500"
                        : "text-slate-400"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-10 sm:w-16 h-0.5 mx-1 mb-5 rounded-full transition-all duration-300 ${
                    i < current ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimerBadge({ display, warn }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
        warn ? "bg-rose-100 text-rose-600" : "bg-blue-50 text-blue-600"
      }`}
    >
      <i className={`ti ti-clock text-base ${warn ? "animate-pulse" : ""}`} />
      {display}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <i className="ti ti-loader-2 animate-spin text-blue-600 text-4xl" />
        <p className="text-slate-400 text-sm">Loading questions...</p>
      </div>
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

function LandingScreen({ onStart }) {
  const modules = [
    {
      id: "listening",
      label: "Listening",
      icon: "ti ti-headphones",
      duration: "30 min",
      questions: 40,
      desc: "Listen to four recordings and answer 40 questions.",
    },
    {
      id: "reading",
      label: "Reading",
      icon: "ti ti-book",
      duration: "60 min",
      questions: 40,
      desc: "Read three passages and answer 40 questions.",
    },
    {
      id: "writing",
      label: "Writing",
      icon: "ti ti-pencil",
      duration: "60 min",
      questions: 2,
      desc: "Complete Task 1 and Task 2 writing tasks.",
    },
    {
      id: "speaking",
      label: "Speaking",
      icon: "ti ti-microphone",
      duration: "15 min",
      questions: 3,
      desc: "Answer questions across three parts.",
    },
  ];
  return (
    <div className="flex flex-col gap-10">
      <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden p-10 md:p-14 text-center">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mt-10 mb-5">
            Free Mock Test
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            IELTS Full Mock Test
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-xl mx-auto mb-8">
            Simulate the real IELTS exam experience. Complete all four modules,
            get evaluated by our experts, and receive your detailed score report
            by email.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-white text-blue-600 text-sm font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-900/30 hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="ti ti-player-play text-base" /> Start Mock Test
          </button>
        </div>
      </div>
      <div className="container m-auto px-5">
        <h2 className="text-3xl font-bold text-gray-700 mb-5">
          What is Included
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                <i className={m.icon} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {m.label}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <i className="ti ti-clock text-blue-400" />
                  {m.duration}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <i className="ti ti-list text-blue-400" />
                  {m.questions} Qs
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 container m-auto">
        <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <i className="ti ti-info-circle text-blue-600 text-lg" /> Instructions
          & Rules
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Ensure you have a stable internet connection throughout the test.",
            "Use headphones for the Listening module for the best experience.",
            "Do not refresh or close the page — your progress may be lost.",
            "Complete all modules before submitting to receive a full score report.",
            "Your answers will be evaluated and emailed within 24–48 hours.",
            "Each module has a recommended time limit — manage your time carefully.",
          ].map((rule, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <i className="ti ti-circle-check-filled text-emerald-500 text-base mt-0.5 flex-shrink-0" />
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RegistrationScreen({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    targetBand: "",
    testType: "academic",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4">
        <BackButton onClick={onBack} label="Back to Overview" />
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
        <div className="mb-8">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
            Step 1
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
            Your Details
          </h2>
          <p className="text-slate-400 text-sm">
            We will send your result report to the email address below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Test Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["academic", "general"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, testType: type }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${form.testType === type ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`}
                >
                  <i
                    className={`ti ${type === "academic" ? "ti-school" : "ti-briefcase"} text-2xl ${form.testType === type ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <div className="text-center">
                    <p
                      className={`text-sm font-extrabold capitalize ${form.testType === type ? "text-blue-700" : "text-slate-600"}`}
                    >
                      {type}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {type === "academic"
                        ? "University / immigration"
                        : "Work / secondary education"}
                    </p>
                  </div>
                  {form.testType === type && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-1">
              <p className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                <i className="ti ti-info-circle text-blue-500" />
                {form.testType === "academic"
                  ? "Academic"
                  : "General Training"}{" "}
                — What's different:
              </p>
              <ul className="flex flex-col gap-1.5">
                {form.testType === "academic" ? (
                  <>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check-filled text-blue-400 mt-0.5 flex-shrink-0" />
                      Reading: Complex academic texts from journals & books
                    </li>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check-filled text-blue-400 mt-0.5 flex-shrink-0" />
                      Writing Task 1: Describe a graph, chart, or diagram
                    </li>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check text-slate-300 mt-0.5 flex-shrink-0" />
                      Listening & Speaking: Same as General
                    </li>
                  </>
                ) : (
                  <>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check-filled text-emerald-400 mt-0.5 flex-shrink-0" />
                      Reading: Practical texts — notices, ads, workplace docs
                    </li>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check-filled text-emerald-400 mt-0.5 flex-shrink-0" />
                      Writing Task 1: Write a formal or informal letter
                    </li>
                    <li className="text-xs text-slate-500 flex items-start gap-1.5">
                      <i className="ti ti-circle-check text-slate-300 mt-0.5 flex-shrink-0" />
                      Listening & Speaking: Same as Academic
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {[
            {
              name: "name",
              label: "Full Name",
              icon: "ti ti-user",
              placeholder: "Your full name",
              type: "text",
            },
            {
              name: "email",
              label: "Email Address",
              icon: "ti ti-mail",
              placeholder: "your@email.com",
              type: "email",
            },
            {
              name: "phone",
              label: "Phone Number",
              icon: "ti ti-phone",
              placeholder: "+880 1700-000000",
              type: "tel",
            },
          ].map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {f.label} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <i
                  className={`${f.icon} absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none`}
                />
                <input
                  type={f.type}
                  name={f.name}
                  required
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Target Band Score
            </label>
            <div className="relative">
              <i className="ti ti-target absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
              <select
                name="targetBand"
                value={form.targetBand}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-700 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select target band (optional)</option>
                {["6.0", "6.5", "7.0", "7.5", "8.0", "8.5+"].map((b) => (
                  <option key={b} value={b}>
                    Band {b}
                  </option>
                ))}
              </select>
              <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 mt-2"
          >
            Continue to Module Selection{" "}
            <i className="ti ti-arrow-right text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ModuleSelectScreen({ completed, onSelect, testType, onBack }) {
  const modules = [
    {
      id: "listening",
      label: "Listening",
      icon: "ti ti-headphones",
      duration: "30 min",
      questions: 40,
      desc: "Listen to recordings and answer 40 questions. Same for both test types.",
    },
    {
      id: "reading",
      label: "Reading",
      icon: "ti ti-book",
      duration: "60 min",
      questions: 40,
      desc:
        testType === "academic"
          ? "Read academic texts and answer 40 questions."
          : "Read practical texts and answer 40 questions.",
    },
    {
      id: "writing",
      label: "Writing",
      icon: "ti ti-pencil",
      duration: "60 min",
      questions: 2,
      desc:
        testType === "academic"
          ? "Task 1: Describe a graph/chart. Task 2: Essay."
          : "Task 1: Write a letter. Task 2: Essay.",
    },
    {
      id: "speaking",
      label: "Speaking",
      icon: "ti ti-microphone",
      duration: "15 min",
      questions: 3,
      desc: "Answer questions across three parts. Same for both test types.",
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-4">
          <BackButton onClick={onBack} label="Back to Registration" />
        </div>
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-500 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
          Step 2
        </span>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-extrabold text-slate-800">
            Select a Module
          </h2>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${testType === "academic" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            <i
              className={`ti ${testType === "academic" ? "ti-school" : "ti-briefcase"} mr-1`}
            />
            {testType}
          </span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Complete the modules in any order. Completed modules are marked in
          green.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {modules.map((m) => {
          const done = completed.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => !done && onSelect(m.id)}
              disabled={done}
              className={`flex items-center gap-5 p-7 rounded-2xl border-2 text-left transition-all duration-200 ${done ? "border-emerald-200 bg-emerald-50 cursor-default" : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${done ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
              >
                <i className={done ? "ti ti-circle-check" : m.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-extrabold text-slate-800">
                    {m.label}
                  </h3>
                  {done && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2">{m.desc}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="ti ti-clock text-blue-400" />
                    {m.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ti ti-list text-blue-400" />
                    {m.questions} questions
                  </span>
                </div>
              </div>
              {!done && (
                <i className="ti ti-arrow-right text-slate-300 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {completed.length === 4 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
          <i className="ti ti-circle-check-filled text-emerald-500 text-2xl flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-700">
              All modules completed!
            </p>
            <p className="text-xs text-emerald-600">
              Click the submit button below to send your responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function SubmitScreen({ student, completed }) {
  const modules = [
    { id: "listening", label: "Listening", icon: "ti ti-headphones" },
    { id: "reading", label: "Reading", icon: "ti ti-book" },
    { id: "writing", label: "Writing", icon: "ti ti-pencil" },
    { id: "speaking", label: "Speaking", icon: "ti ti-microphone" },
  ];
  return (
    <div className="max-w-xl mx-auto mt-12 text-center flex flex-col items-center gap-6">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl text-emerald-500">
        <i className="ti ti-circle-check" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
          Test Submitted!
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          Well done,{" "}
          <span className="font-bold text-slate-700">{student?.name}</span>!
          Your responses have been submitted. Our expert evaluators will review
          your answers and send your detailed band score report to:
        </p>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-bold px-5 py-2.5 rounded-xl border border-blue-100 mt-3">
          <i className="ti ti-mail text-base" />
          {student?.email}
        </div>
      </div>
      <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
            <i className="ti ti-list-check text-blue-600" /> Modules Submitted
          </h3>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${student?.testType === "academic" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            <i
              className={`ti ${student?.testType === "academic" ? "ti-school" : "ti-briefcase"} mr-1`}
            />
            {student?.testType}
          </span>
        </div>
        <ul className="flex flex-col gap-3">
          {modules.map((m) => {
            const done = completed.includes(m.id);
            return (
              <li
                key={m.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-slate-600">
                  <i className={`${m.icon} text-blue-500`} />
                  {m.label}
                </span>
                {done ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    <i className="ti ti-circle-check-filled" />
                    Submitted
                  </span>
                ) : (
                  <span className="text-slate-300 text-xs">Not attempted</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700 text-left w-full flex gap-3">
        <i className="ti ti-clock text-blue-500 text-base flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold mb-1">Result Delivery: 24–48 Hours</p>
          <p className="text-xs text-blue-500 leading-relaxed">
            Your detailed band score report including module-wise breakdown,
            strengths, areas to improve, and personalised study recommendations
            will be emailed to you shortly.
          </p>
        </div>
      </div>
      <a
        href="/"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
      >
        <i className="ti ti-home text-base" /> Back to Home
      </a>
    </div>
  );
}

const STEPS = ["Overview", "Register", "Modules", "Test", "Submit"];

export default function MockTestPage() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [mockTestSettings, setMockTestSettings] = useState(null);

  const testType = student?.testType || "academic";

  useEffect(() => {
    if (step === 2 && !questions && student) {
      setLoadingQuestions(true);
      fetch(`/api/mock-test-questions?testType=${testType}`)
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data);
          setLoadingQuestions(false);
        })
        .catch(() => setLoadingQuestions(false));
    }
  }, [step, questions, student, testType]);

  // Fetch listening section-lock / audio-lock behavior once, alongside questions.
  useEffect(() => {
    if (step === 2 && !mockTestSettings) {
      fetch("/api/mock-test-settings", { cache: "no-store" })
        .then((res) => res.json())
        .then(setMockTestSettings)
        .catch(() =>
          setMockTestSettings({ sectionLocked: false, audioLocked: false }),
        );
    }
  }, [step, mockTestSettings]);

  // All listening question types, grouped into 4 sections by ListeningScreen
  const listeningQuestions =
    questions?.filter((q) => q.module === "listening") ?? [];
  // All reading question types (passage + 7 question types), grouped into
  // 3 passages by ReadingScreen
  const readingQuestions =
    questions?.filter((q) => q.module === "reading") ?? [];
  const writingTasks =
    questions?.filter((q) => q.module === "writing" && q.type === "task") ?? [];
  const speakingParts =
    questions?.filter((q) => q.module === "speaking" && q.type === "part") ??
    [];

  const handleRegister = (data) => {
    setStudent(data);
    setStep(2);
  };
  const handleModuleSelect = (id) => {
    setActiveModule(id);
    setStep(3);
  };
  const handleModuleComplete = (id, data) => {
    setAnswers((a) => ({ ...a, [id]: data }));
    setCompleted((c) => [...new Set([...c, id])]);
    setActiveModule(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/mock-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          phone: student.phone,
          targetBand: student.targetBand,
          testType: student.testType,
          completedModules: completed,
          answers: answers,
        }),
      });
      if (res.ok) {
        setStep(4);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = (targetStep) => {
    if (targetStep !== undefined) {
      setStep(targetStep);
      return;
    }
    if (step === 3) {
      setActiveModule(null);
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {step === 0 && <LandingScreen onStart={() => setStep(1)} />}
      {step > 0 && step < 4 && (
        <ProgressBar steps={STEPS} current={step} onBack={handleBack} />
      )}
      <div className="container mx-auto px-5 py-12">
        {step === 1 && (
          <RegistrationScreen
            onSubmit={handleRegister}
            onBack={() => handleBack()}
          />
        )}
        {step === 2 &&
          (loadingQuestions ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col gap-8">
              <ModuleSelectScreen
                completed={completed}
                onSelect={handleModuleSelect}
                testType={testType}
                onBack={() => handleBack()}
              />
              {completed.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 transition-all duration-200"
                  >
                    {submitting ? (
                      <>
                        <i className="ti ti-loader-2 animate-spin text-base" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-send text-base" />
                        Submit All & Get Results
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* ✅ ListeningScreen handles all 6 question types across 4 sections */}
        {step === 3 && activeModule === "listening" && (
          <ListeningScreen
            onComplete={handleModuleComplete}
            onBack={() => handleBack()}
            questions={listeningQuestions}
            settings={mockTestSettings}
          />
        )}
        {step === 3 && activeModule === "reading" && (
          <ReadingScreen
            onComplete={handleModuleComplete}
            onBack={() => handleBack()}
            questions={readingQuestions}
            testType={testType}
          />
        )}
        {step === 3 && activeModule === "writing" && (
          <WritingScreen
            onComplete={handleModuleComplete}
            onBack={() => handleBack()}
            tasks={writingTasks}
            testType={testType}
          />
        )}
        {step === 3 && activeModule === "speaking" && (
          <SpeakingScreen
            onComplete={handleModuleComplete}
            onBack={() => handleBack()}
            parts={speakingParts}
            settings={mockTestSettings}
          />
        )}
        {step === 4 && <SubmitScreen student={student} completed={completed} />}
      </div>
    </main>
  );
}
