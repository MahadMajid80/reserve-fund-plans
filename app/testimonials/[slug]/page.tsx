import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, QuoteBand } from "@/components/PageKit";
import { A } from "@/components/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";
import { allTestimonials, testimonialPath } from "@/lib/testimonials";

// The four testimonial detail pages from the old site keep their URLs. Anything else under /testimonials/ is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => allTestimonials.map((t) => ({ slug: t.slug }));
const find = (slug: string) => allTestimonials.find((t) => t.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = find((await params).slug);
  if (!t) return {};
  return pageMeta({
    path: testimonialPath(t.slug),
    title: `${t.name} Testimonial | Reserve Fund Plans`,
    description: `Testimonial from ${t.name}, ${t.role}, on the strata reports prepared by our team: clear, prompt and easy to read.`.slice(0, 160),
    type: "article",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const t = find((await params).slug);
  if (!t) notFound();
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Testimonials", paths.testimonials],
    [t.name, testimonialPath(t.slug)],
  ];
  const others = allTestimonials.filter((o) => o.slug !== t.slug);
  return (
    <main>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHero size="md" compact crumbs={crumbs} issue="Testimonial" lines={[t.name]} intro={t.role} />
      <section className="pb-18 sm:pb-24">
        <div className="wrap grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <figure className="rounded-[2rem] bg-white p-8 ring-1 ring-line sm:p-12">
            <blockquote className="h-title text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-ink">“{t.quote}”</blockquote>
            <figcaption className="mt-8 border-t border-line pt-5 text-graphite">
              <span className="font-bold text-ink">{t.name}</span>, {t.role}. This testimonial names BIV Reports, our sister brand.
            </figcaption>
          </figure>
          <nav aria-label="More testimonials" className="rounded-[2rem] bg-white p-7 ring-1 ring-line sm:p-9">
            <p className="eyebrow text-mute">More testimonials</p>
            <ul className="mt-4 grid gap-1">
              {others.map((o) => (
                <li key={o.slug}>
                  <A href={testimonialPath(o.slug)} className="inline-flex min-h-11 items-center font-semibold text-brand underline-offset-4 hover:underline">
                    {o.name}
                  </A>
                </li>
              ))}
              <li>
                <A href={paths.testimonials} className="inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:underline">
                  All testimonials
                </A>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <QuoteBand />
    </main>
  );
}
