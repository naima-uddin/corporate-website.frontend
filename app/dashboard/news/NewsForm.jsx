"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";
import RichTextEditor from "../components/forms/RichTextEditor";

export default function NewsForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
}) {
  const router = useRouter();

  const handleFieldChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/news")}
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
          <ImageUploadFactory
            type="news"
            label="Featured Image"
            onImageUploaded={(url) =>
              setForm((prev) => ({ ...prev, featuredImage: url }))
            }
            currentImage={form.featuredImage}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={handleFieldChange("title")}
                placeholder="e.g. Rakibhasan wins Best IT Partner 2026"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={handleFieldChange("excerpt")}
                rows={2}
                placeholder="Short summary shown on cards"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Content
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
                uploadType="news"
                minHeight={320}
                placeholder="Use the toolbar to format text, color it, or insert images. Use the gallery icon to select multiple images at once — they'll auto-arrange into a grid."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={handleFieldChange("category")}
                placeholder="e.g. Company News"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Publish Date
              </label>
              <input
                type="date"
                value={form.publishDate}
                onChange={handleFieldChange("publishDate")}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={handleFieldChange("status")}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={handleFieldChange("isFeatured")}
                className="w-4 h-4"
              />
              <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">
                Featured (shows as the large item on homepage)
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/news")}
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
