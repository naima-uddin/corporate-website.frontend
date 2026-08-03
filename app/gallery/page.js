import CompanyGallery from "@/components/home-page-components/CompanyGallery";
import React from "react";

export const metadata = {
  title: "Gallery | A2IT Ltd | Our Office & Team",
  description:
    "Take a look inside A2IT Ltd — our office, our team, and the collaborative environment behind our IT, web development, and digital solutions.",
  keywords: [
    "A2IT Gallery",
    "A2IT Office",
    "A2IT Team",
    "IT Company Gallery",
  ],
  alternates: {
    canonical: "https://a2itltd.com/gallery",
  },
  openGraph: {
    title: "Gallery | A2IT Ltd | Our Office & Team",
    description:
      "Take a look inside A2IT Ltd — our office, our team, and the collaborative environment behind our IT solutions.",
    url: "https://a2itltd.com/gallery",
    siteName: "A2IT Ltd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | A2IT Ltd | Our Office & Team",
    description:
      "Take a look inside A2IT Ltd — our office, our team, and the collaborative environment behind our IT solutions.",
  },
};

export default function Page() {
  return (
    <div className="pt-10">
      <CompanyGallery />
    </div>
  );
}
