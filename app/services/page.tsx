import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { services } from "@/lib/services";
import { paths } from "@/lib/site";

const title = "Strata Compliance Reports in WA | Reserve Fund Plans";
const description =
  "Strata compliance reports for WA: 10-year reserve fund plans, building insurance valuations, WHS safety reports and asbestos registers. Compare our services.";
export const metadata = pageMeta({ path: paths.services, title, description });

export default function ServicesPage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Services", paths.services],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.services, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        kicker="Services"
        title="Strata compliance and valuation reports"
        lede={<p>Four reports, each prepared after a site inspection, written so owners and strata managers can act on them.</p>}
      />
      <section className="wrap py-14 sm:py-20">
        <ol className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.key} className="flex flex-col border border-line bg-white p-7 sm:p-9">
              <span className="num text-sm text-ochre-deep">{s.code}</span>
              <h2 className="display mt-2 text-[1.9rem] text-eucalypt-deep">
                <Link href={s.path} className="hover:underline">
                  {s.name}
                </Link>
              </h2>
              <p className="mt-3 text-graphite">{s.lede}</p>
              <ul className="prose-rfp mt-5 text-[0.95rem]">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-7">
                <Link href={s.path} className="btn btn-dark">
                  {s.name}
                </Link>
                <Link href={s.faqPath} className="btn btn-ghost text-eucalypt">
                  FAQs
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand />
    </main>
  );
}
