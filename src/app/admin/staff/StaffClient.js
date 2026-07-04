"use client";

import { useState, useEffect } from "react";

const ROLES = ["admin", "teacher", "moderator"];

const roleMeta = {
  admin: { label: "Admin", color: "bg-blue-50 text-blue-600" },
  teacher: { label: "Teacher", color: "bg-emerald-50 text-emerald-600" },
  moderator: { label: "Moderator", color: "bg-amber-50 text-amber-600" },
};

const inputClass =
  "w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";

function StaffForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Failed to create staff.");
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
          <i className="ti ti-alert-circle flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="staff@ielts7plus.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
            Password *
          </label>
          <input
            type="password"
            required
            placeholder="Min. 8 characters"
            minLength={8}
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
            Role *
          </label>
          <div className="relative">
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {roleMeta[r].label}
                </option>
              ))}
            </select>
            <i className="ti ti-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <i className="ti ti-loader-2 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <i className="ti ti-plus" /> Create Staff Member
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function EditStaffModal({ staff, onSuccess, onClose }) {
  const [form, setForm] = useState({
    name: staff.name,
    role: staff.role,
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password && form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (form.password && form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    setLoading(true);

    const payload = { name: form.name, role: form.role };
    if (form.password) payload.password = form.password;

    const res = await fetch(`/api/staff/${staff.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error || "Failed to update staff.");

    setSuccess("Staff member updated successfully.");
    setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
    setTimeout(() => {
      onSuccess();
    }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-800">Edit Staff Member</h3>
            <p className="text-xs text-slate-400 mt-0.5">{staff.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
          >
            <i className="ti ti-x text-sm" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-7 flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <i className="ti ti-alert-circle flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
              <i className="ti ti-circle-check flex-shrink-0" /> {success}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
              Role *
            </label>
            <div className="flex flex-col gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r }))}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold text-left ${
                    form.role === r
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-100 text-slate-600 hover:border-slate-200"
                  }`}
                >
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleMeta[r].color}`}
                  >
                    {roleMeta[r].label}
                  </span>
                  {r === "admin" && "Full access to all features"}
                  {r === "teacher" && "Access to courses & students"}
                  {r === "moderator" && "Access to content & blog"}
                </button>
              ))}
            </div>
          </div>

          {/* Password section */}
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Change Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showPassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPassword ? (
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  placeholder="New password (min. 8 characters)"
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Leave unchanged to keep the current password.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <i className="ti ti-check" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ staff, onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/staff/${staff.id}`, { method: "DELETE" });
    setLoading(false);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl border border-slate-100 shadow-2xl p-7 w-full max-w-sm z-10 text-center">
        <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ti ti-trash text-rose-500 text-2xl" />
        </div>
        <h3 className="font-extrabold text-slate-800 mb-1">
          Remove Staff Member
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-700">{staff.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Removing..." : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffClient() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterRole, setFilterRole] = useState("all");

  async function fetchStaff() {
    setLoading(true);
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaff(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  const filtered =
    filterRole === "all" ? staff : staff.filter((s) => s.role === filterRole);

  const counts = {
    all: staff.length,
    admin: staff.filter((s) => s.role === "admin").length,
    teacher: staff.filter((s) => s.role === "teacher").length,
    moderator: staff.filter((s) => s.role === "moderator").length,
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Staff Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage admin, teacher, and moderator accounts.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
          >
            <i className={`ti ${showForm ? "ti-x" : "ti-plus"} text-base`} />
            {showForm ? "Cancel" : "Add Staff Member"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
            <h2 className="text-sm font-extrabold text-slate-700 mb-5 flex items-center gap-2">
              <i className="ti ti-user-plus text-blue-600" />
              New Staff Member
            </h2>
            <StaffForm
              onSuccess={() => {
                setShowForm(false);
                fetchStaff();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              key: "all",
              label: "Total Staff",
              icon: "ti-users",
              color: "text-slate-600 bg-slate-50",
            },
            {
              key: "admin",
              label: "Admins",
              icon: "ti-shield",
              color: "text-blue-600 bg-blue-50",
            },
            {
              key: "teacher",
              label: "Teachers",
              icon: "ti-school",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              key: "moderator",
              label: "Moderators",
              icon: "ti-eye",
              color: "text-amber-600 bg-amber-50",
            },
          ].map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
              >
                <i className={`ti ${stat.icon} text-lg`} />
              </div>
              <p className="text-2xl font-extrabold text-slate-800">
                {counts[stat.key]}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "admin", "teacher", "moderator"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filterRole === r
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {r === "all" ? "All Staff" : roleMeta[r].label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  filterRole === r
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {counts[r]}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <i className="ti ti-loader-2 animate-spin text-2xl text-blue-500" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-extrabold text-sm flex-shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-800">
                            {member.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {member.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${roleMeta[member.role]?.color || "bg-slate-100 text-slate-500"}`}
                        >
                          {roleMeta[member.role]?.label || member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(member.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(member)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                          >
                            <i className="ti ti-edit text-sm" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(member)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white transition-all duration-200"
                          >
                            <i className="ti ti-trash text-sm" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
                <i className="ti ti-users" />
              </div>
              <p className="text-sm font-bold text-slate-600 mb-1">
                No{" "}
                {filterRole === "all"
                  ? "staff members"
                  : roleMeta[filterRole]?.label + "s"}{" "}
                yet
              </p>
              <p className="text-xs text-slate-400">
                Click "Add Staff Member" to create one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editTarget && (
        <EditStaffModal
          staff={editTarget}
          onSuccess={() => {
            setEditTarget(null);
            fetchStaff();
          }}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          staff={deleteTarget}
          onSuccess={() => {
            setDeleteTarget(null);
            fetchStaff();
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
