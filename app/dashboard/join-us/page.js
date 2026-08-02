"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Trash2, Power, Pencil, X, Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyCardForm = {
  image: "",
  title: "",
  link: "",
  order: 0,
};

export default function JoinUsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [settings, setSettings] = useState({
    heading: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");

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
    fetchJoinUs();
  }, [token]);

  const fetchJoinUs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
        setSettings({
          heading: data.settings?.heading || "",
          subtitle: data.settings?.subtitle || "",
          buttonText: data.settings?.buttonText || "",
          buttonLink: data.settings?.buttonLink || "",
        });
      }
    } catch (err) {
      console.error("Error fetching Join Us section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsFieldChange = (field) => (e) => {
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/settings`,
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
        setSettingsMessage("Section text saved.");
      } else {
        setSettingsMessage("Failed to save section text.");
      }
    } catch (err) {
      console.error("Error saving Join Us settings:", err);
      setSettingsMessage("Failed to save section text.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCardFieldChange = (field) => (e) => {
    setCardForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const resetCardForm = () => {
    setCardForm(emptyCardForm);
    setEditingId(null);
    setError("");
  };

  const handleEditClick = (card) => {
    setEditingId(card._id);
    setCardForm({
      image: card.image || "",
      title: card.title || "",
      link: card.link || "",
      order: card.order ?? 0,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveCard = async () => {
    if (!cardForm.image) {
      setError("Please upload a card image first");
      return;
    }
    if (!cardForm.title.trim()) {
      setError("Please provide a card title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/cards/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/cards`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...cardForm,
          order: Number(cardForm.order) || 0,
        }),
      });

      if (response.ok) {
        resetCardForm();
        fetchJoinUs();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save card");
      }
    } catch (err) {
      console.error("Error saving Join Us card:", err);
      setError("Failed to save card");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (card) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/cards/${card._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !card.isActive }),
        },
      );

      if (response.ok) fetchJoinUs();
    } catch (err) {
      console.error("Error updating Join Us card:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/cards/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        if (editingId === id) resetCardForm();
        fetchJoinUs();
      }
    } catch (err) {
      console.error("Error deleting Join Us card:", err);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Manage Join Us
        </h1>
        <p className="text-slate-600">
          Control the homepage &quot;Join Us&quot; section — the first card
          (lowest order) shows larger, the rest show at a comparatively
          smaller width.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-slate-900">Section Text</h2>

        {settingsMessage && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-cyan-700 text-sm">
            {settingsMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Heading
            </label>
            <input
              type="text"
              value={settings.heading}
              onChange={handleSettingsFieldChange("heading")}
              placeholder="e.g. Join Us"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={settings.subtitle}
              onChange={handleSettingsFieldChange("subtitle")}
              rows={2}
              placeholder="Short supporting text under the heading"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={settings.buttonText}
              onChange={handleSettingsFieldChange("buttonText")}
              placeholder="e.g. Know More"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Button Link
            </label>
            <input
              type="text"
              value={settings.buttonLink}
              onChange={handleSettingsFieldChange("buttonLink")}
              placeholder="e.g. /careers"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {savingSettings ? "Saving..." : "Save Section Text"}
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {editingId ? "Edit Card" : "Add New Card"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetCardForm}
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
            type="join-us"
            label="Card Image"
            onImageUploaded={(url) =>
              setCardForm((prev) => ({ ...prev, image: url }))
            }
            currentImage={cardForm.image}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={cardForm.title}
                onChange={handleCardFieldChange("title")}
                placeholder="e.g. Job Opportunities"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Link
              </label>
              <input
                type="text"
                value={cardForm.link}
                onChange={handleCardFieldChange("link")}
                placeholder="e.g. /careers"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Order (0 shows first / larger)
              </label>
              <input
                type="number"
                value={cardForm.order}
                onChange={handleCardFieldChange("order")}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveCard}
            disabled={saving || !cardForm.image}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {saving ? "Saving..." : editingId ? "Update Card" : "Add Card"}
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
            Current Cards ({cards.length})
          </h2>

          {cards.length === 0 ? (
            <p className="text-slate-500 text-sm">No Join Us cards yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => (
                <div
                  key={card._id}
                  className={`relative border rounded-lg overflow-hidden flex flex-col ${
                    card.isActive
                      ? "border-slate-200"
                      : "border-slate-200 opacity-50"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3 flex-1 flex flex-col gap-1">
                    <p className="text-xs text-slate-400">
                      Order: {card.order}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {card.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {card.link || "—"}
                    </p>
                  </div>
                  <div className="flex gap-2 p-3 pt-0">
                    <button
                      onClick={() => handleEditClick(card)}
                      title="Edit card"
                      className="p-2 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(card)}
                      title={card.isActive ? "Hide from site" : "Show on site"}
                      className={`p-2 rounded ${
                        card.isActive
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(card._id)}
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
