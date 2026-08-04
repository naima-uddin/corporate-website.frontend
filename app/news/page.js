import NewsListClient from "@/components/news/NewsListClient";
import { getSiteInfo } from "@/lib/siteInfo";

export async function generateMetadata() {
  const site = await getSiteInfo();

  return {
    title: `News & Media | ${site.siteName}`,
    description: `Read the latest news, updates, and media coverage from ${site.siteName}.`,
  };
}

export default function NewsPage() {
  return <NewsListClient />;
}
