import GovernmentEnlistment from "@/components/government-enlistment-page-component/GovernmentEnlistment";
import React from "react";

export const metadata = {
  title: "Government Enlistment | A2IT Ltd",
  description:
    "A2IT Ltd's government enlistment credentials — a trusted IT service provider recognized for delivering compliant technology solutions to public sector organizations.",
  keywords: [
    "A2IT Government Enlistment",
    "Government IT Vendor",
    "Public Sector IT Services",
    "A2IT Ltd",
  ],
  alternates: {
    canonical: "https://a2itltd.com/government-enlistment",
  },
  openGraph: {
    title: "Government Enlistment | A2IT Ltd",
    description:
      "A2IT Ltd's government enlistment credentials — a trusted IT service provider for public sector organizations.",
    url: "https://a2itltd.com/government-enlistment",
    siteName: "A2IT Ltd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Enlistment | A2IT Ltd",
    description:
      "A2IT Ltd's government enlistment credentials — a trusted IT service provider for public sector organizations.",
  },
};

export default function Page() {
  return <GovernmentEnlistment />;
}
