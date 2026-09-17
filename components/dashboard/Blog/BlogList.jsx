"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/api/authFetch";
import { Plus, RefreshCw, Trash2, Edit2 } from "lucide-react";
import SearchInput from "@/app/dashboard/components/ui/SearchInput";
import EmptyState from "@/app/dashboard/components/ui/EmptyState";
import Badge from "@/app/dashboard/components/ui/Badge";
import { ActionButton, IconButton } from "@/app/dashboard/components/ui/Buttons";

export default function BlogList() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const { user, canAccess } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  const load = async () => {
    setLoading(true);
    try {
      const r = await authFetch(
        `${API}/api/blog/admin/blogs?page=${page}&limit=20`,
      );
      const data = await r.json();
      if (data.success) {
        const filtered = (data.blogs || []).filter(
          (i) => i.status !== "archived",
        );
        setItems(filtered);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const router = useRouter();
  const handleEdit = (post) => router.push(`/dashboard/blog/edit?id=${post._id}`);
  const handleDelete = async (id, force = true) => {
    const msg = force
      ? "Permanently delete this post? This cannot be undone."
      : "Archive this post?";
    if (!confirm(msg)) return;

    const url = `${API}/api/blog/admin/blogs/${id}`;
    const r = await authFetch(url, { method: "DELETE" });
    const b = await r.json();
    if (!r.ok) return alert(b.error || "Failed");
    load();
  };

  const filteredItems = items.filter((p) =>
    (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!canAccess("blog")) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Access Denied.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-md flex-1">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog posts..."
          />
        </div>
        <div className="flex items-center gap-2">
          <ActionButton variant="secondary" onClick={load} size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </ActionButton>
          <ActionButton href="/dashboard/blog/new" size="sm">
            <Plus className="h-4 w-4" />
            New Post
          </ActionButton>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={
            searchQuery ? "No posts match your search." : "No posts yet."
          }
          description={!searchQuery ? "Create your first blog post." : undefined}
          action={
            !searchQuery && (
              <ActionButton href="/dashboard/blog/new" size="sm">
                <Plus className="h-4 w-4" />
                New Post
              </ActionButton>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((p) => (
                  <tr key={p._id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-slate-900">
                        {p.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {p.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Badge tone={p.status === "published" ? "green" : "slate"}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          onClick={() => handleEdit(p)}
                          tone="blue"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </IconButton>
                        {isAdmin && (
                          <IconButton
                            onClick={() => handleDelete(p._id)}
                            tone="red"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
