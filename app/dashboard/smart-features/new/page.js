"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SmartFeatureForm from "../SmartFeatureForm";

const emptyForm = {
  style: "light",
  title: "",
  description: "",
  image: "",
  statValue: "",
  statLabel: "",
  badge: "",
  order: 0,
};

export default function NewSmartFeaturePage() {
  const { token, canAccess } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!canAccess("smart-features")) {
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

    if (!form.title) {
      setError("Please provide a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/smart-features`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/smart-features");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save feature");
      }
    } catch (err) {
      console.error("Error saving smart feature:", err);
      setError("Failed to save feature");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SmartFeatureForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Add Feature Card"
      submitLabel="Add Card"
    />
  );
}
