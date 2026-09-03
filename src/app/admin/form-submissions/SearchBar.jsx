"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  function runSearch(nextValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextValue.trim()) {
      params.set("q", nextValue.trim());
    } else {
      params.delete("q");
    }
    router.push(`/admin/form-submissions?${params.toString()}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") runSearch(value);
  }

  function handleClear() {
    setValue("");
    runSearch("");
  }

  return (
    <div className="relative flex-1 max-w-sm">
      <i className="ti ti-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-base pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search by name, phone, or email..."
        className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 bg-white text-slate-600 placeholder-slate-300 focus:outline-none focus:border-blue-400"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          title="Clear search"
        >
          <i className="ti ti-x text-sm" />
        </button>
      )}
    </div>
  );
}
