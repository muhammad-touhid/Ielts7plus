"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateStatusButton({
  id,
  currentStatus,
  currentResultSent,
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [resultSent, setResultSent] = useState(currentResultSent);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mock-tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resultSent }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Status dropdown */}
      <div>
        <p className="text-xs text-slate-400 mb-1.5">Update Status</p>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="evaluated">Evaluated</option>
          </select>
          <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
        </div>
      </div>

      {/* Result sent toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative" onClick={() => setResultSent((r) => !r)}>
          <div
            className={`w-11 h-6 rounded-full transition-all duration-200 cursor-pointer ${resultSent ? "bg-blue-600" : "bg-slate-200"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${resultSent ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {resultSent ? "Result Sent" : "Mark as Result Sent"}
        </span>
      </label>

      {/* Save button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 transition-all duration-200"
      >
        {loading ? (
          <>
            <i className="ti ti-loader-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <i className="ti ti-check" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}
