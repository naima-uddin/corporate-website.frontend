"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserForm from "../UserForm";

const emptyForm = { name: "", email: "", password: "", role: "moderator" };

export default function NewUserPage() {
  const { token, isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Access Denied. Admin only.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/create`,
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
        router.push("/dashboard/users");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Create New User"
      submitLabel="Create"
      isEditing={false}
    />
  );
}
