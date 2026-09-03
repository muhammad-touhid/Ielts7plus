"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FormLabelFilter({ labels }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("formLabel") || "";

  function handleChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("formLabel", value);
    } else {
      params.delete("formLabel");
    }
    router.push(`/admin/form-submissions?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-slate-600 font-semibold focus:outline-none focus:border-blue-400"
    >
      <option value="">All Forms</option>
      <option value="__none__">(No Label)</option>
      {labels.map((label) => (
        <option key={label} value={label}>
          {label}
        </option>
      ))}
    </select>
  );
}
