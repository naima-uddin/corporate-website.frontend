import { notFound } from "next/navigation";
import ServiceCategoryClient from "@/components/ServicePage/ServiceCategoryClient";

async function getCategory(categoryName) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const categories = Array.isArray(data.categories) ? data.categories : [];
  return categories.find((category) => category.name === categoryName) || null;
}

async function getServicesForCategory(categoryName) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services?category=${encodeURIComponent(categoryName)}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.services) ? data.services : [];
}

export async function generateMetadata({ params }) {
  const { category: categoryName } = await params;
  const category = await getCategory(categoryName);

  if (!category) return {};

  return {
    title: `${category.displayName} Services | A2IT Ltd`,
    description:
      category.description ||
      `Explore A2IT's ${category.displayName} services and solutions.`,
    alternates: {
      canonical: `https://a2itltd.com/services/category/${categoryName}`,
    },
  };
}

export default async function ServiceCategoryPage({ params }) {
  const { category: categoryName } = await params;
  const category = await getCategory(categoryName);

  if (!category) {
    notFound();
  }

  const services = await getServicesForCategory(categoryName);

  return <ServiceCategoryClient category={category} services={services} />;
}
