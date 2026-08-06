"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

export default function ClientLogoForm({
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
          onClick={() => router.push("/dashboard/client-showcase")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Client Showcase
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
          type="clients"
          label="Logo Image"
          onImageUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
          currentImage={form.image}
        />

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/client-showcase")}
            className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.image}
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
