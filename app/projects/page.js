import Portfolio from "@/components/portfolio-page-component/Portfolio";
import React from "react";

export const metadata = {
  title: "Projects | M/S. MD. RAKIB HASAN | Government Contracts & Supply",
  description:
    "Explore government contracts, construction and supply projects delivered by M/S. MD. RAKIB HASAN — a 1st Class Government Contractor, Supplier, General Merchant & Auctioneer serving departments across Bangladesh since 2012.",
  keywords: [
    "Government Contractor Bangladesh",
    "Government Supply Projects",
    "Construction Projects",
    "Education Engineering Department Contracts",
    "Health Engineering Department Contracts",
    "Public Works Department Contracts",
    "BADC Contracts",
    "Government Auction Services",
  ],
  alternates: {
    canonical: "https://msmdrakibhasan.com/projects",
  },
  openGraph: {
    title: "Projects | M/S. MD. RAKIB HASAN | Government Contracts & Supply",
    description:
      "Government contracts, construction and supply projects delivered by M/S. MD. RAKIB HASAN across Bangladesh.",
    url: "https://msmdrakibhasan.com/projects",
    siteName: "M/S. MD. RAKIB HASAN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | M/S. MD. RAKIB HASAN | Government Contracts & Supply",
    description:
      "Government contracts, construction and supply projects delivered by M/S. MD. RAKIB HASAN across Bangladesh.",
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
              name: "M/S. MD. RAKIB HASAN",
              url: "https://msmdrakibhasan.com",
            },
            description:
              "Government contracts, construction and supply projects delivered by M/S. MD. RAKIB HASAN, a 1st Class Government Contractor, Supplier, General Merchant & Auctioneer in Bangladesh.",
            url: "https://msmdrakibhasan.com/projects",
            about: [
              { "@type": "Thing", name: "Government Contracting" },
              { "@type": "Thing", name: "Construction" },
              { "@type": "Thing", name: "Government Supply" },
              { "@type": "Thing", name: "General Merchant" },
              { "@type": "Thing", name: "Auction Services" },
              { "@type": "Thing", name: "Procurement" },
            ],
          }),
        }}
      />
    </>
  );
}
