import Portfolio from "@/components/portfolio-page-component/Portfolio";
import React from "react";

export const metadata = {
  title: "Projects | A2IT Ltd | Our Work in Web, eCommerce & Marketplaces",
  description:
    "Explore A2IT Ltd's projects showcasing web development, mobile apps, UI/UX, eCommerce stores, Amazon, Shopify, and eBay work. See our innovative IT solutions in action.",
  keywords: [
    "A2IT Projects",
    "Web Development Projects",
    "Mobile App Projects",
    "UI/UX Design Projects",
    "eCommerce Projects",
    "Shopify Projects",
    "Amazon Projects",
    "eBay Projects",
    "Digital Marketing Case Studies",
    "IT Solutions Projects",
  ],
  alternates: {
    canonical: "https://a2itltd.com/projects",
  },
  openGraph: {
    title: "Projects | A2IT Ltd | Web, eCommerce & Marketplace Projects",
    description:
      "Discover A2IT Ltd's projects in web, mobile, UI/UX, eCommerce, Shopify, Amazon, and eBay delivered with excellence.",
    url: "https://a2itltd.com/projects",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/og-portfolio.jpg",
        width: 1200,
        height: 630,
        alt: "Projects of A2IT Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | A2IT Ltd | Web, eCommerce & Marketplace Projects",
    description:
      "Explore A2IT Ltd's projects showcasing web, mobile, UI/UX, eCommerce, Shopify, Amazon, and eBay work.",
    images: ["/og-portfolio.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <Portfolio />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Projects",
            author: {
              "@type": "Organization",
              name: "A2IT Ltd",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            description:
              "A2IT Ltd's projects showcasing work in web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, and eBay.",
            url: "https://a2itltd.com/projects",
            about: [
              { "@type": "Thing", name: "Web Development" },
              { "@type": "Thing", name: "Mobile App Development" },
              { "@type": "Thing", name: "UI/UX Design" },
              { "@type": "Thing", name: "eCommerce" },
              { "@type": "Thing", name: "Shopify" },
              { "@type": "Thing", name: "Amazon" },
              { "@type": "Thing", name: "eBay" },
            ],
          }),
        }}
      />
    </>
  );
}
