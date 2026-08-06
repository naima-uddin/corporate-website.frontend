"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyJoinUs = {
  title: "Join Us",
  description: "",
  buttonText: "Know More",
  buttonLink: "",
  cards: [
    { image: "", publicId: "", label: "Job Opportunities", link: "" },
    { image: "", publicId: "", label: "Our Values", link: "" },
    { image: "", publicId: "", label: "Life at Adani", link: "" },
    { image: "", publicId: "", label: "Diversity & Inclusion", link: "" },
  ],
};

const CARD_HINTS = [
  "Large card on the left",
  "Small card",
  "Small card",
  "Small card",
];

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

export default function JoinUsPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const [joinUs, setJoinUs] = useState(emptyJoinUs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJoinUs();
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

  const fetchJoinUs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.joinUs) {
          const cards =
            Array.isArray(data.joinUs.cards) && data.joinUs.cards.length === 4
              ? data.joinUs.cards
              : emptyJoinUs.cards;
          setJoinUs({ ...emptyJoinUs, ...data.joinUs, cards });
        }
      }
    } catch (err) {
      console.error("Error fetching join us section:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCard = (index, field, value) => {
    setJoinUs((prev) => {
      const cards = [...prev.cards];
      cards[index] = { ...cards[index], [field]: value };
      return { ...prev, cards };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/join-us`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(joinUs),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setJoinUs({ ...emptyJoinUs, ...data.joinUs });
        setMessage("Join Us section saved successfully.");
      } else {
        setError("Failed to save join us section.");
      }
    } catch (err) {
      console.error("Error saving join us section:", err);
      setError("Failed to save join us section.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading join us section...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Us</h1>
        <p className="text-slate-600">
          Manage the &quot;Join Us&quot; section shown on the homepage —
          heading, description, button and the four image cards.
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

      <SectionCard title="Heading & Button">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={joinUs.title}
            onChange={(e) =>
              setJoinUs((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Join Us"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={joinUs.description}
            onChange={(e) =>
              setJoinUs((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="We foster a culture where people with a can-do attitude can be a part of our growing team."
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 "
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={joinUs.buttonText}
              onChange={(e) =>
                setJoinUs((prev) => ({ ...prev, buttonText: e.target.value }))
              }
              placeholder="Know More"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Button Link
            </label>
            <input
              type="text"
              value={joinUs.buttonLink}
              onChange={(e) =>
                setJoinUs((prev) => ({ ...prev, buttonLink: e.target.value }))
              }
              placeholder="https://..."
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <p className="mt-2 text-xs text-slate-500">
              Leave blank to hide the button.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Cards">
        <p className="text-sm text-slate-500 -mt-1">
          The first card renders larger on the left; the remaining three are
          equal-width cards next to it.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {joinUs.cards.map((card, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-2"
            >
              <p className="text-sm font-semibold text-slate-700">
                Card {index + 1}{" "}
                <span className="font-normal text-slate-400">
                  ({CARD_HINTS[index]})
                </span>
              </p>

              <ImageUploadFactory
                type="join-us"
                label="Image"
                onImageUploaded={(url) => updateCard(index, "image", url || "")}
                currentImage={card.image}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={card.label}
                  onChange={(e) => updateCard(index, "label", e.target.value)}
                  placeholder="e.g. Job Opportunities"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={card.link}
                  onChange={(e) => updateCard(index, "link", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
                {index === 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Tip: set this to <code>/careers</code> to link to the Job
                    Opportunities page managed under{" "}
                    <span className="font-semibold">Job Opportunities</span>{" "}
                    in the sidebar.
                  </p>
                )}
              </div>
            </div>
          ))}
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
          {saving ? "Saving..." : "Save Join Us"}
        </button>
      </div>
    </div>
  );
}
