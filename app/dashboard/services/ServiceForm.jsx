"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Layers,
} from "lucide-react";
import ServiceFields, { Section } from "./ServiceFields";
import { emptySection } from "./serviceFormUtils";

const newSection = () => ({
  ...emptySection,
  features: [""],
  images: [],
  process: [],
  stats: [],
  blockOrder: [...(emptySection.blockOrder || [])],
});

function SectionsManager({ form, setForm }) {
  const [openIndex, setOpenIndex] = useState(null);
  const sections = form.sections || [];

  const makeSectionSetter = (index) => (updater) =>
    setForm((prev) => {
      const current = prev.sections[index];
      const next =
        typeof updater === "function"
          ? updater(current)
          : { ...current, ...updater };
      return {
        ...prev,
        sections: prev.sections.map((s, i) => (i === index ? next : s)),
      };
    });

  const addSection = () => {
    const nextIndex = sections.length;
    setForm((prev) => ({ ...prev, sections: [...prev.sections, newSection()] }));
    setOpenIndex(nextIndex);
  };

  const removeSection = (index) => {
    if (!window.confirm("Remove this section?")) return;
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    setOpenIndex((cur) =>
      cur === index ? null : cur != null && cur > index ? cur - 1 : cur,
    );
  };

  const moveSection = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    setForm((prev) => {
      const next = [...prev.sections];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, sections: next };
    });
    setOpenIndex((cur) =>
      cur === index ? target : cur === target ? index : cur,
    );
  };

  return (
    <Section
      title="Page sections"
      description="Add sub-pages (segments) inside this service. Each has its own detail page reachable from a “Know More” link, and shows in the order below."
    >
      <div className="space-y-3">
        {sections.length === 0 && (
          <p className="text-sm text-slate-400">
            No sections yet. Add one to build a sub-page.
          </p>
        )}

        {sections.map((section, i) => {
          const open = openIndex === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <ChevronRight
                    className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
                  />
                  <span className="font-medium text-slate-800">
                    {section.title?.trim() || "Untitled section"}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(i, 1)}
                    disabled={i === sections.length - 1}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(i)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-100"
                    aria-label="Remove section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {open && (
                <div className="border-t border-slate-200 bg-slate-50/40 p-4">
                  <ServiceFields
                    form={section}
                    setForm={makeSectionSetter(i)}
                    mode="section"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-600 transition"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>
      </div>
    </Section>
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

  return (
    <div className="space-y-6 pb-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

        <ServiceFields
          form={form}
          setForm={setForm}
          mode="service"
          categories={categories}
          categoriesLoading={categoriesLoading}
        />

        <div className="flex items-center gap-2 pt-2">
          <Layers className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Sub-pages
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <SectionsManager form={form} setForm={setForm} />
      </motion.form>

      {/* STICKY ACTION BAR */}
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
