"use client";

import { useState } from "react";
import EnrollmentModal from "./EnrollmentModal";

function SeatBar({ seats }) {
  const max = 20;
  const filled = max - seats;
  const percent = Math.round((filled / max) * 100);
  const color =
    seats <= 5
      ? "bg-rose-500"
      : seats <= 10
        ? "bg-amber-400"
        : "bg-emerald-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">
        {seats} seats left
      </span>
    </div>
  );
}

export default function BatchList({ batches }) {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [successBatch, setSuccessBatch] = useState(null);

  const handleSuccess = () => {
    setSuccessBatch(selectedBatch);
    setSelectedBatch(null);
  };

  return (
    <section className="min-h-screen bg-slate-50 py-20 px-5">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-500 bg-sky-100 px-5 py-2 rounded-full mb-4">
            Enroll Today
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
            Upcoming{" "}
            <span className="relative inline-block text-sky-500">
              Batches
              <span className="absolute bottom-1 left-0 w-full h-2 bg-sky-200 rounded-full -z-10" />
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl">
            Choose a batch that fits your schedule and start your journey to
            Band 7+ with expert-led coaching and structured practice.
          </p>
        </div>

        {/* Success banner */}
        {successBatch && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
            <i className="ti ti-circle-check-filled text-emerald-500 text-2xl flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-700 mb-0.5">
                Enrollment Submitted!
              </p>
              <p className="text-xs text-emerald-600">
                You have successfully enrolled in{" "}
                <span className="font-bold">{successBatch.name}</span>. We will
                confirm your seat within 24 hours.
              </p>
            </div>
            <button
              onClick={() => setSuccessBatch(null)}
              className="text-emerald-400 hover:text-emerald-600 flex-shrink-0"
            >
              <i className="ti ti-x text-base" />
            </button>
          </div>
        )}

        {/* Batch List */}
        {batches.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {batches.map((batch, i) => (
              <div key={batch.id}>
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 px-8 py-8">
                  {/* Left Side */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {batch.badge && (
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full
                          ${
                            batch.badge === "Filling Fast"
                              ? "bg-rose-100 text-rose-600"
                              : batch.badge === "New"
                                ? "bg-sky-100 text-sky-600"
                                : batch.badge === "Closed"
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {batch.badge}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {batch.module}
                      </span>
                      <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                        {batch.duration}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-800 leading-snug">
                      {batch.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <i className="ti ti-clock text-sky-500 text-base" />
                        {batch.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <i className="ti ti-calendar-week text-sky-500 text-base" />
                        {batch.schedule}
                      </span>
                    </div>

                    <div>
                      <div className="max-w-xs">
                        <SeatBar seats={batch.seats} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">
                          <i className="ti ti-users mr-1" />
                          {batch._count.enrollments} students enrolled
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-20 bg-slate-100 flex-shrink-0" />
                  <div className="block md:hidden w-full h-px bg-slate-100" />

                  {/* Right Side */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 flex-shrink-0 md:min-w-[180px]">
                    <div className="text-left md:text-right">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Starts On
                      </p>
                      <p className="text-lg font-extrabold text-blue-600">
                        {batch.startDate}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBatch(batch)}
                      disabled={batch.badge === "Closed"}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl
                        shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                        transition-all duration-200 whitespace-nowrap"
                    >
                      Enroll Now
                      <i className="ti ti-arrow-right text-sm" />
                    </button>
                  </div>
                </div>

                {i < batches.length - 1 && (
                  <div className="mx-8 h-px bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-calendar-event" />
            </div>
            <p className="text-base font-bold text-slate-600 mb-2">
              No batches available yet
            </p>
            <p className="text-sm text-slate-400">
              New batches will be announced soon. Check back later!
            </p>
          </div>
        )}

        {/* Bottom note */}
        <p className="text-center text-sm text-slate-400 mt-8 flex items-center justify-center gap-2">
          <i className="ti ti-info-circle text-sky-400 text-base" />
          Can't find a suitable time?{" "}
          <a
            href="/contact"
            className="text-sky-500 font-semibold hover:underline"
          >
            Contact us
          </a>{" "}
          for a custom schedule.
        </p>
      </div>

      {/* Enrollment Modal */}
      {selectedBatch && (
        <EnrollmentModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
