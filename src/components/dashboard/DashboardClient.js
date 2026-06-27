"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import ProfileSettings from "./ProfileSettings";

const tabs = [
  { id: "enrollments", label: "My Enrollments", icon: "ti ti-books" },
  { id: "results", label: "Mock Test Results", icon: "ti ti-clipboard-check" },
  { id: "profile", label: "Profile Settings", icon: "ti ti-user-circle" },
];

export default function DashboardClient({ user, enrollments, mockResults }) {
  const [activeTab, setActiveTab] = useState("enrollments");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#354e98] to-[#4a71df] px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-extrabold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-white font-extrabold text-xl">
                {user?.name}
              </h1>
              <p className="text-blue-200 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
          >
            <i className="ti ti-logout" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <i className={tab.icon} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Enrollments Tab */}
        {activeTab === "enrollments" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-extrabold text-slate-800">
              My Enrollments
            </h2>
            {enrollments.length > 0 ? (
              enrollments.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-extrabold text-slate-800">
                      {e.batch?.name ?? "—"}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {e.batch?.startDate && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <i className="ti ti-calendar text-blue-400" />{" "}
                          {e.batch.startDate}
                        </span>
                      )}
                      {e.batch?.time && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <i className="ti ti-clock text-blue-400" />{" "}
                          {e.batch.time}
                        </span>
                      )}
                      {e.paymentMethod && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <i className="ti ti-credit-card text-blue-400" />{" "}
                          {e.paymentMethod}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Enrolled on{" "}
                      {new Date(e.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0
                    ${
                      e.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-600"
                        : e.status === "cancelled"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
                  <i className="ti ti-books" />
                </div>
                <p className="font-bold text-slate-600 mb-1">
                  No enrollments yet
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Enroll in a batch to get started.
                </p>
                <a
                  href="/batch-schedule"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all"
                >
                  <i className="ti ti-plus" /> Browse Batches
                </a>
              </div>
            )}
          </div>
        )}

        {/* Mock Test Results Tab */}
        {activeTab === "results" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-extrabold text-slate-800">
              Mock Test Results
            </h2>
            {mockResults.length > 0 ? (
              mockResults.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-extrabold text-slate-800">Mock Test</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {r.targetBand && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <i className="ti ti-target text-blue-400" /> Target:
                            Band {r.targetBand}
                          </span>
                        )}
                        {r.completedModules?.length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <i className="ti ti-list-check text-blue-400" />
                            {r.completedModules.join(", ")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Submitted on{" "}
                        {new Date(r.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full
                        ${r.resultSent ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                      >
                        {r.resultSent ? "Result Sent" : "Pending Review"}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full
                        ${r.status === "reviewed" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
                  <i className="ti ti-clipboard-check" />
                </div>
                <p className="font-bold text-slate-600 mb-1">
                  No mock tests yet
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Take a mock test to see your results here.
                </p>
                <a
                  href="/mock-test"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all"
                >
                  <i className="ti ti-pencil" /> Take Mock Test
                </a>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && <ProfileSettings user={user} />}
      </div>
    </div>
  );
}
