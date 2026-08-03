"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Loader, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const titleFromFilename = (filename) =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Untitled";

export default function BulkUploadGalleryPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-categories`,
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching gallery categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category for this batch");
      return;
    }

    if (files.length === 0) {
      setError("Please choose at least one image to upload");
      return;
    }

    setUploading(true);
    setProgress(
      files.map((file) => ({ name: file.name, status: "pending" })),
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/gallery`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          throw new Error(uploadData.error || "Upload failed");
        }

        const createRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: uploadData.url,
              publicId: uploadData.publicId,
              title: titleFromFilename(file.name),
              category,
              order: 0,
            }),
          },
        );
        const createData = await createRes.json();

        if (!createData.success) {
          throw new Error(createData.message || "Failed to save image");
        }

        setProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "done" } : p)),
        );
      } catch (err) {
        console.error("Error uploading", file.name, err);
        setProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "error" } : p)),
        );
      }
    }

    setUploading(false);
  };

  const allDone =
    progress.length > 0 && progress.every((p) => p.status !== "pending");

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          type="button"
          onClick={() => router.push("/dashboard/gallery")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </button>
        <h1 className="text-4xl font-bold text-slate-900">
          Bulk Upload Images
        </h1>
        <p className="text-slate-600 mt-1">
          Upload many images at once (10 or more) under a single category.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loadingCategories || uploading}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.displayName}>
                {cat.displayName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Every image in this batch will be tagged with this category. Need
            a new one? Add it from the Gallery list page first.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Images
          </label>
          <label className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 text-center">
              {files.length > 0
                ? `${files.length} image(s) selected`
                : "Click to choose images (multi-select supported)"}
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {progress.length > 0 && (
          <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {progress.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="truncate text-slate-700">{p.name}</span>
                {p.status === "pending" && (
                  <Loader className="w-4 h-4 text-slate-400 animate-spin" />
                )}
                {p.status === "done" && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {p.status === "error" && (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/gallery")}
            className="px-6 py-3 rounded-lg font-semibold text-slate-600 hover:bg-slate-100"
          >
            {allDone ? "Done" : "Cancel"}
          </button>
          {!allDone && (
            <button
              type="submit"
              disabled={uploading || !category || files.length === 0}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-5 h-5" />
              {uploading
                ? `Uploading... (${progress.filter((p) => p.status !== "pending").length}/${progress.length})`
                : `Upload ${files.length || ""} Image(s)`}
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
}
