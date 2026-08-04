import NewsDetailClient from "@/components/news/NewsDetailClient";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateStaticParams() {
  try {
    const resp = await fetch(`${API}/api/news`);
    if (!resp.ok) return [];

    const data = await resp.json();
    const news = Array.isArray(data.news) ? data.news : [];

    return news.filter((item) => item.slug).map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("Failed to fetch news slugs for static export:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const resp = await fetch(`${API}/api/news/${slug}`);

    if (resp.ok) {
      const data = await resp.json();
      const news = data.news;

      return {
        title: `${news?.title || "News"} | A2IT`,
        description:
          news?.excerpt ||
          news?.content?.replace(/<[^>]*>/g, "").substring(0, 160) ||
          "Read the latest news from A2IT.",
        openGraph: {
          title: `${news?.title || "News"} | A2IT`,
          description: news?.excerpt,
          images: news?.featuredImage ? [{ url: news.featuredImage }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch news metadata:", error);
  }

  return {
    title: "A2IT News",
    description: "Read the latest news and updates from A2IT.",
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  return <NewsDetailClient slug={slug} />;
}
