import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { services } from "@/lib/services";
import { paths } from "@/lib/site";

const title = "Strata Report FAQs | Reserve Fund Plans";
const description = "Answers to common questions about WA reserve fund plans, building insurance valuations, safety reports and asbestos reports for strata schemes.";
export const metadata = pageMeta({ path: paths.faq, title, description });

export default function FaqHub() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["FAQs", paths.faq],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.faq, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} kicker="Frequently asked questions" title="FAQs" lede={<p>Choose a topic. Each page answers the six questions we hear most about that report.</p>} />
      <section className="wrap py-14 sm:py-20">
        <ul className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.key} className="border border-line bg-white p-7">
              <h2 className="display text-2xl text-eucalypt-deep">
                <Link href={s.faqPath} className="hover:underline">
                  {s.faqH1}
                </Link>
              </h2>
              <ul className="mt-4 grid gap-1.5 text-[0.95rem] text-graphite">
                {s.faqs.map((f) => (
                  <li key={f.q} className="flex gap-2">
                    <span className="text-ochre-deep" aria-hidden="true">
                      ?
                    </span>
                    {f.q}
                  </li>
                ))}
              </ul>
              <Link href={s.faqPath} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-eucalypt">
                Read the answers <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </main>
  );
}
