import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { facts, paths } from "@/lib/site";

const title = "About Us | Reserve Fund Plans, Perth WA";
const description = `Reserve Fund Plans has valued property since ${facts.since}. Independent, practical strata reports from registered valuers and qualified safety and asbestos specialists.`;
export const metadata = pageMeta({ path: paths.about, title, description });

const values: [string, string][] = [
  ["Innovative", "We draw on our experience to offer original, creative solutions to the challenges of the industry, and we take responsibility for the outcomes."],
  ["Vigilant", "Each week we review court cases on negligence, work health and safety and asbestos, along with relevant changes to legislation, some of which we have helped bring about."],
  [
    "Professional",
    "Our valuers have been registered and qualified since 1984 and our real estate agents licensed since 1983, and our staff include qualified asbestos and WHS specialists. Our directors sit on government and industry committees, and we follow our institutes' codes of conduct and ethics.",
  ],
  ["Independent", "We are not affiliated with maintenance companies and do not rely on referrals to them. Like an independent auditor, we give independent advice and practical recommendations."],
];

export default function AboutPage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["About us", paths.about],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.about, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} kicker="About us" title={`Valuing property since ${facts.since}`} lede={<p>Accurate, practical property reports in an easy-to-read format, backed by detailed research.</p>} />

      <section className="wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-eucalypt-deep">Our history</h2>
          <div className="prose-rfp mt-5 text-lg">
            <p>
              Since {facts.since} we have valued a very wide variety of properties, from due diligence on some of Australia&rsquo;s largest property transactions to small suburban cottages. Our experts have presented evidence in Federal and State courts.
            </p>
            <p>We have particular expertise in strata property, having inspected {facts.schemesInspected} strata schemes in Australia.</p>
          </div>
        </div>
        <Image
          src="/images/strata-building.jpg"
          alt="Balconies and facade of a modern strata apartment building"
          width={1600}
          height={1200}
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full"
        />
      </section>

      <section className="border-y border-line bg-sand/60">
        <div className="wrap py-14 sm:py-20">
          <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-eucalypt-deep">Our values</h2>
          <dl className="mt-10 grid gap-px bg-line md:grid-cols-2">
            {values.map(([t, d], i) => (
              <div key={t} className="bg-paper p-7 sm:p-9">
                <dt className="flex items-baseline gap-3">
                  <span className="num text-ochre-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-2xl text-eucalypt-deep">{t}</span>
                </dt>
                <dd className="mt-3 text-graphite">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap grid gap-10 py-14 sm:py-20 md:grid-cols-2">
        <div className="border-l-4 border-eucalypt pl-6">
          <h2 className="kicker text-eucalypt">Our vision</h2>
          <p className="display mt-3 text-2xl text-ink">To give our clients the most accurate and practical property reports, in an easy-to-read format, backed by detailed research.</p>
        </div>
        <div className="border-l-4 border-ochre pl-6">
          <h2 className="kicker text-ochre-deep">Our mission</h2>
          <p className="display mt-3 text-2xl text-ink">To make our clients&rsquo; work easier and more enjoyable, working with them towards positive outcomes.</p>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
