"use client";
import { useState, useEffect, useMemo } from "react";
import { Upload, X, Loader, Images, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mirrors CLOUDINARY_FOLDERS in Rakib-project-backend/controllers/uploadController.js
const CLOUDINARY_FOLDERS = {
  blogs: "a2it/blog/images",
  portfolio: "a2it/portfolio",
  services: "a2it/services",
  users: "a2it/users",
  clients: "a2it/clients",
  banners: "a2it/banners",
  "footer-logo": "a2it/footer/logo",
  "footer-top-band": "a2it/footer/top-band",
  news: "a2it/news",
  general: "a2it/general",
  "site-logo": "a2it/site/logo",
  spotlight: "a2it/spotlight",
  "join-us": "a2it/join-us",
};

function MediaLibraryModal({ type, onSelect, onClose }) {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState(CLOUDINARY_FOLDERS[type] || "all");

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
              {filteredResources.map((item) => (
                <button
                  key={item.public_id}
                  type="button"
                  onClick={() => onSelect(item.secure_url || item.url)}
                  title={item.public_id}
                  className="aspect-square overflow-hidden rounded-lg border-2 border-transparent transition hover:border-cyan-500"
                >
                  <img
                    src={item.secure_url || item.url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable image upload component factory
 * Usage: <ImageUploadFactory type="blogs" currentImage={...} onImageUploaded={...} />
 *
 * Supported types:
 * - blogs
 * - portfolio (default)
 * - services
 * - users
 * - general
 */
export default function ImageUploadFactory({
  type = "portfolio",
  onImageUploaded,
  currentImage = null,
  label = "Upload Image",
  accept = "image/*",
  maxSizeMB = 10,
}) {
  const { token } = useAuth();
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);

  // currentImage often arrives after an async fetch (edit pages) — keep in sync.
  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPreview(evt.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint = `/api/upload/${type}`;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        onImageUploaded(data.url);
        setError(null);
      } else {
        setError(data.error || "Upload failed");
        setPreview(currentImage);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
  };

  const handleLibrarySelect = (url) => {
    setPreview(url);
    setError(null);
    onImageUploaded(url);
    setShowLibrary(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border-2 border-slate-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <Loader className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-xs text-slate-500 text-center">
              Click to upload
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
        >
          <Images className="w-3.5 h-3.5" />
          Select from Media Library
        </button>
        <p className="text-xs text-slate-500">Max {maxSizeMB}MB</p>
      </div>

      {showLibrary && (
        <MediaLibraryModal
          type={type}
          onSelect={handleLibrarySelect}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}
