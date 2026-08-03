"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function GalleryImageForm({
  form,
  setForm,
  onSubmit,
  saving,
  error,
  heading,
  submitLabel,
}) {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/gallery")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
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

        <ImageUploadFactory
          type="gallery"
          label="Gallery Image"
          onImageUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
          currentImage={form.image}
        />

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. A2it Office"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder="e.g. Team, A2it, Consulting"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            Images sharing a category get grouped under the same filter tab on
            the public gallery.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, order: e.target.value }))
            }
            placeholder="0"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
          <p className="mt-1 text-xs text-slate-500">
            Lower numbers appear first. Position also determines the gallery's
            big/small row layout.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/gallery")}
            className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.image || !form.title}
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
