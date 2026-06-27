"use client";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const { startUpload } = useUploadThing("imageUploader");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const res = await startUpload([file]);
      if (res?.[0]?.url) {
        setPreview(res[0].url);
        onChange(res[0].url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview("");
    onChange("");
  }

  return (
    <div className="flex flex-col gap-3">
      {preview ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={preview}
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
          className={`w-full h-48 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all ${uploading ? "pointer-events-none opacity-50" : ""}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          {uploading ? (
            <>
              <i className="ti ti-loader-2 animate-spin text-blue-500 text-2xl" />
              <p className="text-xs text-slate-400">Uploading...</p>
            </>
          ) : (
            <>
              <i className="ti ti-cloud-upload text-slate-300 text-3xl" />
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
        </label>
      )}

      {/* Or paste URL manually */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-xs text-slate-400">or paste URL</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <input
        type="text"
        value={preview}
        onChange={(e) => {
          setPreview(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="https://example.com/image.jpg"
        className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
      />
    </div>
  );
}
