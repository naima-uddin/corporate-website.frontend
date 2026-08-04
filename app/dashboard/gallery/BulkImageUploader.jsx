"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader, CheckCircle2, XCircle, Images, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const titleFromFilename = (filename) =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Untitled";

const generateBatchId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `batch-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function MediaLibraryPickerModal({ onConfirm, onClose }) {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("all");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadResources = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/media/list`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();
        if (!cancelled) setResources(data.resources || data.items || []);
      } catch (err) {
        console.error("Failed to load media library:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResources();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const folderOptions = useMemo(() => {
    const set = new Set(
      resources.map((item) => {
        const parts = String(item.public_id || "").split("/");
        return parts.length >= 2 ? parts.slice(0, 2).join("/") : "a2it/general";
      }),
    );
    return ["all", ...Array.from(set).sort()];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((item) => {
      const publicId = String(item.public_id || "").toLowerCase();
      const matchesSearch = !query || publicId.includes(query);
      const matchesFolder = folder === "all" || publicId.startsWith(folder);
      return matchesSearch && matchesFolder;
    });
  }, [resources, search, folder]);

  const toggleSelected = (item) => {
    setSelected((prev) =>
      prev.some((s) => s.public_id === item.public_id)
        ? prev.filter((s) => s.public_id !== item.public_id)
        : [...prev, item],
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="text-lg font-bold text-slate-900">
            Select from Media Library
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900"
            />
          </div>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700"
          >
            {folderOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All folders" : option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading media...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No images found.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {filteredResources.map((item) => {
                const isSelected = selected.some(
                  (s) => s.public_id === item.public_id,
                );
                return (
                  <button
                    key={item.public_id}
                    type="button"
                    onClick={() => toggleSelected(item)}
                    title={item.public_id}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                      isSelected
                        ? "border-cyan-500"
                        : "border-transparent hover:border-cyan-300"
                    }`}
                  >
                    <img
                      src={item.secure_url || item.url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs text-white">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 p-4">
          <p className="text-sm text-slate-500">
            {selected.length} image(s) selected
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selected.length === 0}
              onClick={() => onConfirm(selected)}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add {selected.length || ""} Image(s)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Upload one or many images at once, all tagged with the same category and
// the same batchId, so they render as a single grouped card in the gallery
// list. Pass `lockCategory` + `initialCategory` to fix the category, and
// `initialBatchId` to append uploads to an existing group (e.g. when adding
// more images to a group from its detail page). Without `initialBatchId` a
// fresh batch id is generated so a new group is created.
export default function BulkImageUploader({
  lockCategory = false,
  initialCategory = "",
  initialBatchId = "",
  onComplete,
}) {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(!lockCategory);
  const [category, setCategory] = useState(initialCategory);
  const [batchId] = useState(() => initialBatchId || generateBatchId());
  const [files, setFiles] = useState([]);
  const [librarySelections, setLibrarySelections] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lockCategory) return;

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
  }, [lockCategory]);

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleLibraryConfirm = (selected) => {
    setLibrarySelections((prev) => [...prev, ...selected]);
    setShowLibrary(false);
  };

  const removeLibrarySelection = (publicId) => {
    setLibrarySelections((prev) =>
      prev.filter((item) => item.public_id !== publicId),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category first");
      return;
    }

    const totalCount = files.length + librarySelections.length;
    if (totalCount === 0) {
      setError("Please choose at least one image to upload");
      return;
    }

    setUploading(true);
    setProgress([
      ...files.map((file) => ({ name: file.name, status: "pending" })),
      ...librarySelections.map((item) => ({
        name: item.public_id.split("/").pop(),
        status: "pending",
      })),
    ]);

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
              batchId,
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

    for (let i = 0; i < librarySelections.length; i++) {
      const item = librarySelections[i];
      const progressIndex = files.length + i;

      try {
        const createRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: item.secure_url || item.url,
              publicId: item.public_id,
              title: titleFromFilename(item.public_id.split("/").pop()),
              category,
              batchId,
              order: 0,
            }),
          },
        );
        const createData = await createRes.json();

        if (!createData.success) {
          throw new Error(createData.message || "Failed to save image");
        }

        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === progressIndex ? { ...p, status: "done" } : p,
          ),
        );
      } catch (err) {
        console.error("Error adding library image", item.public_id, err);
        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === progressIndex ? { ...p, status: "error" } : p,
          ),
        );
      }
    }

    setUploading(false);
    setFiles([]);
    setLibrarySelections([]);
    onComplete?.(batchId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!lockCategory && (
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
            Every image you add here gets tagged with this category. Need a
            new one? Add it from the Gallery list page first.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Images
        </label>
        <label className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
          <Upload className="w-6 h-6 text-slate-400 mb-2" />
          <p className="text-sm text-slate-500 text-center">
            {files.length > 0
              ? `${files.length} image(s) selected`
              : "Click to choose images — select one or many at once (10+ supported)"}
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

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            disabled={uploading}
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 disabled:opacity-50"
          >
            <Images className="w-3.5 h-3.5" />
            Select from Media Library
          </button>
          {librarySelections.length > 0 && (
            <p className="text-xs text-slate-500">
              {librarySelections.length} from library
            </p>
          )}
        </div>

        {librarySelections.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {librarySelections.map((item) => (
              <div key={item.public_id} className="relative group">
                <img
                  src={item.secure_url || item.url}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeLibrarySelection(item.public_id)}
                  disabled={uploading}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLibrary && (
        <MediaLibraryPickerModal
          onConfirm={handleLibraryConfirm}
          onClose={() => setShowLibrary(false)}
        />
      )}

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

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={
            uploading ||
            !category ||
            files.length + librarySelections.length === 0
          }
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-5 h-5" />
          {uploading
            ? `Uploading... (${progress.filter((p) => p.status !== "pending").length}/${progress.length})`
            : `Add ${files.length + librarySelections.length || ""} Image(s)`}
        </motion.button>
      </div>
    </form>
  );
}
