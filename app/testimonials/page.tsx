import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { paths } from "@/lib/site";
import { testimonialPath, testimonials } from "@/lib/testimonials";

const title = "Testimonials | Reserve Fund Plans";
const description = "What strata managers and real estate principals say about our reports: clear, concise, cost-effective and delivered on time.";
export const metadata = pageMeta({ path: paths.testimonials, title, description });

export default function TestimonialsPage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Testimonials", paths.testimonials],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.testimonials, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} kicker="Testimonials" title="In our clients' words" lede={<p>Feedback from strata managers and real estate principals. The testimonials refer to BIV Reports, our sister brand.</p>} />
      <section className="wrap py-14 sm:py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <li key={t.slug}>
              <figure className="flex h-full flex-col border-t-4 border-ochre bg-white p-7 sm:p-9">
                <blockquote className="display text-[1.3rem] leading-snug text-ink">
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-auto border-t border-line pt-5">
                  <Link href={testimonialPath(t.slug)} className="font-semibold text-eucalypt hover:underline">
                    {t.name}
                  </Link>
                  <span className="block text-sm text-mute">{t.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </main>
  );
}
