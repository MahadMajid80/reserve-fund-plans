import Link from "next/link";
import { Blocks, CtaBand, PageHero } from "./Page";
import { JsonLd } from "./JsonLd";
import { services, type Service } from "@/lib/services";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { paths } from "@/lib/site";

export function FaqArticle({ s }: { s: Service }) {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["FAQs", paths.faq],
    [s.faqH1, s.faqPath],
  ];
  return (
    <main id="main">
      <JsonLd data={[faqSchema(s.faqs), webPageSchema(s.faqPath, s.faqTitle, s.faqDescription), breadcrumbSchema(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        kicker="Frequently asked questions"
        title={s.faqH1}
        lede={
          <p>
            Straight answers to the questions strata managers and owners ask us most. For the full picture, see our{" "}
            <Link href={s.path} className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
              {s.name.toLowerCase()} service page
            </Link>
            .
          </p>
        }
      />
      <div className="wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_18rem]">
        <div className="divide-y divide-line border-y border-line">
          {s.faqs.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h2 className="display text-[1.35rem] text-eucalypt-deep sm:text-[1.55rem]">{f.q}</h2>
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center border border-line text-ochre-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pb-7">
                <Blocks blocks={f.a} />
              </div>
            </details>
          ))}
        </div>
        <aside>
          <div className="sticky top-32 border border-line bg-white p-6">
            <h2 className="kicker text-eucalypt">More FAQs</h2>
            <ul className="mt-3 grid gap-1">
              {services
                .filter((x) => x.key !== s.key)
                .map((x) => (
                  <li key={x.key}>
                    <Link href={x.faqPath} className="inline-flex min-h-11 items-center text-graphite hover:text-eucalypt hover:underline">
                      {x.faqH1}
                    </Link>
                  </li>
                ))}
            </ul>
            <Link href={`${paths.quote}?service=${s.key}`} className="btn btn-primary mt-5 w-full">
              Request a quote
            </Link>
          </div>
        </aside>
      </div>
      <CtaBand title="Still have a question?" text="Call us or send the details through the quote form and we'll answer it for your property." />
    </main>
  );
}
