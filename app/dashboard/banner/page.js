"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Power, Pencil, X } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyForm = {
  image: "",
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  order: 0,
};

export default function BannerPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

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

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const handleEditClick = (banner) => {
    setEditingId(banner._id);
    setForm({
      image: banner.image || "",
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      order: banner.order ?? 0,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    if (!form.image) {
      setError("Please upload a banner image first");
      return;
    }
    if (!form.title.trim()) {
      setError("Please provide a banner title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/banners`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          order: Number(form.order) || 0,
        }),
      });

      if (response.ok) {
        resetForm();
        fetchBanners();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save banner");
      }
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner");
    } finally {
      setSaving(false);
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
        if (editingId === id) resetForm();
        fetchBanners();
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
    }
  };

  return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Manage Banner
          </h1>
          <p className="text-slate-600">
            Control the homepage hero slider — each slide shows one at a time
            as a full-width banner, in the order set below.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Slide" : "Add New Slide"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" /> Cancel edit
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
            <ImageUploadFactory
              type="banners"
              label="Banner Image"
              onImageUploaded={(url) =>
                setForm((prev) => ({ ...prev, image: url }))
              }
              currentImage={form.image}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handleFieldChange("title")}
                  placeholder="e.g. Never Stop Exploring The World"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  value={form.subtitle}
                  onChange={handleFieldChange("subtitle")}
                  rows={2}
                  placeholder="Short supporting text under the title"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={handleFieldChange("buttonText")}
                  placeholder="e.g. Learn More"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={form.buttonLink}
                  onChange={handleFieldChange("buttonLink")}
                  placeholder="e.g. /contact"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Order (0 shows first)
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={handleFieldChange("order")}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.image}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {saving ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
            </button>
          </div>
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
                      <button
                        onClick={() => handleEditClick(banner)}
                        title="Edit slide"
                        className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
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
