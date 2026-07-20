"use client";

import { useState } from "react";

export default function SpeakingMarkInput({
  submissionId,
  answerKey,
  initialBand,
  initialNotes,
}) {
  const [band, setBand] = useState(initialBand || "");
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(
        `/api/mock-tests/${submissionId}/speaking-marks`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: answerKey, band, notes }),
        },
      );
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-lg border border-slate-200 p-3">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        Examiner Mark
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Band (e.g. 6.5)"
          value={band}
          onChange={(e) => setBand(e.target.value)}
          className="w-28 text-xs px-2.5 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-400"
        />
        <input
          type="text"
          placeholder="Notes on fluency, pronunciation, grammar..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="flex-1 min-w-[200px] text-xs px-2.5 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-400"
        />
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <i className="ti ti-loader-2 animate-spin text-sm" />
          ) : saved ? (
            <i className="ti ti-check text-sm" />
          ) : (
            "Save"
          )}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
