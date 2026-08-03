"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";
import RichTextEditor from "../components/forms/RichTextEditor";

const emptySpotlight = {
  image: "",
  publicId: "",
  quote: "",
  name: "",
  designation: "",
  profileLink: "",
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

export default function SpotlightPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [spotlight, setSpotlight] = useState(emptySpotlight);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSpotlight();
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

  const fetchSpotlight = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/spotlight/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.spotlight) {
          setSpotlight({ ...emptySpotlight, ...data.spotlight });
        }
      }
    } catch (err) {
      console.error("Error fetching spotlight:", err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/spotlight`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(spotlight),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setSpotlight({ ...emptySpotlight, ...data.spotlight });
        setMessage("Spotlight saved successfully.");
      } else {
        setError("Failed to save spotlight.");
      }
    } catch (err) {
      console.error("Error saving spotlight:", err);
      setError("Failed to save spotlight.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading spotlight...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Leadership Spotlight
        </h1>
        <p className="text-slate-600">
          The photo, quote and profile shown in the &quot;Who We Are&quot;
          section of the homepage.
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

      <SectionCard title="Photo & Quote">
        <ImageUploadFactory
          type="spotlight"
          label="Photo"
          onImageUploaded={(url) =>
            setSpotlight((prev) => ({ ...prev, image: url || "" }))
          }
          currentImage={spotlight.image}
        />

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Quote
          </label>
          <RichTextEditor
            value={spotlight.quote}
            onChange={(html) =>
              setSpotlight((prev) => ({ ...prev, quote: html }))
            }
            placeholder="The wars that we have to fight today are often invisible..."
          />
          <p className="mt-2 text-xs text-slate-500">
            Select (highlight) text and use the toolbar to make it bold,
            italic, underlined, a different color, or resize it with the
            number box. Click where you want a line break and use +/- to add
            or remove space between lines. It will appear exactly like this
            on the homepage.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={spotlight.name}
              onChange={(e) =>
                setSpotlight((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Gautam Adani"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              value={spotlight.designation}
              onChange={(e) =>
                setSpotlight((prev) => ({
                  ...prev,
                  designation: e.target.value,
                }))
              }
              placeholder="e.g. Chairman, Adani Group"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            View Profile Link
          </label>
          <input
            type="text"
            value={spotlight.profileLink}
            onChange={(e) =>
              setSpotlight((prev) => ({
                ...prev,
                profileLink: e.target.value,
              }))
            }
            placeholder="https://..."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
          <p className="mt-2 text-xs text-slate-500">
            Leave blank to hide the &quot;View Profile&quot; button.
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
          {saving ? "Saving..." : "Save Spotlight"}
        </button>
      </div>
    </div>
  );
}
