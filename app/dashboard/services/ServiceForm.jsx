"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, X } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

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
  const [galleryUploadKey, setGalleryUploadKey] = useState(0);

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
            onClick={() => router.push("/dashboard/services")}
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{heading}</h1>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Service Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Service Path (e.g., /services/web-development)"
              value={form.path}
              onChange={(e) => setForm({ ...form, path: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              rows="3"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <ImageUploadFactory
              type="services"
              label="Cover Image"
              currentImage={form.image}
              onImageUploaded={(url) => setForm({ ...form, image: url || "" })}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gallery Images
            </label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: form.images.filter((_, i) => i !== index),
                      })
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <ImageUploadFactory
                key={galleryUploadKey}
                type="services"
                label="Add Image"
                onImageUploaded={(url) => {
                  if (!url) return;
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, url],
                  }));
                  setGalleryUploadKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              disabled={categoriesLoading}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition disabled:opacity-60"
            >
              {(categories || []).map((c) => (
                <option value={c.name} key={c.name}>
                  {c.displayName}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">
              Choose one category saved in the database. Manage categories
              from the Services list page.
            </p>
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="Features (one per line)"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Process Steps
            </label>
            <textarea
              placeholder={
                "One per line: Title | Description\ne.g. Discovery | Understanding your goals and requirements"
              }
              value={form.process}
              onChange={(e) => setForm({ ...form, process: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Stats
            </label>
            <textarea
              placeholder={
                "One per line: Value | Label\ne.g. 98% | Customer Satisfaction"
              }
              value={form.stats}
              onChange={(e) => setForm({ ...form, stats: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-sm shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <textarea
              placeholder="More Details (long-form description shown on the service page, paragraphs separated by a blank line)"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows="5"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 shadow-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/services")}
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
        </div>
      </motion.form>
    </div>
  );
}
