"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PortfolioForm from "../PortfolioForm";

const emptyForm = {
  title: "",
  description: "",
  category: [],
  image: "",
  link: "",
  client: "",
  contractNo: "",
  location: "",
  contractValue: "",
  status: "Completed",
  completionYear: "",
  technologies: "",
  duration: "",
  teamSize: "",
  role: "",
  challenge: "",
  solution: "",
  result: "",
  features: "",
  metrics: "",
};

export default function NewPortfolioPage() {
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const features = form.features
        ? form.features
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f)
        : [];

      const metrics = form.metrics
        ? form.metrics
            .split("\n")
            .map((m) => {
              const [value, label] = m.split("|").map((s) => s.trim());
              return value && label ? { value, label } : null;
            })
            .filter((m) => m)
        : [];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            technologies: form.technologies.split(",").map((t) => t.trim()),
            features,
            metrics,
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/portfolio");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save project");
      }
    } catch (err) {
      console.error("Error saving portfolio:", err);
      setError("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortfolioForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Create New Project"
      submitLabel="Create Project"
    />
  );
}
