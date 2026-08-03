"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical, Power, Pencil } from "lucide-react";

export default function GalleryPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [token]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (err) {
      console.error("Error fetching gallery images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !item.isActive }),
        },
      );

      if (response.ok) fetchImages();
    } catch (err) {
      console.error("Error updating gallery image:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) fetchImages();
    } catch (err) {
      console.error("Error deleting gallery image:", err);
    }
  };

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Company Gallery
          </h1>
          <p className="text-slate-600">
            Upload and manage the images shown on the public gallery page.
          </p>
        </div>
        <Link
          href="/dashboard/gallery/new"
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </Link>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Current Images ({images.length})
          </h2>

          {images.length === 0 ? (
            <p className="text-slate-500 text-sm">No gallery images yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((item) => (
                <div
                  key={item._id}
                  className={`relative group border rounded-lg p-3 flex flex-col items-center gap-2 ${
                    item.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-slate-300 absolute top-2 left-2" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate w-full text-center">
                    {item.category || "—"} · order {item.order}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/gallery/${item._id}`}
                      title="Edit"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleActive(item)}
                      title={item.isActive ? "Hide from site" : "Show on site"}
                      className={`p-2 rounded ${
                        item.isActive
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
