"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Power, Pencil } from "lucide-react";

export default function BannerPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [token]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${banner._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !banner.isActive }),
        },
      );

      if (response.ok) fetchBanners();
    } catch (err) {
      console.error("Error updating banner:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner slide?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        fetchBanners();
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
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
            Manage Banner
          </h1>
          <p className="text-slate-600">
            Control the homepage hero slider — each slide shows one at a time
            as a full-width banner, in the order set below.
          </p>
        </div>
        <Link
          href="/dashboard/banner/new"
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Slide
        </Link>
      </motion.div>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Current Slides ({banners.length})
          </h2>

          {banners.length === 0 ? (
            <p className="text-slate-500 text-sm">No banner slides yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className={`relative border rounded-lg overflow-hidden flex flex-col ${
                    banner.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <p className="text-xs text-slate-400">
                      Order: {banner.order}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {banner.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {banner.subtitle || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 p-3 pt-0">
                    <Link
                      href={`/dashboard/banner/${banner._id}`}
                      title="Edit slide"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? "Hide from site" : "Show on site"}
                      className={`p-2 rounded ${
                        banner.isActive
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(banner._id)}
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
