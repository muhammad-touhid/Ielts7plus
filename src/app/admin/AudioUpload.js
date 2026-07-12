"use client";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export default function AudioUpload({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [localFileName, setLocalFileName] = useState(null);
  const [error, setError] = useState("");

  const { startUpload } = useUploadThing("audioUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        onChange(res[0].ufsUrl);
        setLocalFileName(null);
        setError("");
      }
      setUploading(false);
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
      setLocalFileName(null);
      setUploading(false);
    },
  });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check before uploading
    if (file.size > 16 * 1024 * 1024) {
      setError("File size exceeds 16MB. Please choose a smaller audio file.");
      return;
    }

    setError("");
    setLocalFileName(file.name);
    setUploading(true);
    await startUpload([file]);
  }

  function handleRemove() {
    setLocalFileName(null);
    onChange("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-xl border border-slate-200 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <i className="ti ti-music text-blue-500" />
              {uploading ? "Uploading..." : "Audio uploaded"}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="w-7 h-7 rounded-lg bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all flex-shrink-0"
            >
              <i className="ti ti-x text-xs" />
            </button>
          </div>
          <audio src={value} controls className="w-full h-9" />
          {uploading && (
            <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
              <i className="ti ti-loader-2 animate-spin text-blue-500 text-xl" />
            </div>
          )}
        </div>
      ) : (
        <label
          className={`w-full rounded-xl border-2 border-dashed transition-all px-4 py-6
          ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"}
          ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="w-full flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <i className="ti ti-loader-2 animate-spin text-blue-500 text-2xl" />
                <p className="text-xs text-slate-400">
                  Uploading {localFileName}...
                </p>
              </>
            ) : (
              <>
                <i
                  className={`ti ti-cloud-upload text-2xl ${error ? "text-rose-300" : "text-slate-300"}`}
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600">
                    Click to upload audio
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    MP3, WAV, M4A up to 16MB
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-200 px-4 py-3 rounded-xl">
          <i className="ti ti-alert-circle flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Or paste URL */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400">or paste URL</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => {
          onChange(e.target.value);
          setError("");
        }}
        placeholder="https://example.com/section-1.mp3"
        className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  );
}
