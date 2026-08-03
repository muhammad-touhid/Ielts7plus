"use client";

import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

export function QuillEditor({ value, onChange, placeholder }) {
  const [mounted, setMounted] = useState(false);
  const [ReactQuill, setReactQuill] = useState(null);

  useEffect(() => {
    import("react-quill-new").then((mod) => {
      setReactQuill(() => mod.default);
      setMounted(true);
    });
  }, []);

  if (!mounted || !ReactQuill) {
    return (
      <div className="h-64 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
        <p className="text-xs text-slate-400">Loading editor...</p>
      </div>
    );
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="quill-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        style={{ minHeight: "300px" }}
      />
      <style>{`
      .quill-wrapper .ql-editor {
        min-height: 200px;
        color: #1e293b !important;
        line-height: 1.7;
      }
      .quill-wrapper .ql-editor.ql-blank::before {
        color: #94a3b8;
        font-style: normal;
      }
    `}</style>
    </div>
  );
}
