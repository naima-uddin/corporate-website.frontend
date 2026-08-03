"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GalleryImageForm from "../GalleryImageForm";

const emptyForm = { image: "", title: "", category: "", order: 0 };

export default function NewGalleryImagePage() {
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

    if (!form.image) {
      setError("Please upload a gallery image first");
      return;
    }

    if (!form.title) {
      setError("Please provide a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images`,
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
        router.push("/dashboard/gallery");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save image");
      }
    } catch (err) {
      console.error("Error saving gallery image:", err);
      setError("Failed to save image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GalleryImageForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Add New Gallery Image"
      submitLabel="Add Image"
    />
  );
}
