"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Wand2,
  Code,
  Smartphone,
  ShoppingCart,
  Database,
  TrendingUp,
  Share2,
  Store,
  Tag,
  ShoppingBag,
  Palette,
  Server,
} from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";
import { ICON_OPTIONS, slugifyPath } from "./serviceFormUtils";

const iconMap = {
  Code,
  Smartphone,
  ShoppingCart,
  Database,
  TrendingUp,
  Share2,
  Store,
  Tag,
  ShoppingBag,
  Palette,
  Server,
};

const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition";

function Section({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function RowButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

export default function ServiceForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
  categories,
  categoriesLoading,
}) {
  const router = useRouter();
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  // ---- Features (flat list) ----
  const setFeature = (i, value) =>
    update({ features: form.features.map((f, idx) => (idx === i ? value : f)) });
  const addFeature = () => update({ features: [...form.features, ""] });
  const removeFeature = (i) =>
    update({ features: form.features.filter((_, idx) => idx !== i) });

  // ---- Process (title + description rows) ----
  const setProcess = (i, key, value) =>
    update({
      process: form.process.map((row, idx) =>
        idx === i ? { ...row, [key]: value } : row,
      ),
    });
  const addProcess = () =>
    update({ process: [...form.process, { title: "", description: "" }] });
  const removeProcess = (i) =>
    update({ process: form.process.filter((_, idx) => idx !== i) });

  // ---- Stats (value + label rows) ----
  const setStat = (i, key, value) =>
    update({
      stats: form.stats.map((row, idx) =>
        idx === i ? { ...row, [key]: value } : row,
      ),
    });
  const addStat = () =>
    update({ stats: [...form.stats, { value: "", label: "" }] });
  const removeStat = (i) =>
    update({ stats: form.stats.filter((_, idx) => idx !== i) });

  const SelectedIcon = iconMap[form.icon] || Code;

  return (
    <div className="space-y-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          onClick={() => router.push("/dashboard/services")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </button>
        <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
        <p className="mt-1 text-slate-500">
          Each section below maps to a block on the live service page. Empty
          sections are simply hidden.
        </p>
      </motion.div>

      <motion.form
        id="serviceForm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ---------------- HERO / BASICS ---------------- */}
        <Section
          title="Hero & basics"
          description="The top banner: title, intro, cover image, category and icon."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Service title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Web Development"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Page path <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/services/web-development"
                  value={form.path}
                  onChange={(e) => update({ path: e.target.value })}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => update({ path: slugifyPath(form.title) })}
                  title="Generate from title"
                  className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition"
                >
                  <Wand2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Short description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="One or two sentences shown under the title in the hero."
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                required
                rows="3"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => update({ category: e.target.value })}
                disabled={categoriesLoading}
                className={`${inputClass} disabled:opacity-60`}
              >
                {(!form.category || !(categories || []).length) && (
                  <option value="">
                    {categoriesLoading ? "Loading..." : "Select a category"}
                  </option>
                )}
                {(categories || []).map((c) => (
                  <option value={c.name} key={c.name}>
                    {c.displayName}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Manage categories from the Categories page.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Icon
              </label>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0066ff] text-white">
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <select
                  value={form.icon}
                  onChange={(e) => update({ icon: e.target.value })}
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((name) => (
                    <option value={name} key={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <ImageUploadFactory
                type="services"
                label="Cover image (hero background)"
                currentImage={form.image}
                onImageUploaded={(url) => update({ image: url || "" })}
              />
            </div>
          </div>
        </Section>

        {/* ---------------- FEATURES ---------------- */}
        <Section
          title="What's included"
          description="Feature list shown as a grid of checkmarks. At least one is required."
        >
          <div className="space-y-3">
            {form.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center text-sm font-semibold text-slate-400">
                  {i + 1}
                </span>
                <input
                  type="text"
                  placeholder="e.g. Responsive, mobile-first design"
                  value={feature}
                  onChange={(e) => setFeature(i, e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  disabled={form.features.length === 1}
                  className="shrink-0 rounded-lg p-2.5 text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <RowButton onClick={addFeature}>Add feature</RowButton>
          </div>
        </Section>

        {/* ---------------- PROCESS ---------------- */}
        <Section
          title="Our process"
          description="Numbered steps. Each has a title and an optional description."
        >
          <div className="space-y-3">
            {form.process.map((row, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
              >
                <span className="mt-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Step title, e.g. Discovery"
                    value={row.title}
                    onChange={(e) => setProcess(i, "title", e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={row.description}
                    onChange={(e) =>
                      setProcess(i, "description", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeProcess(i)}
                  className="shrink-0 rounded-lg p-2.5 text-red-500 hover:bg-red-100"
                  aria-label="Remove step"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.process.length === 0 && (
              <p className="text-sm text-slate-400">No steps yet.</p>
            )}
          </div>
          <div className="mt-4">
            <RowButton onClick={addProcess}>Add step</RowButton>
          </div>
        </Section>

        {/* ---------------- STATS ---------------- */}
        <Section
          title="Results / stats"
          description="Highlight numbers. Each has a big value and a label."
        >
          <div className="space-y-3">
            {form.stats.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Value, e.g. 98%"
                  value={row.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  className={`${inputClass} md:max-w-[180px]`}
                />
                <input
                  type="text"
                  placeholder="Label, e.g. Customer satisfaction"
                  value={row.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeStat(i)}
                  className="shrink-0 rounded-lg p-2.5 text-red-500 hover:bg-red-50"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {form.stats.length === 0 && (
              <p className="text-sm text-slate-400">No stats yet.</p>
            )}
          </div>
          <div className="mt-4">
            <RowButton onClick={addStat}>Add stat</RowButton>
          </div>
        </Section>

        {/* ---------------- GALLERY ---------------- */}
        <Section
          title="Gallery"
          description="Extra images shown in a grid below the content."
        >
          <div className="flex flex-wrap gap-3">
            {form.images.map((url, index) => (
              <div key={url} className="group relative">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="h-32 w-32 rounded-lg border-2 border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    update({
                      images: form.images.filter((_, i) => i !== index),
                    })
                  }
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <ImageUploadFactory
              key={form.images.length}
              type="services"
              label="Add image"
              onImageUploaded={(url) => {
                if (!url) return;
                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, url],
                }));
              }}
            />
          </div>
        </Section>

        {/* ---------------- DETAILS ---------------- */}
        <Section
          title="More details"
          description="Long-form copy. Separate paragraphs with a blank line."
        >
          <textarea
            placeholder="Tell the full story of this service..."
            value={form.details}
            onChange={(e) => update({ details: e.target.value })}
            rows="6"
            className={inputClass}
          />
        </Section>
      </motion.form>

      {/* ---------------- STICKY ACTION BAR ---------------- */}
      <div className="sticky bottom-4 z-20 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => router.push("/dashboard/services")}
          className="rounded-lg px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="serviceForm"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#0066ff] px-6 py-3 font-semibold text-[#0a0a12] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
