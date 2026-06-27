"use client";
import { useState } from "react";

export default function ProfileSettings({ user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setMessage("Profile updated successfully!");
    else setMessage("Failed to update profile.");
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPwMessage("Passwords do not match.");
    }
    setPwLoading(true);
    setPwMessage("");
    const res = await fetch("/api/user/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    setPwLoading(false);
    const data = await res.json();
    if (res.ok) {
      setPwMessage("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setPwMessage(data.error || "Failed to change password.");
    }
  }

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-800">
        Profile Settings
      </h2>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <i className="ti ti-user text-blue-500" /> Personal Info
        </h3>
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
            <p className="text-xs text-slate-400 mt-1">
              Email cannot be changed.
            </p>
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 1700-000000"
              className={inputClass}
            />
          </div>
          {message && (
            <p
              className={`text-xs font-bold px-4 py-3 rounded-xl ${message.includes("success") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 self-start px-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password — only show if user has a password (not Google-only) */}
      {user?.password && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="ti ti-lock text-blue-500" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className={inputClass}
                required
              />
            </div>
            {pwMessage && (
              <p
                className={`text-xs font-bold px-4 py-3 rounded-xl ${pwMessage.includes("success") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                {pwMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-all disabled:opacity-50 self-start px-6"
            >
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
