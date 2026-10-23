import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { paths } from "@/lib/site";
import { testimonialPath, testimonials } from "@/lib/testimonials";

// The four original testimonial URLs are kept; anything else under /testimonials/ is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => testimonials.map((t) => ({ slug: t.slug }));

const find = (slug: string) => testimonials.find((t) => t.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const t = find((await params).slug);
  if (!t) return {};
  return pageMeta({
    path: testimonialPath(t.slug),
    title: `${t.name} Testimonial | Reserve Fund Plans`,
    description: `Testimonial from ${t.name}, ${t.role}, about the strata reports prepared by our team.`.slice(0, 160),
    type: "article",
  });
}

export default async function TestimonialPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = find((await params).slug);
  if (!t) notFound();
  const path = testimonialPath(t.slug);
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Testimonials", paths.testimonials],
    [t.name, path],
  ];
  const others = testimonials.filter((x) => x.slug !== t.slug);
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(path, `Testimonial from ${t.name}`, t.role), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} kicker="Testimonial" title={t.name} lede={<p>{t.role}</p>} />
      <section className="wrap py-14 sm:py-20">
        <figure className="max-w-4xl">
          <blockquote className="display border-l-4 border-ochre pl-6 text-[clamp(1.5rem,2.8vw,2.2rem)] leading-snug text-ink sm:pl-10">
            <p>&ldquo;{t.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-6 pl-6 text-graphite sm:pl-10">
            {t.name}, {t.role}. The testimonial refers to BIV Reports, our sister brand.
          </figcaption>
        </figure>
        <h2 className="kicker mt-16 text-mute">More testimonials</h2>
        <ul className="mt-4 grid gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={testimonialPath(o.slug)} className="inline-flex min-h-11 items-center font-semibold text-eucalypt hover:underline">
                {o.name}, {o.role}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </main>
  );
}
