import React from "react";
import BlogAdminClient from "./BlogAdminClient";
import PageHeader from "../components/ui/PageHeader";

export default function BlogAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog / Content"
        description="Create and manage blog posts."
      />
      <BlogAdminClient />
    </div>
  );
}
