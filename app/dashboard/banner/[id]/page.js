"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BannerForm from "../BannerForm";

const emptyForm = {
  image: "",
  title: "",
  subtitle: "",
  buttonText: "",
  buttonLink: "",
  order: 0,
};

export default function EditBannerPage({ params }) {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/banners/admin/all`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const item = (data.banners || []).find((b) => b._id === id);
          if (!item) {
            setNotFound(true);
            return;
          }
          setForm({
            image: item.image || "",
            title: item.title || "",
            subtitle: item.subtitle || "",
            buttonText: item.buttonText || "",
            buttonLink: item.buttonLink || "",
            order: item.order ?? 0,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
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
      setError("Please upload a banner image first");
      return;
    }
    if (!form.title.trim()) {
      setError("Please provide a banner title");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            order: Number(form.order) || 0,
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/banner");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save banner");
      }
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner");
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
        Banner slide not found.
      </div>
    );
  }

  return (
    <BannerForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit Slide"
      submitLabel="Update Slide"
    />
  );
}
