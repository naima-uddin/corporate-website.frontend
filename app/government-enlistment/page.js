import GovernmentEnlistment from "@/components/government-enlistment-page-component/GovernmentEnlistment";
import React from "react";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Government Enlistment | ${site.siteName}`,
    description: `${site.siteName}'s government enlistment credentials — a trusted IT service provider recognized for delivering compliant technology solutions to public sector organizations.`,
    keywords: [
      `${site.siteName} Government Enlistment`,
      "Government IT Vendor",
      "Public Sector IT Services",
      site.siteName,
    ],
    alternates: {
      canonical: "https://a2itltd.com/government-enlistment",
    },
    openGraph: {
      title: `Government Enlistment | ${site.siteName}`,
      description: `${site.siteName}'s government enlistment credentials — a trusted IT service provider for public sector organizations.`,
      url: "https://a2itltd.com/government-enlistment",
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Government Enlistment | ${site.siteName}`,
      description: `${site.siteName}'s government enlistment credentials — a trusted IT service provider for public sector organizations.`,
    },
  };
}

export default function Page() {
  return <GovernmentEnlistment />;
}
