"use client";

import { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";

/**
 * Records the student's spoken answer via the mic, then uploads it and
 * calls onSaved(url) once done. No playback controls for the student here —
 * this mirrors the real exam, where you don't get to hear yourself back.
 */
export default function RecordAnswer({ onSaved, disabled }) {
  const [status, setStatus] = useState("idle"); // idle | recording | uploading | done | error
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const { startUpload } = useUploadThing("speakingRecordingUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        setStatus("done");
        onSaved(res[0].ufsUrl);
      } else {
        setStatus("error");
        setError("Upload finished but no file URL was returned.");
      }
    },
    onUploadError: (err) => {
      console.error("Recording upload error:", err);
      setStatus("error");
      setError(err.message || "Upload failed. Please try again.");
    },
  });

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        clearInterval(intervalRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `answer-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        setStatus("uploading");
        await startUpload([file]);
      };

      recorder.start();
      setStatus("recording");
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error("Mic access error:", err);
      setStatus("error");
      setError(
        "Couldn't access your microphone. Please allow mic permission and try again.",
      );
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={startRecording}
        disabled={disabled}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all"
      >
        <i className="ti ti-microphone text-base" />
        Start Recording Answer
      </button>
    );
  }

  if (status === "recording") {
    return (
      <button
        type="button"
        onClick={stopRecording}
        className="inline-flex items-center gap-3 bg-rose-600 text-white text-sm font-bold px-6 py-3.5 rounded-xl animate-pulse"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white" />
        Recording... {mm}:{ss} — Tap to Stop
      </button>
    );
  }

  if (status === "uploading") {
    return (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2 bg-slate-300 text-white text-sm font-bold px-6 py-3.5 rounded-xl cursor-not-allowed"
      >
        <i className="ti ti-loader-2 animate-spin text-base" />
        Saving your answer...
      </button>
    );
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold px-6 py-3.5">
        <i className="ti ti-circle-check-filled text-base" />
        Answer recorded
      </div>
    );
  }

  // error
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl">
        <i className="ti ti-alert-circle flex-shrink-0" />
        {error}
      </div>
      <button
        type="button"
        onClick={() => setStatus("idle")}
        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-6 py-3 rounded-xl self-start"
      >
        <i className="ti ti-refresh text-base" />
        Try Again
      </button>
    </div>
  );
}
