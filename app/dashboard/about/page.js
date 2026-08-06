"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import ImageUploadFactory from "../components/forms/ImageUploadFactory";

const emptyAbout = {
  whoWeAre: {
    label: "Who We Are",
    heading: "",
    body: "",
    image: "",
    publicId: "",
  },
  mission: { label: "Our Mission", heading: "", body: "", image: "", publicId: "" },
  vision: { label: "Our Vision", heading: "", body: "", image: "", publicId: "" },
  boardOfDirectors: [],
  ourStory: {
    label: "Our Story",
    heading: "",
    milestones: [],
  },
  awards: [],
};

const emptyMember = {
  image: "",
  publicId: "",
  name: "",
  title: "",
  speech: "",
};

const emptyMilestone = { year: "", description: "" };

const emptyAward = { image: "", publicId: "", title: "", description: "" };

const SectionCard = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4"
  >
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
    </div>
    {children}
  </motion.div>
);

export default function AboutPageAdmin() {
  const { token, isAdmin, isModerator } = useAuth();
  const [about, setAbout] = useState(emptyAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/about/admin`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.about) {
          setAbout({
            ...emptyAbout,
            ...data.about,
            whoWeAre: { ...emptyAbout.whoWeAre, ...data.about.whoWeAre },
            mission: { ...emptyAbout.mission, ...data.about.mission },
            vision: { ...emptyAbout.vision, ...data.about.vision },
            boardOfDirectors: Array.isArray(data.about.boardOfDirectors)
              ? data.about.boardOfDirectors
              : [],
            ourStory: {
              ...emptyAbout.ourStory,
              ...data.about.ourStory,
              milestones: Array.isArray(data.about.ourStory?.milestones)
                ? data.about.ourStory.milestones
                : [],
            },
            awards: Array.isArray(data.about.awards) ? data.about.awards : [],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching about page:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = (section, field, value) => {
    setAbout((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateMember = (index, field, value) => {
    setAbout((prev) => {
      const boardOfDirectors = [...prev.boardOfDirectors];
      boardOfDirectors[index] = { ...boardOfDirectors[index], [field]: value };
      return { ...prev, boardOfDirectors };
    });
  };

  const addMember = () => {
    setAbout((prev) => ({
      ...prev,
      boardOfDirectors: [...prev.boardOfDirectors, { ...emptyMember }],
    }));
  };

  const removeMember = (index) => {
    setAbout((prev) => ({
      ...prev,
      boardOfDirectors: prev.boardOfDirectors.filter((_, i) => i !== index),
    }));
  };

  const updateMilestone = (index, field, value) => {
    setAbout((prev) => {
      const milestones = [...prev.ourStory.milestones];
      milestones[index] = { ...milestones[index], [field]: value };
      return { ...prev, ourStory: { ...prev.ourStory, milestones } };
    });
  };

  const addMilestone = () => {
    setAbout((prev) => ({
      ...prev,
      ourStory: {
        ...prev.ourStory,
        milestones: [...prev.ourStory.milestones, { ...emptyMilestone }],
      },
    }));
  };

  const removeMilestone = (index) => {
    setAbout((prev) => ({
      ...prev,
      ourStory: {
        ...prev.ourStory,
        milestones: prev.ourStory.milestones.filter((_, i) => i !== index),
      },
    }));
  };

  const updateAward = (index, field, value) => {
    setAbout((prev) => {
      const awards = [...prev.awards];
      awards[index] = { ...awards[index], [field]: value };
      return { ...prev, awards };
    });
  };

  const addAward = () => {
    setAbout((prev) => ({
      ...prev,
      awards: [...prev.awards, { ...emptyAward }],
    }));
  };

  const removeAward = (index) => {
    setAbout((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/about`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(about),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setAbout((prev) => ({ ...prev, ...data.about }));
        setMessage("About page saved successfully.");
      } else {
        setError("Failed to save about page.");
      }
    } catch (err) {
      console.error("Error saving about page:", err);
      setError("Failed to save about page.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAbout();
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

  if (loading) {
    return <p className="text-slate-500 text-sm">Loading about page...</p>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">About Page</h1>
        <p className="text-slate-600">
          Manage the &quot;About Us&quot; page — Who We Are, Mission &amp;
          Vision, Board of Directors and Our Story.
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

      <SectionCard
        title="1. Who We Are"
        description="Shown first on the About page."
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={about.whoWeAre.heading}
            onChange={(e) =>
              updateSection("whoWeAre", "heading", e.target.value)
            }
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Body
          </label>
          <textarea
            rows={4}
            value={about.whoWeAre.body}
            onChange={(e) => updateSection("whoWeAre", "body", e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>
        <ImageUploadFactory
          type="about"
          label="Image"
          onImageUploaded={(url) => updateSection("whoWeAre", "image", url || "")}
          currentImage={about.whoWeAre.image}
        />
      </SectionCard>

      <SectionCard
        title="2. Mission &amp; Vision"
        description="Shown second on the About page."
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Mission</p>
            <input
              type="text"
              value={about.mission.heading}
              onChange={(e) =>
                updateSection("mission", "heading", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <textarea
              rows={4}
              value={about.mission.body}
              onChange={(e) => updateSection("mission", "body", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <ImageUploadFactory
              type="about"
              label="Image (optional)"
              onImageUploaded={(url) =>
                updateSection("mission", "image", url || "")
              }
              currentImage={about.mission.image}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-700">Vision</p>
            <input
              type="text"
              value={about.vision.heading}
              onChange={(e) =>
                updateSection("vision", "heading", e.target.value)
              }
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <textarea
              rows={4}
              value={about.vision.body}
              onChange={(e) => updateSection("vision", "body", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
            />
            <ImageUploadFactory
              type="about"
              label="Image (optional)"
              onImageUploaded={(url) =>
                updateSection("vision", "image", url || "")
              }
              currentImage={about.vision.image}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="3. Meet Our Board of Directors"
        description="Shown third on the About page, in a single row."
      >
        <div className="space-y-6">
          {about.boardOfDirectors.map((member, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Member {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <ImageUploadFactory
                type="about"
                label="Photo"
                onImageUploaded={(url) => updateMember(index, "image", url || "")}
                currentImage={member.image}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={member.title}
                    onChange={(e) => updateMember(index, "title", e.target.value)}
                    placeholder="e.g. Chairman, Managing Director"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Speech (optional)
                </label>
                <textarea
                  rows={4}
                  value={member.speech}
                  onChange={(e) => updateMember(index, "speech", e.target.value)}
                  placeholder="If filled, an arrow will show next to this member's name on the About page, opening this speech in a popup."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Add Board Member
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="4. Our Story"
        description="Shown fourth on the About page, as a year-by-year timeline."
      >
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={about.ourStory.heading}
            onChange={(e) =>
              updateSection("ourStory", "heading", e.target.value)
            }
            placeholder="The journey so far"
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
          />
        </div>

        <div className="space-y-4">
          {about.ourStory.milestones.map((milestone, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Step {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeMilestone(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={milestone.year}
                  onChange={(e) =>
                    updateMilestone(index, "year", e.target.value)
                  }
                  placeholder="e.g. 2012"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What happened
                </label>
                <textarea
                  rows={3}
                  value={milestone.description}
                  onChange={(e) =>
                    updateMilestone(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMilestone}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="5. Awards & Accolades"
        description="Optional. Shown at the bottom of the About page. Leave empty to hide this section."
      >
        <div className="space-y-6">
          {about.awards.map((award, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Award {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>

              <ImageUploadFactory
                type="about"
                label="Image"
                onImageUploaded={(url) => updateAward(index, "image", url || "")}
                currentImage={award.image}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={award.title}
                  onChange={(e) => updateAward(index, "title", e.target.value)}
                  placeholder="e.g. Best Supplier Award"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={award.description}
                  onChange={(e) =>
                    updateAward(index, "description", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAward}
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Add Award
          </button>
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
          {saving ? "Saving..." : "Save About Page"}
        </button>
      </div>
    </div>
  );
}
