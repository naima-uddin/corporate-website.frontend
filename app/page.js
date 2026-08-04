import Banner from "@/components/home-page-components/Banner";
import ClientShowcase from "@/components/home-page-components/ClientShowcase";
import JoinUs from "@/components/home-page-components/JoinUs";
import Newsroom from "@/components/home-page-components/Newsroom";
import WhatWeOffer from "@/components/home-page-components/WhatWeOffer";
import WhoRWe from "@/components/home-page-components/WhoRWe";
import React from "react";
import { getSiteInfo, getContactInfo, resolveLogoUrl } from "@/lib/siteInfo";

// 🔹 SEO metadata for Home Page
export async function generateMetadata() {
  const site = await getSiteInfo();
  const title = `${site.siteName} | IT Services, Web & eCommerce & Digital Solutions`;
  const ogTitle = `${site.siteName} | IT Services, Web Development, eCommerce & Digital Solutions`;

  return {
    title,
    description: `${site.siteName} provides professional IT services including web development, mobile apps, UI/UX design, eCommerce solutions, Shopify, Amazon & eBay services, SEO, and digital marketing.`,
    keywords: [
      site.siteName,
      "IT Services",
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "eCommerce Solutions",
      "Shopify",
      "Amazon",
      "eBay",
      "SEO",
      "Digital Marketing",
      "ERP Solutions",
      "Hosting",
    ],
    alternates: {
      canonical: "https://a2itltd.com",
    },
    openGraph: {
      title: ogTitle,
      description: `Discover ${site.siteName}'s expertise in IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions including Shopify, Amazon, and eBay.`,
      url: site.logoImage || "/A2ITLogo.png",
      siteName: site.siteName,
      images: [
        {
          url: site.logoImage || "/A2ITLogo.png", // 👉 add Home OG image in /public
          width: 1200,
          height: 630,
          alt: `${site.siteName} - IT Services and Digital Solutions`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: `${site.siteName} offers professional IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing.`,
      images: [site.logoImage || "/A2ITLogo.png"],
    },
  };
}

export default async function Home() {
  const [site, contact] = await Promise.all([getSiteInfo(), getContactInfo()]);

  return (
    <>
      <Banner />
      <WhoRWe />
      <WhatWeOffer />
      <Newsroom />
      <JoinUs />
      <ClientShowcase />

      {/* 🔹 Schema Markup for Home Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.siteName,
            url: "https://a2itltd.com",
            logo: resolveLogoUrl(site.logoImage),
            sameAs: [
              "https://www.facebook.com/",
              "https://www.linkedin.com/",
              "https://twitter.com/",
            ],
            description: `${site.siteName} provides IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.`,
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: contact.phone,
                email: contact.email,
                areaServed: "Worldwide",
              },
            ],
          }),
        }}
      />
    </>
  );
}
