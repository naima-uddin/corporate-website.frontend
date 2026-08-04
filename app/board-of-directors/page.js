import BoardOfDirectorsFull from "@/components/about-page-compoent/BoardOfDirectorsFull";
import React from "react";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Board of Directors | ${site.siteName}`,
    description: "Meet the full board of directors behind M/S. MD. RAKIB HASAN.",
    alternates: {
      canonical: "https://a2itltd.com/board-of-directors",
    },
  };
}

export default function Page() {
  return <BoardOfDirectorsFull />;
}
