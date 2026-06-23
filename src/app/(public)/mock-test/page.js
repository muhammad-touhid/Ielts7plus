"use client";

import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

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
    desc: "Complete Task 1 (report) and Task 2 (essay).",
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

const listeningQuestions = [
  {
    id: 1,
    text: "What is the name of the student who calls the accommodation office?",
    options: ["Sarah Mitchell", "James Cooper", "Emily Watson", "David Lee"],
    answer: null,
  },
  {
    id: 2,
    text: "What type of room does the student initially request?",
    options: [
      "Single room",
      "Double room",
      "Shared dormitory",
      "Studio apartment",
    ],
    answer: null,
  },
  {
    id: 3,
    text: "On which floor is the available room located?",
    options: ["Ground floor", "Second floor", "Third floor", "Fourth floor"],
    answer: null,
  },
  {
    id: 4,
    text: "How much is the weekly rent for the available room?",
    options: ["£85", "£95", "£105", "£115"],
    answer: null,
  },
  {
    id: 5,
    text: "What is included in the rent?",
    options: ["Meals only", "Bills only", "Meals and bills", "Internet only"],
    answer: null,
  },
];

const readingPassage = `The concept of emotional intelligence (EI) was popularised in the 1990s by psychologist Daniel Goleman, who argued that a person's ability to understand and manage their own emotions — and those of others — was as important as cognitive intelligence in determining success in life and work. Goleman identified five core components of emotional intelligence: self-awareness, self-regulation, motivation, empathy, and social skills.

Research conducted over the past three decades has produced mixed findings regarding the predictive power of EI. Several studies suggest that individuals with higher emotional intelligence perform better in leadership roles, demonstrate greater resilience under stress, and report higher levels of job satisfaction. However, critics argue that EI is difficult to measure reliably and that many EI assessments overlap significantly with existing personality frameworks such as the Big Five model.

Despite ongoing academic debate, emotional intelligence training programmes have been widely adopted in corporate settings. Multinational companies including Google, Amazon, and Unilever have invested substantially in EI-based leadership development, citing improvements in team cohesion, conflict resolution, and employee retention as key benefits.`;

const readingQuestions = [
  {
    id: 1,
    text: "Who popularised the concept of emotional intelligence in the 1990s?",
    options: ["Sigmund Freud", "Daniel Goleman", "Carl Jung", "Howard Gardner"],
    answer: null,
  },
  {
    id: 2,
    text: "How many core components of EI did Goleman identify?",
    options: ["Three", "Four", "Five", "Six"],
    answer: null,
  },
  {
    id: 3,
    text: "According to the passage, individuals with higher EI are more likely to:",
    options: [
      "Score higher in IQ tests",
      "Perform better in leadership roles",
      "Avoid workplace stress completely",
      "Reject corporate training programmes",
    ],
    answer: null,
  },
  {
    id: 4,
    text: "What do critics argue about EI assessments?",
    options: [
      "They are too expensive",
      "They are culturally biased",
      "They overlap with personality frameworks",
      "They are only useful for managers",
    ],
    answer: null,
  },
  {
    id: 5,
    text: "Which of the following companies is NOT mentioned in the passage?",
    options: ["Google", "Amazon", "Microsoft", "Unilever"],
    answer: null,
  },
];

const writingTasks = [
  {
    id: "task1",
    label: "Task 1",
    prompt:
      "The chart below shows the percentage of households in different income groups that owned at least one car in a European country between 1980 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.",
    minWords: 150,
    timeLabel: "20 minutes recommended",
  },
  {
    id: "task2",
    label: "Task 2",
    prompt:
      "Some people believe that the best way to improve road safety is to increase the minimum driving age to 21. Others feel that better driver education is the solution.\n\nDiscuss both views and give your own opinion.\n\nWrite at least 250 words.",
    minWords: 250,
    timeLabel: "40 minutes recommended",
  },
];

const speakingParts = [
  {
    part: "Part 1 — Introduction",
    instruction:
      "Answer these personal questions naturally. Aim for 2–3 sentences per answer.",
    questions: [
      "Can you tell me your full name and where you are from?",
      "Do you currently work or are you a student? Tell me about it.",
      "What do you enjoy doing in your free time?",
    ],
  },
  {
    part: "Part 2 — Cue Card",
    instruction:
      "You have one minute to prepare. Then speak for 1–2 minutes on the topic below.",
    questions: [
      "Describe a book or film that had a significant impact on you.\n\nYou should say:\n• what the book or film was\n• when you read or watched it\n• what it was about\n• and explain why it had such an impact on you.",
    ],
  },
  {
    part: "Part 3 — Discussion",
    instruction:
      "Discuss these broader questions in depth. Aim for 3–5 sentences per answer.",
    questions: [
      "Why do you think some books or films influence people more than others?",
      "How has the way people consume books and films changed in recent years?",
      "Do you think governments should fund the arts, including film and literature? Why or why not?",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wordCount(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

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

// ─── Shared UI ───────────────────────────────────────────────────────────────

function ProgressBar({ steps, current }) {
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
          {/* Badge */}
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5 mt-10">
            IELTS7+ Mock Test Portal
          </span>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            Test Your Skills. Track Your Progress.
          </h1>

          {/* Para */}
          <p className="text-blue-100 text-base leading-relaxed">
            Complete all four modules at your own pace, submit your responses,
            and receive a detailed band score report from our expert instructors
            — straight to your inbox.
          </p>
        </div>
      </section>
      <div className="container m-auto flex items-center gap-1 mt-10 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 transition-all ${i < current ? "bg-emerald-500 text-white" : i === current ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}
            >
              {i < current ? <i className="ti ti-check text-sm" /> : i + 1}
            </div>
            <span
              className={`hidden md:block text-xs font-semibold whitespace-nowrap ${i === current ? "text-blue-600" : "text-slate-400"}`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded-full ${i < current ? "bg-emerald-400" : "bg-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MCQBlock({ questions, answers, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      {questions.map((q, qi) => (
        <div
          key={q.id}
          className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
        >
          <p className="text-sm font-bold text-slate-700 mb-4">
            <span className="text-blue-600 mr-2">Q{qi + 1}.</span>
            {q.text}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {q.options.map((opt, oi) => {
              const letter = ["A", "B", "C", "D"][oi];
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={oi}
                  onClick={() => onChange(q.id, opt)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 ${selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {letter}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
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

// ─── Screens ─────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }) {
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
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-10 py-4 rounded-xl shadow-lg shadow-blue-900/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
          >
            <i className="ti ti-player-play text-base" />
            Start Mock Test
          </button>
        </div>
      </div>

      <div className="container m-auto">
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
          <i className="ti ti-info-circle text-blue-600 text-lg" />
          Instructions & Rules
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

function RegistrationScreen({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    targetBand: "",
  });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <div className="max-w-xl mx-auto">
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
            Continue to Module Selection
            <i className="ti ti-arrow-right text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ModuleSelectScreen({ completed, onSelect }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-500 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
          Step 2
        </span>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
          Select a Module
        </h2>
        <p className="text-slate-400 text-sm">
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
      {completed.length === modules.length && (
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

function ListeningScreen({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const { display, timeLeft } = useTimer(30 * 60, true);
  const answered = Object.keys(answers).length;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Listening Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Section 1 — Conversation
          </h2>
        </div>
        <TimerBadge display={display} warn={timeLeft < 300} />
      </div>
      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <i className="ti ti-player-play text-white text-xl" />
        </div>
        <div className="flex-1 w-full">
          <p className="text-white text-sm font-bold mb-2">
            Recording 1 — Accommodation Office Call
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
        Read the questions before listening. You will hear the recording once.
      </div>
      <MCQBlock
        questions={listeningQuestions}
        answers={answers}
        onChange={(id, val) => setAnswers((a) => ({ ...a, [id]: val }))}
      />
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <p className="text-sm text-slate-400">
          {answered} of {listeningQuestions.length} answered
        </p>
        <button
          onClick={() => onComplete("listening", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Listening
          <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}

function ReadingScreen({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const { display, timeLeft } = useTimer(60 * 60, true);
  const answered = Object.keys(answers).length;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Reading Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Passage 1 — Emotional Intelligence
          </h2>
        </div>
        <TimerBadge display={display} warn={timeLeft < 600} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Reading Passage
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {readingPassage}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Questions 1–5
          </h3>
          <MCQBlock
            questions={readingQuestions}
            answers={answers}
            onChange={(id, val) => setAnswers((a) => ({ ...a, [id]: val }))}
          />
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <p className="text-sm text-slate-400">
          {answered} of {readingQuestions.length} answered
        </p>
        <button
          onClick={() => onComplete("reading", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Reading
          <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}

function WritingScreen({ onComplete }) {
  const [answers, setAnswers] = useState({ task1: "", task2: "" });
  const [activeTask, setActiveTask] = useState(0);
  const { display, timeLeft } = useTimer(60 * 60, true);
  const task = writingTasks[activeTask];
  const wc = wordCount(answers[task.id]);
  const meetsMin = wc >= task.minWords;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Writing Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Academic Writing
          </h2>
        </div>
        <TimerBadge display={display} warn={timeLeft < 600} />
      </div>
      <div className="flex gap-2">
        {writingTasks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTask(i)}
            className={`text-sm font-bold px-5 py-2.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-2 ${activeTask === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
          >
            {t.label}
            {answers[t.id].trim() !== "" && (
              <i className="ti ti-circle-check-filled text-emerald-400 text-xs" />
            )}
          </button>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">
          <i className="ti ti-clock" />
          {task.timeLabel}
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {task.prompt}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <textarea
          rows={12}
          placeholder="Write your response here..."
          value={answers[task.id]}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, [task.id]: e.target.value }))
          }
          className="w-full bg-white text-slate-700 text-sm placeholder-slate-400 p-5 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between text-xs px-1">
          <span
            className={`font-bold ${meetsMin ? "text-emerald-500" : "text-slate-400"}`}
          >
            {wc} words {!meetsMin && `(minimum ${task.minWords})`}
          </span>
          {!meetsMin && (
            <span className="text-slate-400">
              {task.minWords - wc} more words needed
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <p className="text-sm text-slate-400">
          {[answers.task1, answers.task2].filter((a) => a.trim() !== "").length}{" "}
          of 2 tasks attempted
        </p>
        <button
          onClick={() => onComplete("writing", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Writing
          <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}

function SpeakingScreen({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [activePart, setActivePart] = useState(0);
  const { display, timeLeft } = useTimer(15 * 60, true);
  const part = speakingParts[activePart];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-2">
            Speaking Module
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Speaking Test
          </h2>
        </div>
        <TimerBadge display={display} warn={timeLeft < 300} />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 text-sm text-amber-700">
        <i className="ti ti-info-circle flex-shrink-0" />
        Type your spoken answers below. In the full version, you will record
        audio responses.
      </div>
      <div className="flex gap-2 flex-wrap">
        {speakingParts.map((p, i) => (
          <button
            key={i}
            onClick={() => setActivePart(i)}
            className={`text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all duration-200 ${activePart === i ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"}`}
          >
            Part {i + 1}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 mb-1">
            {part.part}
          </h3>
          <p className="text-xs text-slate-400">{part.instruction}</p>
        </div>
        <div className="w-full h-px bg-slate-100" />
        {part.questions.map((q, qi) => {
          const key = `${activePart}-${qi}`;
          return (
            <div key={qi} className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-slate-700 whitespace-pre-line">
                <span className="text-blue-600 font-bold mr-1">Q{qi + 1}.</span>
                {q}
              </p>
              <textarea
                rows={4}
                placeholder="Type your spoken response here..."
                value={answers[key] || ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [key]: e.target.value }))
                }
                className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 p-4 rounded-xl border-2 border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex gap-2">
          {activePart > 0 && (
            <button
              onClick={() => setActivePart((p) => p - 1)}
              className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-600 text-sm font-bold px-5 py-3 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
            >
              <i className="ti ti-arrow-left text-sm" />
              Previous
            </button>
          )}
          {activePart < speakingParts.length - 1 && (
            <button
              onClick={() => setActivePart((p) => p + 1)}
              className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-bold px-5 py-3 rounded-xl hover:bg-slate-200 transition-all duration-200"
            >
              Next Part
              <i className="ti ti-arrow-right text-sm" />
            </button>
          )}
        </div>
        <button
          onClick={() => onComplete("speaking", answers)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          Submit Speaking
          <i className="ti ti-arrow-right text-sm" />
        </button>
      </div>
    </div>
  );
}

function SubmitScreen({ student, completed }) {
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
        <h3 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
          <i className="ti ti-list-check text-blue-600" />
          Modules Submitted
        </h3>
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
        <i className="ti ti-home text-base" />
        Back to Home
      </a>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STEPS = ["Overview", "Registration", "Modules", "Test", "Submit"];

export default function MockTestPage() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    try {
      const res = await fetch("/api/mock-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          phone: student.phone,
          targetBand: student.targetBand,
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
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {step === 0 && <LandingScreen onStart={() => setStep(1)} />}
      {step > 0 && step < 4 && <ProgressBar steps={STEPS} current={step} />}
      <div className="container mx-auto px-5 py-12">
        {step === 1 && <RegistrationScreen onSubmit={handleRegister} />}
        {step === 2 && (
          <div className="flex flex-col gap-8">
            <ModuleSelectScreen
              completed={completed}
              onSelect={handleModuleSelect}
              onSubmit={handleSubmit}
              submitting={submitting}
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
        )}
        {step === 3 && activeModule === "listening" && (
          <ListeningScreen onComplete={handleModuleComplete} />
        )}
        {step === 3 && activeModule === "reading" && (
          <ReadingScreen onComplete={handleModuleComplete} />
        )}
        {step === 3 && activeModule === "writing" && (
          <WritingScreen onComplete={handleModuleComplete} />
        )}
        {step === 3 && activeModule === "speaking" && (
          <SpeakingScreen onComplete={handleModuleComplete} />
        )}
        {step === 4 && <SubmitScreen student={student} completed={completed} />}
      </div>
    </main>
  );
}
