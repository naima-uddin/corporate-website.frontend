"use client";

import React from "react";
import {
  X,
  Plus,
  Trash2,
  Wand2,
  ChevronUp,
  ChevronDown,
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
import { ICON_OPTIONS, slugifyPath, slugifySegment } from "./serviceFormUtils";
import { BLOCK_LABELS, normalizeBlockOrder } from "@/lib/serviceBlocks";

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

export const inputClass =
  "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition";

export function Section({ title, description, children }) {
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

export function RowButton({ onClick, children }) {
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

/**
 * The full content editor shared by a service and by each of its sections.
 * `mode="service"` shows path + category; `mode="section"` shows a slug.
 */
export default function ServiceFields({
  form,
  setForm,
  mode = "service",
  categories,
  categoriesLoading,
}) {
  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const isSection = mode === "section";

  // ---- Features ----
  const setFeature = (i, value) =>
    update({ features: form.features.map((f, idx) => (idx === i ? value : f)) });
  const addFeature = () => update({ features: [...form.features, ""] });
  const removeFeature = (i) =>
    update({ features: form.features.filter((_, idx) => idx !== i) });

  // ---- Process ----
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

  // ---- Stats ----
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

  // ---- Content block order ----
  const blockOrder = normalizeBlockOrder(form.blockOrder, {
    includeSections: !isSection,
  });
  const moveBlock = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= blockOrder.length) return;
    const next = [...blockOrder];
    [next[index], next[target]] = [next[target], next[index]];
    update({ blockOrder: next });
  };

  const SelectedIcon = iconMap[form.icon] || Code;

  return (
    <div className="space-y-6">
      {/* HERO / BASICS */}
      <Section
        title="Hero & basics"
        description="The top banner: title, intro, cover image and icon."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={isSection ? "e.g. PHP NOF Flat Steel" : "e.g. Web Development"}
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              {isSection ? "URL slug" : "Page path"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={isSection ? "php-nof-flat-steel" : "/services/web-development"}
                value={isSection ? form.slug : form.path}
                onChange={(e) =>
                  update(
                    isSection
                      ? { slug: e.target.value }
                      : { path: e.target.value },
                  )
                }
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    isSection
                      ? { slug: slugifySegment(form.title) }
                      : { path: slugifyPath(form.title) },
                  )
                }
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
              placeholder="One or two sentences shown under the title."
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              required
              rows="3"
              className={inputClass}
            />
          </div>

          {!isSection && (
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
          )}

          <div className={isSection ? "md:col-span-2" : ""}>
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

      {/* CONTENT ORDER */}
      <Section
        title="Content order"
        description="Arrange how the blocks below appear on the page. Empty blocks are hidden automatically."
      >
        <div className="space-y-2">
          {blockOrder.map((key, i) => (
            <div
              key={key}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5"
            >
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-slate-400">
                {i + 1}
              </span>
              <span className="flex-1 font-medium text-slate-700">
                {BLOCK_LABELS[key] || key}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(i, -1)}
                  disabled={i === 0}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 1)}
                  disabled={i === blockOrder.length - 1}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURES */}
      <Section
        title="What's included"
        description="Feature list shown as a grid of checkmarks."
      >
        <div className="space-y-3">
          {form.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-slate-400">
                {i + 1}
              </span>
              <input
                type="text"
                placeholder="e.g. Corrosion resistance"
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

      {/* PROCESS */}
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
                  placeholder="Step title"
                  value={row.title}
                  onChange={(e) => setProcess(i, "title", e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={row.description}
                  onChange={(e) => setProcess(i, "description", e.target.value)}
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

      {/* STATS */}
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

      {/* GALLERY */}
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
                  update({ images: form.images.filter((_, i) => i !== index) })
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
              setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
            }}
          />
        </div>
      </Section>

      {/* DETAILS */}
      <Section
        title="More details"
        description="Long-form copy. Separate paragraphs with a blank line."
      >
        <textarea
          placeholder="Tell the full story..."
          value={form.details}
          onChange={(e) => update({ details: e.target.value })}
          rows="6"
          className={inputClass}
        />
      </Section>
    </div>
  );
}
