"use client";

import { useState, useMemo } from "react";

// Listening: same table for Academic & General Training
const LISTENING_TABLE = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 11, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 0, band: 0 },
];

// Reading: Academic table
const READING_ACADEMIC_TABLE = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 0, band: 0 },
];

// Reading: General Training table (needs more correct answers per band)
const READING_GT_TABLE = [
  { min: 40, band: 9 },
  { min: 39, band: 8.5 },
  { min: 37, band: 8 },
  { min: 36, band: 7.5 },
  { min: 34, band: 7 },
  { min: 32, band: 6.5 },
  { min: 30, band: 6 },
  { min: 27, band: 5.5 },
  { min: 23, band: 5 },
  { min: 19, band: 4.5 },
  { min: 15, band: 4 },
  { min: 12, band: 3.5 },
  { min: 9, band: 3 },
  { min: 6, band: 2.5 },
  { min: 0, band: 0 },
];

function rawToBand(raw, table) {
  if (raw === "" || raw === null || isNaN(raw)) return null;
  const n = Math.max(0, Math.min(40, Number(raw)));
  const match = table.find((row) => n >= row.min);
  return match ? match.band : 0;
}

function roundOverall(avg) {
  const remainder = avg % 1;
  if (remainder === 0 || remainder === 0.5) return avg;
  if (remainder < 0.25) return Math.floor(avg);
  if (remainder < 0.75) return Math.floor(avg) + 0.5;
  return Math.ceil(avg);
}

const BAND_OPTIONS = Array.from({ length: 19 }, (_, i) =>
  (i * 0.5).toFixed(1),
).map(Number); // 0 - 9

function ScoreInputCard({
  icon,
  title,
  description,
  mode,
  onModeChange,
  supportsRaw,
  rawValue,
  onRawChange,
  bandValue,
  onBandChange,
  computedBand,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <i className={`${icon} text-blue-600 text-xl`} />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {supportsRaw && (
        <div className="flex bg-slate-100 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => onModeChange("raw")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "raw"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Raw Score
          </button>
          <button
            onClick={() => onModeChange("band")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "band"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Direct Band
          </button>
        </div>
      )}

      {mode === "raw" ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Correct Answers (out of 40)
          </label>
          <input
            type="number"
            min={0}
            max={40}
            value={rawValue}
            onChange={(e) => onRawChange(e.target.value)}
            placeholder="e.g. 32"
            className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Band Score
          </label>
          <select
            value={bandValue}
            onChange={(e) => onBandChange(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">Select band</option>
            {BAND_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">Band Score</span>
        <span className="text-2xl font-extrabold text-blue-600">
          {computedBand !== null ? computedBand.toFixed(1) : "—"}
        </span>
      </div>
    </div>
  );
}

export default function BandCalculatorPage() {
  const [testType, setTestType] = useState("academic"); // academic | general

  const [listeningMode, setListeningMode] = useState("raw");
  const [listeningRaw, setListeningRaw] = useState("");
  const [listeningBand, setListeningBand] = useState("");

  const [readingMode, setReadingMode] = useState("raw");
  const [readingRaw, setReadingRaw] = useState("");
  const [readingBand, setReadingBand] = useState("");

  const [writingBand, setWritingBand] = useState("");
  const [speakingBand, setSpeakingBand] = useState("");

  const readingTable =
    testType === "academic" ? READING_ACADEMIC_TABLE : READING_GT_TABLE;

  const listeningComputed =
    listeningMode === "raw"
      ? rawToBand(listeningRaw, LISTENING_TABLE)
      : listeningBand !== ""
        ? Number(listeningBand)
        : null;

  const readingComputed =
    readingMode === "raw"
      ? rawToBand(readingRaw, readingTable)
      : readingBand !== ""
        ? Number(readingBand)
        : null;

  const writingComputed = writingBand !== "" ? Number(writingBand) : null;
  const speakingComputed = speakingBand !== "" ? Number(speakingBand) : null;

  const allFilled =
    listeningComputed !== null &&
    readingComputed !== null &&
    writingComputed !== null &&
    speakingComputed !== null;

  const overall = useMemo(() => {
    if (!allFilled) return null;
    const avg =
      (listeningComputed +
        readingComputed +
        writingComputed +
        speakingComputed) /
      4;
    return roundOverall(avg);
  }, [
    allFilled,
    listeningComputed,
    readingComputed,
    writingComputed,
    speakingComputed,
  ]);

  const handleReset = () => {
    setListeningRaw("");
    setListeningBand("");
    setReadingRaw("");
    setReadingBand("");
    setWritingBand("");
    setSpeakingBand("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-20 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            Free Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            IELTS Band Score Calculator
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mt-3">
            Estimate your overall IELTS band score from your Listening, Reading,
            Writing, and Speaking results.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Test type toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-1.5 flex text-sm font-bold">
            <button
              onClick={() => setTestType("academic")}
              className={`px-6 py-2.5 rounded-lg transition-all ${
                testType === "academic"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setTestType("general")}
              className={`px-6 py-2.5 rounded-lg transition-all ${
                testType === "general"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              General Training
            </button>
          </div>
        </div>

        {/* Input cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <ScoreInputCard
            icon="ti ti-headphones"
            title="Listening"
            description="40 questions, same for both test types"
            mode={listeningMode}
            onModeChange={setListeningMode}
            supportsRaw
            rawValue={listeningRaw}
            onRawChange={setListeningRaw}
            bandValue={listeningBand}
            onBandChange={setListeningBand}
            computedBand={listeningComputed}
          />
          <ScoreInputCard
            icon="ti ti-book"
            title="Reading"
            description={`40 questions, ${
              testType === "academic" ? "Academic" : "General Training"
            } conversion`}
            mode={readingMode}
            onModeChange={setReadingMode}
            supportsRaw
            rawValue={readingRaw}
            onRawChange={setReadingRaw}
            bandValue={readingBand}
            onBandChange={setReadingBand}
            computedBand={readingComputed}
          />
          <ScoreInputCard
            icon="ti ti-pencil"
            title="Writing"
            description="Examiner-assessed, enter your estimated band"
            mode="band"
            supportsRaw={false}
            bandValue={writingBand}
            onBandChange={setWritingBand}
            computedBand={writingComputed}
          />
          <ScoreInputCard
            icon="ti ti-microphone"
            title="Speaking"
            description="Examiner-assessed, enter your estimated band"
            mode="band"
            supportsRaw={false}
            bandValue={speakingBand}
            onBandChange={setSpeakingBand}
            computedBand={speakingComputed}
          />
        </div>

        {/* Overall result */}
        <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-3xl overflow-hidden p-8 sm:p-10 text-center">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
              Your Estimated Overall Band Score
            </p>
            <p className="text-6xl sm:text-7xl font-extrabold text-white mb-3">
              {overall !== null ? overall.toFixed(1) : "—"}
            </p>
            <p className="text-blue-100 text-sm max-w-md mx-auto">
              {allFilled
                ? "This is the average of your four section bands, rounded per official IELTS rules."
                : "Fill in all four sections above to see your estimated overall band score."}
            </p>

            {allFilled && (
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-white/20 transition-all"
              >
                <i className="ti ti-refresh" />
                Calculate Again
              </button>
            )}
          </div>
        </div>

        {/* Section breakdown when filled */}
        {allFilled && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              {
                label: "Listening",
                value: listeningComputed,
                icon: "ti ti-headphones",
              },
              { label: "Reading", value: readingComputed, icon: "ti ti-book" },
              {
                label: "Writing",
                value: writingComputed,
                icon: "ti ti-pencil",
              },
              {
                label: "Speaking",
                value: speakingComputed,
                icon: "ti ti-microphone",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center"
              >
                <i className={`${item.icon} text-blue-400 text-lg`} />
                <p className="text-xs text-slate-400 mt-1">{item.label}</p>
                <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                  {item.value.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="mt-10 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
          <i className="ti ti-info-circle text-amber-500 text-lg flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 leading-relaxed">
            This calculator gives an estimate based on official IELTS averaging
            and rounding rules. Raw-to-band conversions can vary by 1–2 marks
            between test versions. For your official result, always refer to
            your Test Report Form (TRF).
          </p>
        </div>
      </div>
    </div>
  );
}
