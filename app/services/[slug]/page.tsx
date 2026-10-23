import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ServicePage } from "@/components/pages/ServicePage";
import { pageMeta, serviceSchema } from "@/lib/seo";
import { serviceBySlug, services } from "@/lib/services";

// Only /services/biv/, /services/whs/, /services/sfp/ and /services/asb/ exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  return s ? pageMeta({ path: s.path, title: s.seoTitle, description: s.description }) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  return (
    <>
      <JsonLd data={serviceSchema(s)} />
      <ServicePage service={s} />
    </>
  );
}
