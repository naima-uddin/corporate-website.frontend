import { Suspense } from "react";
import SearchResultsClient from "@/components/search/SearchResultsClient";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `Search | ${site.siteName}`,
    description: `Search services, projects, and news across ${site.siteName}.`,
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResultsClient />
    </Suspense>
  );
}
