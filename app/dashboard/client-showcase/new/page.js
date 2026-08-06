"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ClientLogoForm from "../ClientLogoForm";

const emptyForm = { image: "" };

export default function NewClientLogoPage() {
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
      setError("Please upload a logo image first");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-logos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (response.ok) {
        router.push("/dashboard/client-showcase");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save logo");
      }
    } catch (err) {
      console.error("Error saving client logo:", err);
      setError("Failed to save logo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClientLogoForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Add New Logo"
      submitLabel="Add Logo"
    />
  );
}
