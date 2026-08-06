"use client";
import { useState } from "react";
import { Upload, X, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Multi-image upload component — thumbnails render in a row.
 * Usage: <MultiImageUploadFactory type="csr" images={[...]} onImagesChanged={(urls) => ...} />
 */
export default function MultiImageUploadFactory({
  type = "general",
  images = [],
  onImagesChanged,
  label = "Images",
  maxSizeMB = 10,
}) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Image must be less than ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setError(null);

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
        onImagesChanged([...images, data.url]);
        setError(null);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (index) => {
    onImagesChanged(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-3">
        {images.map((url, index) => (
          <div key={index} className="relative group shrink-0">
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="h-24 w-24 rounded-lg border-2 border-slate-300 object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 transition">
          {uploading ? (
            <Loader className="h-5 w-5 animate-spin text-slate-400" />
          ) : (
            <>
              <Upload className="mb-1 h-5 w-5 text-slate-400" />
              <p className="px-1 text-center text-[11px] text-slate-500">
                Add image
              </p>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Max {maxSizeMB}MB per image. Multiple images will show as a slider on
        the site.
      </p>
    </div>
  );
}
