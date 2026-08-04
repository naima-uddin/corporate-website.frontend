"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Power, Pencil } from "lucide-react";
import BulkImageUploader from "../../BulkImageUploader";

const groupKeyOf = (item) =>
  item.batchId && item.batchId.trim() ? item.batchId : item._id;

function GalleryGroupContent() {
  const batchId = useSearchParams().get("batchId");
  const { token, isAdmin, isModerator } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !batchId) return;
    fetchGroup();
  }, [token, batchId]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        const groupItems = (data.images || []).filter(
          (item) => groupKeyOf(item) === batchId,
        );
        setItems(groupItems);
      }
    } catch (err) {
      console.error("Error fetching gallery group:", err);
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

      if (response.ok) fetchGroup();
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

      if (response.ok) fetchGroup();
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

  const category = items[0]?.category || "";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/dashboard/gallery"
          className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {category || "Gallery Group"}
        </h1>
        <p className="text-slate-600">
          {loading ? "Loading..." : `${items.length} image(s) in this group`}
        </p>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          {items.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No images found for this group.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`relative group border rounded-lg p-3 flex flex-col items-center gap-2 ${
                    item.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs font-semibold text-slate-700 truncate w-full text-center">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate w-full text-center">
                    order {item.order}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/gallery/edit?id=${item._id}`}
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

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Add More Images to This Group
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Upload one or many more images (10+) — they'll join this same
            group.
          </p>
          <BulkImageUploader
            lockCategory
            initialCategory={category}
            initialBatchId={batchId}
            onComplete={fetchGroup}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function GalleryGroupPage() {
  return (
    <Suspense
      fallback={<div className="py-12 text-center text-slate-500">Loading...</div>}
    >
      <GalleryGroupContent />
    </Suspense>
  );
}
