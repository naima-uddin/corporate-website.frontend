"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { NAV_SECTIONS } from "../components/navConfig";

export default function UserForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
  isEditing,
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>
        <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        />
        {!isEditing && (
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        )}
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
        >
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "moderator" && (
          <div className="border border-slate-200 rounded-lg p-4 space-y-4">
            <p className="text-sm font-semibold text-slate-700">
              Route Access (which dashboard sections this moderator can use)
            </p>
            {NAV_SECTIONS.filter((section) => section.label).map((section) => (
              <div key={section.id} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {section.items.map((item) => {
                    const checked = (form.permissions || []).includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = form.permissions || [];
                            const next = e.target.checked
                              ? [...current, item.id]
                              : current.filter((key) => key !== item.id);
                            setForm({ ...form, permissions: next });
                          }}
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
