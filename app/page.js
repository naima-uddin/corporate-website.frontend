import Banner from "@/components/home-page-components/Banner";
import ClientShowcase from "@/components/home-page-components/ClientShowcase";
import CtaBand from "@/components/home-page-components/CtaBand";
import Newsroom from "@/components/home-page-components/Newsroom";
import WhatWeOffer from "@/components/home-page-components/WhatWeOffer";
import WhoRWe from "@/components/home-page-components/WhoRWe";
import React from "react";

// 🔹 SEO metadata for Home Page
export const metadata = {
  title: "A2IT Ltd | IT Services, Web & eCommerce & Digital Solutions",
  description:
    "A2IT Ltd provides professional IT services including web development, mobile apps, UI/UX design, eCommerce solutions, Shopify, Amazon & eBay services, SEO, and digital marketing.",
  keywords: [
    "A2IT Ltd",
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
    title: "A2IT Ltd | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "Discover A2IT Ltd’s expertise in IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions including Shopify, Amazon, and eBay.",
    url: "/A2ITLogo.png",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/A2ITLogo.png", // 👉 add Home OG image in /public
        width: 1200,
        height: 630,
        alt: "A2IT Ltd - IT Services and Digital Solutions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A2IT Ltd | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "A2IT Ltd offers professional IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing.",
    images: ["/A2ITLogo.png"],
  },
};

export default function Home() {
  return (
    <>
      <Banner />
      <WhoRWe />
      <WhatWeOffer />
      <ClientShowcase />
      <Newsroom />
      <CtaBand />

      {/* 🔹 Schema Markup for Home Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "A2IT Ltd",
            url: "https://a2itltd.com",
            logo: "https://a2itltd.com/A2ITLogo.png",
            sameAs: [
              "https://www.facebook.com/yourcompany", // add your social profiles
              "https://www.linkedin.com/company/yourcompany",
              "https://twitter.com/yourcompany",
            ],
            description:
              "A2IT Ltd provides IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: "+880XXXXXXXXXX", // replace with your number
                email: "info@a2itltd.com", // replace with your email
                areaServed: "Worldwide",
              },
            ],
          }),
        }}
      />
    </>
  );
}
