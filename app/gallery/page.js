import CompanyGallery from "@/components/home-page-components/CompanyGallery";
import React from "react";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Gallery | ${site.siteName} | Our Office & Team`,
    description: `Take a look inside ${site.siteName} — our office, our team, and the collaborative environment behind our IT, web development, and digital solutions.`,
    keywords: [
      `${site.siteName} Gallery`,
      `${site.siteName} Office`,
      `${site.siteName} Team`,
      "IT Company Gallery",
    ],
    alternates: {
      canonical: "https://a2itltd.com/gallery",
    },
    openGraph: {
      title: `Gallery | ${site.siteName} | Our Office & Team`,
      description: `Take a look inside ${site.siteName} — our office, our team, and the collaborative environment behind our IT solutions.`,
      url: "https://a2itltd.com/gallery",
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Gallery | ${site.siteName} | Our Office & Team`,
      description: `Take a look inside ${site.siteName} — our office, our team, and the collaborative environment behind our IT solutions.`,
    },
  };
}

export default function Page() {
  return (
    <div className="pt-10">
      <CompanyGallery />
    </div>
  );
}
