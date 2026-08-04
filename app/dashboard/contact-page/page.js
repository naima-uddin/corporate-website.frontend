"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const emptySettings = {
  eyebrow: "",
  heading: "",
  address: "",
  phone: "",
  email: "",
  workingHours: "",
  mapLat: "",
  mapLng: "",
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

const TextField = ({ label, value, onChange, placeholder, hint, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
    />
    {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
  </div>
);

export default function ContactPageSettingsPage() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-settings/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings({ ...emptySettings, ...data.settings });
        }
      }
    } catch (err) {
      console.error("Error fetching contact settings:", err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact-settings`,
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
        setMessage("Contact page settings saved successfully.");
      } else {
        setError("Failed to save contact page settings.");
      }
    } catch (err) {
      console.error("Error saving contact settings:", err);
      setError("Failed to save contact page settings.");
    } finally {
      setSaving(false);
    }
  };

  const update = (field) => (e) =>
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading contact page settings...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Contact Page
        </h1>
        <p className="text-slate-600">
          The heading, address, contact details, and map location shown on
          the public Contact page.
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

      <SectionCard title="Page Heading">
        <TextField
          label="Eyebrow"
          value={settings.eyebrow}
          onChange={update("eyebrow")}
          placeholder="e.g. Contact Us"
        />
        <TextField
          label="Heading Prefix"
          value={settings.heading}
          onChange={update("heading")}
          placeholder="e.g. Connect with"
          hint="The site name is appended automatically after this text."
        />
      </SectionCard>

      <SectionCard title="Address & Contact Details">
        <TextField
          label="Address"
          value={settings.address}
          onChange={update("address")}
          placeholder="Office address"
        />
        <TextField
          label="Phone"
          value={settings.phone}
          onChange={update("phone")}
          placeholder="+880 1234 567890"
        />
        <TextField
          label="Email"
          value={settings.email}
          onChange={update("email")}
          placeholder="info@example.com"
          type="email"
        />
        <TextField
          label="Working Hours"
          value={settings.workingHours}
          onChange={update("workingHours")}
          placeholder="Saturday - Friday: 10AM - 7PM"
        />
      </SectionCard>

      <SectionCard title="Map Location">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Latitude"
            value={settings.mapLat}
            onChange={update("mapLat")}
            placeholder="23.836236"
            type="number"
          />
          <TextField
            label="Longitude"
            value={settings.mapLng}
            onChange={update("mapLng")}
            placeholder="90.358672"
            type="number"
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving..." : "Save Contact Page"}
        </button>
      </div>
    </div>
  );
}
