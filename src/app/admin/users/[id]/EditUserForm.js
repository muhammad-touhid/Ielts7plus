"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteUserButton from "../DeleteUserButton";

export default function EditUserForm({ user }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "w-full bg-slate-50 text-slate-700 text-sm px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const body = { name: form.name, email: form.email, phone: form.phone };
    if (form.password) body.password = form.password;

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (res.ok) {
      setMessage("User updated successfully!");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to update user.");
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            required
          />
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
        <div>
          <label className={labelClass}>
            New Password
            <span className="ml-1 text-slate-400 normal-case font-normal">
              (leave blank to keep current)
            </span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter new password"
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

        <div className="flex items-center justify-between gap-3 pt-2">
          <DeleteUserButton id={user.id} name={user.name} />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <i
              className={`${loading ? "ti ti-loader-2 animate-spin" : "ti ti-check"} text-sm`}
            />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
