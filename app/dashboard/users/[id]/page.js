"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import UserForm from "../UserForm";

const emptyForm = { name: "", email: "", password: "", role: "moderator" };

export default function EditUserPage({ params }) {
  const { id } = use(params);
  const { token, isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const user = (data.users || []).find((u) => u._id === id);
          if (!user) {
            setNotFound(true);
            return;
          }
          setForm({
            name: user.name || "",
            email: user.email || "",
            password: "",
            role: user.role || "moderator",
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, id]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            role: form.role,
          }),
        },
      );

      if (response.ok) {
        router.push("/dashboard/users");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  if (notFound) {
    return (
      <div className="py-12 text-center text-slate-500">User not found.</div>
    );
  }

  return (
    <UserForm
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      saving={saving}
      error={error}
      heading="Edit User"
      submitLabel="Update"
      isEditing
    />
  );
}
