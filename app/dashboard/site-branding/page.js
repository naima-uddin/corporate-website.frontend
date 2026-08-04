"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptySettings = {
  siteName: "",
  logoImage: "",
  logoPublicId: "",
};

const SectionCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
  >
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    {children}
  </motion.div>
);

export default function SiteBrandingPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, [token]);

  if (!isAdmin && !isModerator) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">
          Access Denied. Admin or Moderator only.
        </p>
      </div>
    );
  }

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({ ...emptySettings, ...data.settings });
        }
      }
    } catch (err) {
      console.error("Error fetching site settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/site-settings`,
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
        setSettings({ ...emptySettings, ...data.settings });
        setMessage("Site branding saved successfully.");
      } else {
        setError("Failed to save site branding.");
      }
    } catch (err) {
      console.error("Error saving site settings:", err);
      setError("Failed to save site branding.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-slate-500 text-sm">Loading site branding...</p>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Site Branding
        </h1>
        <p className="text-slate-600">
          The logo and site name shown in the navbar (and anywhere else the
          logo appears) across the whole site.
        </p>
      </motion.div>

      {message && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-cyan-700 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <SectionCard title="Logo & Site Name">
        <ImageUploadFactory
          type="site-logo"
          label="Site Logo"
          onImageUploaded={(url) =>
            setSettings((prev) => ({ ...prev, logoImage: url || "" }))
          }
          currentImage={settings.logoImage}
        />

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, siteName: e.target.value }))
            }
            placeholder="e.g. MRH"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
          <p className="mt-2 text-xs text-slate-500">
            Shown next to the logo in the navbar.
          </p>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Branding"}
        </button>
      </div>
    </div>
  );
}
