"use client";
import { useState } from "react";
import { Upload, X, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Multiple image upload component — uploads one or many files to Cloudinary
 * via /api/upload/:type and keeps the resulting URL list in sync with a
 * parent-owned array (e.g. Portfolio.images).
 *
 * Usage: <MultiImageUploadFactory type="portfolio" images={form.images} onImagesChange={(next) => setForm({...form, images: next})} />
 */
export default function MultiImageUploadFactory({
  type = "portfolio",
  images = [],
  onImagesChange,
  label = "Additional Images",
  maxSizeMB = 10,
}) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    const invalid = files.find(
      (file) => !file.type.startsWith("image/") || file.size > maxBytes,
    );
    if (invalid) {
      setError(`Each image must be an image file under ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    const uploadedUrls = [];
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload/${type}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    }

    onImagesChange([...images, ...uploadedUrls]);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <img
                src={url}
                alt={`Additional ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg border-2 border-slate-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
        {uploading ? (
          <Loader className="w-5 h-5 text-slate-400 mb-1 animate-spin" />
        ) : (
          <Upload className="w-5 h-5 text-slate-400 mb-1" />
        )}
        <p className="text-xs text-slate-500 text-center">
          {uploading
            ? "Uploading..."
            : "Click to add one or more images to the gallery"}
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

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
