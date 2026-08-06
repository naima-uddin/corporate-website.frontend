import Careers from "@/components/careers-page-component/Careers";
import React from "react";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Careers | ${site.siteName}`,
    description: `Explore current job opportunities at ${site.siteName} and join a growing team delivering technology solutions.`,
    keywords: [
      `${site.siteName} Careers`,
      "Job Opportunities",
      "Jobs",
      site.siteName,
    ],
    alternates: {
      canonical: "https://a2itltd.com/careers",
    },
    openGraph: {
      title: `Careers | ${site.siteName}`,
      description: `Explore current job opportunities at ${site.siteName}.`,
      url: "https://a2itltd.com/careers",
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Careers | ${site.siteName}`,
      description: `Explore current job opportunities at ${site.siteName}.`,
    },
  };
}

export default function Page() {
  return <Careers />;
}
