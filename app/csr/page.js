import CSR from "@/components/csr-page-component/CSR";
import React from "react";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Corporate Social Responsibility | ${site.siteName}`,
    description: `${site.siteName}'s corporate social responsibility initiatives — our commitment to giving back to the community, education and sustainable development.`,
    keywords: [
      `${site.siteName} CSR`,
      "Corporate Social Responsibility",
      "Community Initiatives",
      site.siteName,
    ],
    alternates: {
      canonical: "https://a2itltd.com/csr",
    },
    openGraph: {
      title: `Corporate Social Responsibility | ${site.siteName}`,
      description: `${site.siteName}'s corporate social responsibility initiatives and community impact.`,
      url: "https://a2itltd.com/csr",
      siteName: site.siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Corporate Social Responsibility | ${site.siteName}`,
      description: `${site.siteName}'s corporate social responsibility initiatives and community impact.`,
    },
  };
}

export default function Page() {
  return <CSR />;
}
