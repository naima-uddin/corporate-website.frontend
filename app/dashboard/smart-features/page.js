"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Power, Pencil, Save } from "lucide-react";

const STYLE_BADGE = {
  light: "bg-slate-100 text-slate-700",
  image: "bg-sky-100 text-sky-700",
  dark: "bg-blue-900 text-white",
};

export default function SmartFeaturesPage() {
  const { token, isAdmin, canAccess } = useAuth();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    eyebrow: "",
    title: "",
    titleAccent: "",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-feature-settings`,
      );
      if (response.ok) {
        const data = await response.json();
        setSettings({
          eyebrow: data.settings?.eyebrow || "",
          title: data.settings?.title || "",
          titleAccent: data.settings?.titleAccent || "",
        });
      }
    } catch (err) {
      console.error("Error fetching smart feature settings:", err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSettingsSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-feature-settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSettings({
          eyebrow: data.settings?.eyebrow || "",
          title: data.settings?.title || "",
          titleAccent: data.settings?.titleAccent || "",
        });
      }
    } catch (err) {
      console.error("Error saving smart feature settings:", err);
    } finally {
      setSettingsSaving(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || []);
      }
    } catch (err) {
      console.error("Error fetching smart features:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (feature) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features/${feature._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !feature.isActive }),
        },
      );
      if (response.ok) fetchFeatures();
    } catch (err) {
      console.error("Error updating smart feature:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feature card?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchFeatures();
    } catch (err) {
      console.error("Error deleting smart feature:", err);
    }
  };

  if (!canAccess("smart-features")) {
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
            Smart Features
          </h1>
          <p className="text-slate-600">
            Manage the feature cards shown after the &quot;Our Clients&quot;
            section on the homepage.
          </p>
        </div>
        <Link
          href="/dashboard/smart-features/new"
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </Link>
      </motion.div>

      {!settingsLoading && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveSettings}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Section Heading</h2>
            <p className="text-xs text-slate-500">
              Shown above the cards on the homepage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Eyebrow
              </label>
              <input
                type="text"
                value={settings.eyebrow}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, eyebrow: e.target.value }))
                }
                placeholder="Features"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Title (dark)
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Smart Features, Technology"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Title Accent (grey)
              </label>
              <input
                type="text"
                value={settings.titleAccent}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, titleAccent: e.target.value }))
                }
                placeholder="Driven Systems Designed"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={settingsSaving}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {settingsSaving ? "Saving..." : "Save Heading"}
            </button>
          </div>
        </motion.form>
      )}

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Feature Cards ({features.length})
          </h2>

          {features.length === 0 ? (
            <p className="text-slate-500 text-sm">No feature cards yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <div
                  key={feature._id}
                  className={`relative border rounded-lg p-4 flex flex-col gap-3 ${
                    feature.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        STYLE_BADGE[feature.style] || STYLE_BADGE.light
                      }`}
                    >
                      {feature.style}
                    </span>
                    <span className="text-xs text-slate-400">
                      #{feature.order}
                    </span>
                  </div>

                  {feature.style === "image" && feature.image && (
                    <img
                      src={feature.image}
                      alt=""
                      className="w-full h-24 object-cover rounded"
                    />
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {feature.description}
                      </p>
                    )}
                    {(feature.statValue || feature.badge) && (
                      <p className="text-xs text-slate-600 mt-2">
                        {feature.statValue && (
                          <span className="font-bold">{feature.statValue} </span>
                        )}
                        {feature.statLabel || feature.badge}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/dashboard/smart-features/edit?id=${feature._id}`}
                      title="Edit"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleActive(feature)}
                      title={feature.isActive ? "Hide from site" : "Show on site"}
                      className={`p-2 rounded ${
                        feature.isActive
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(feature._id)}
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
