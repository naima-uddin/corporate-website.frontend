"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const STYLE_OPTIONS = [
  {
    value: "light",
    label: "Light card + stat",
    hint: "Title, description, big number & label (e.g. 25 Performance Warranty).",
  },
  {
    value: "image",
    label: "Image background + badge",
    hint: "Background image, title, description and a small pill badge.",
  },
  {
    value: "dark",
    label: "Dark card + chart",
    hint: "Navy card with a big stat (e.g. 30%), description & decorative chart.",
  },
];

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900";

export default function SmartFeatureForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
}) {
  const router = useRouter();

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/smart-features")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Smart Features
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Card Style
          </label>
          <select
            value={form.style}
            onChange={set("style")}
            className={inputClass}
          >
            {STYLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            {STYLE_OPTIONS.find((o) => o.value === form.style)?.hint}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Long-Life Panel Technology"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="e.g. Built with advanced material durability for extreme weather."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {form.style === "image" && (
          <>
            <ImageUploadFactory
              type="portfolio"
              label="Background Image"
              onImageUploaded={(url) =>
                setForm((prev) => ({ ...prev, image: url }))
              }
              currentImage={form.image}
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Badge (pill)
              </label>
              <input
                type="text"
                value={form.badge}
                onChange={set("badge")}
                placeholder="e.g. 25-year Performance"
                className={inputClass}
              />
            </div>
          </>
        )}

        {(form.style === "light" || form.style === "dark") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Stat Value
              </label>
              <input
                type="text"
                value={form.statValue}
                onChange={set("statValue")}
                placeholder="e.g. 25 or 30%"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Stat Label
              </label>
              <input
                type="text"
                value={form.statLabel}
                onChange={set("statLabel")}
                placeholder="e.g. Performance Warranty."
                className={inputClass}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={set("order")}
            className={inputClass}
          />
          <p className="text-xs text-slate-500 mt-1">
            Lower numbers appear first (left to right).
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/smart-features")}
            className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.title}
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
