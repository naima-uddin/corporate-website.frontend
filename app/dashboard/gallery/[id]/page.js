"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GalleryImageForm from "../GalleryImageForm";
import BulkImageUploader from "../BulkImageUploader";

const emptyForm = { image: "", title: "", category: "", order: 0 };

export default function EditGalleryImagePage({ params }) {
  const { id } = use(params);
  const { token, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = (data.images || []).find((i) => i._id === id);
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({
            image: item.image || "",
            title: item.title || "",
            category: item.category || "",
            order: item.order ?? 0,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching gallery image:", err);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-images/${id}`,
        {
          method: "PUT",
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

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">
        Gallery image not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GalleryImageForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        heading="Edit Gallery Image"
        submitLabel="Update Image"
      />

      <div className="max-w-xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Add More Images to "{form.category || "this"}"
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Upload one or many more images (10+) tagged with this same
          category.
        </p>
        <BulkImageUploader lockCategory initialCategory={form.category} />
      </div>
    </div>
  );
}
