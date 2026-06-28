"use client";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [error, setError] = useState("");

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        onChange(res[0].ufsUrl);
        setLocalPreview(null);
        setError("");
      }
      setUploading(false);
    },
    onUploadError: (err) => {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed. Please try again.");
      setLocalPreview(null);
      setUploading(false);
    },
  });

  const displayImage = localPreview || value || "";

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size check before uploading
    if (file.size > 4 * 1024 * 1024) {
      setError("File size exceeds 4MB. Please choose a smaller image.");
      return;
    }

    setError("");
    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    await startUpload([file]);
  }

  function handleRemove() {
    setLocalPreview(null);
    onChange("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-3">
      {displayImage ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={displayImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-all"
          >
            <i className="ti ti-x text-sm" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <i className="ti ti-loader-2 animate-spin text-white text-2xl" />
            </div>
          )}
        </div>
      ) : (
        <label
          className={`w-full h-48 rounded-xl border-2 border-dashed transition-all
          ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"}
          ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            {uploading ? (
              <>
                <i className="ti ti-loader-2 animate-spin text-blue-500 text-2xl" />
                <p className="text-xs text-slate-400">Uploading...</p>
              </>
            ) : (
              <>
                <i
                  className={`ti ti-cloud-upload text-3xl ${error ? "text-rose-300" : "text-slate-300"}`}
                />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600">
                    Click to upload image
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG, JPG, WEBP up to 4MB
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      )}

      {/* Error message */}
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
        placeholder="https://example.com/image.jpg"
        className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  );
}
