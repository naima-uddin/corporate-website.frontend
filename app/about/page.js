import About from "@/components/about-page-compoent/About";
import React from "react";
import { getSiteInfo, resolveLogoUrl } from "@/lib/siteInfo";

// 🔹 SEO metadata for About Us
export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `About Us | ${site.siteName}`,
    description: `Learn more about ${site.siteName}, our mission, vision, and the team driving innovation in IT, eCommerce, web development, and digital solutions.`,
    keywords: [
      site.siteName,
      "About Us",
      "IT Company",
      "Tech Solutions",
      "Web Development",
      "eCommerce",
      "Digital Marketing",
    ],
    alternates: {
      canonical: "https://a2itltd.com/about",
    },
    openGraph: {
      title: `About Us | ${site.siteName}`,
      description: `Discover ${site.siteName}, our mission, vision, and dedicated team providing IT services, eCommerce solutions, and digital innovation worldwide.`,
      url: "https://a2itltd.com/about",
      siteName: site.siteName,
      images: [
        {
          url: "/og-about.jpg",
          width: 1200,
          height: 630,
          alt: `About ${site.siteName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `About Us | ${site.siteName}`,
      description: `Learn about ${site.siteName}'s mission, vision, and team providing innovative IT, eCommerce, and digital solutions.`,
      images: ["/og-about.jpg"],
    },
  };
}

export default async function Page() {
  const site = await getSiteInfo();

  return (
    <>
      <About />

      {/* 🔹 Schema Markup for About Us */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Us",
            url: "https://a2itltd.com/about",
            description: `Learn more about ${site.siteName}, our mission, vision, and the team driving innovation in IT services, eCommerce, and digital solutions.`,
            publisher: {
              "@type": "Organization",
              name: site.siteName,
              url: "https://a2itltd.com",
              logo: resolveLogoUrl(site.logoImage),
            },
          }),
        }}
      />
    </>
  );
}
