"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NewsForm from "../NewsForm";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  isFeatured: false,
  status: "draft",
  publishDate: "",
};

export default function NewNewsPage() {
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

    if (!form.title.trim()) {
      setError("Please provide a title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            publishDate: form.publishDate || undefined,
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/news");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save news item");
      }
    } catch (err) {
      console.error("Error saving news item:", err);
      setError("Failed to save news item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <NewsForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Add News Item"
      submitLabel="Add News Item"
    />
  );
}
