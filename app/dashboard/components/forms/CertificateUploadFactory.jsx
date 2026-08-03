"use client";
import { useState } from "react";
import { Upload, X, Loader, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Multi-file upload component for certificates (images or PDFs).
 * Usage: <CertificateUploadFactory type="government-enlistment-certificate" files={[...]} onFilesChanged={(files) => ...} />
 */
export default function CertificateUploadFactory({
  type,
  files = [],
  onFilesChanged,
  label = "Certificates (image or PDF)",
  maxSizeMB = 10,
}) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const isPdf = (url) => (url || "").toLowerCase().endsWith(".pdf");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType =
      file.type.startsWith("image/") || file.type === "application/pdf";
    if (!isValidType) {
      setError("Please select an image or PDF file");
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File must be less than ${maxSizeMB}MB`);
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
        onFilesChanged([...files, data.url]);
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
    onFilesChanged(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border-2 border-slate-300 p-3"
            >
              {isPdf(url) ? (
                <FileText className="h-8 w-8 shrink-0 text-slate-500" />
              ) : (
                <img
                  src={url}
                  alt={`Certificate ${index + 1}`}
                  className="h-12 w-12 shrink-0 rounded object-cover"
                />
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-sm font-medium text-cyan-600 hover:underline"
              >
                Certificate {index + 1}
              </a>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="rounded-full bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50 transition">
        {uploading ? (
          <Loader className="h-5 w-5 animate-spin text-slate-400" />
        ) : (
          <>
            <Upload className="mb-1 h-5 w-5 text-slate-400" />
            <p className="text-xs text-slate-500">
              Click to add {files.length ? "another" : "a"} file (image or
              PDF)
            </p>
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {error && (
        <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500">Max {maxSizeMB}MB per file</p>
    </div>
  );
}
