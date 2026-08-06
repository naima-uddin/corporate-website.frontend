"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NewsForm from "../NewsForm";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  isFeatured: false,
  status: "draft",
  publishDate: "",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

function EditNewsContent() {
  const id = useSearchParams().get("id");
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token || !id) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/news/admin/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = data.news;
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({
            title: item.title || "",
            excerpt: item.excerpt || "",
            content: item.content || "",
            featuredImage: item.featuredImage || "",
            isFeatured: Boolean(item.isFeatured),
            status: item.status || "draft",
            publishDate: toDateInputValue(item.publishDate),
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [token, id]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`,
        {
          method: "PUT",
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

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">
        News item not found.
      </div>
    );
  }

  return (
    <NewsForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit News Item"
      submitLabel="Update News Item"
    />
  );
}

export default function EditNewsPage() {
  return (
    <Suspense
      fallback={<div className="py-12 text-center text-slate-500">Loading...</div>}
    >
      <EditNewsContent />
    </Suspense>
  );
}
