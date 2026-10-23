import Image from "next/image";
import Link from "next/link";
import { HorizonChart } from "@/components/HorizonChart";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/Page";
import { pageMeta, webPageSchema } from "@/lib/seo";
import { services } from "@/lib/services";
import { facts, org, paths } from "@/lib/site";
import { testimonials, testimonialPath } from "@/lib/testimonials";

const title = "10-Year Reserve Fund Plans for WA Strata | Reserve Fund Plans";
const description =
  "Independent 10-year reserve fund plans, building insurance valuations, WHS and asbestos reports for Western Australian strata companies. Valuers since 1984.";

export const metadata = pageMeta({ path: paths.home, title, description });

export default function Home() {
  const featured = testimonials.slice(0, 3);
  return (
    <main id="main">
      <JsonLd data={webPageSchema(paths.home, title, description)} />

      {/* ── Hero ── */}
      <section className="ledger relative overflow-hidden border-b border-line">
        <div className="wrap grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:py-24">
          <div>
            <p className="kicker text-ochre-deep">Strata property · compliance and valuation</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,5.4vw,4.4rem)] text-eucalypt-deep">
              Plan the next ten years of your <em className="font-normal text-ochre-deep italic">strata scheme</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-graphite sm:text-xl">
              Independent 10-year reserve fund plans, building insurance valuations, safety reports and asbestos reports for strata and community schemes in Western Australia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={paths.quote} className="btn btn-primary">
                Request a quote
              </Link>
              <Link href={paths.sfp} className="btn btn-ghost text-eucalypt">
                About reserve fund plans
              </Link>
            </div>
            <dl className="mt-12 grid max-w-xl grid-cols-3 border-t border-line pt-6">
              {[
                ["Since", facts.since],
                ["Turnaround", "3–7 days"],
                ["Indemnity", "$10M"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-mute">{k}</dt>
                  <dd className="num mt-1 text-[clamp(1.5rem,3vw,2.1rem)] text-eucalypt">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <HorizonChart />
        </div>
      </section>

      {/* ── Services ── */}
      <section aria-labelledby="services-h" className="py-16 sm:py-24">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <p className="kicker text-ochre-deep">What we do</p>
              <h2 id="services-h" className="display mt-3 text-[clamp(2rem,4vw,3.2rem)] text-eucalypt-deep">
                Four reports that keep a strata company on the right side of its obligations.
              </h2>
            </div>
            <p className="text-lg text-graphite lg:pb-2">
              Every report starts with a site inspection and ends with practical recommendations in an easy-to-read format, so councils of owners can make decisions with confidence.
            </p>
          </div>
          <ol className="mt-12 grid border-t border-line md:grid-cols-2">
            {services.map((s, i) => (
              <li key={s.key} className={`border-b border-line ${i % 2 === 0 ? "md:border-r" : ""}`}>
                <Link href={s.path} className="group grid h-full grid-cols-[3.5rem_1fr] gap-4 p-6 transition-colors hover:bg-sand/60 sm:p-9">
                  <span className="num text-3xl text-ochre-deep">{s.code}</span>
                  <span>
                    <span className="display block text-2xl text-eucalypt-deep sm:text-[1.75rem]">{s.name}</span>
                    <span className="mt-2 block text-graphite">{s.summary}</span>
                    <span className="mt-5 inline-flex items-center gap-2 font-semibold text-eucalypt">
                      Read more <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Who it's for + why plan ── */}
      <section className="bg-eucalypt-deep text-white">
        <div className="wrap grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="kicker text-ochre-pale">Who we work with</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">For strata managers, councils of owners and property owners.</h2>
            <p className="mt-6 text-lg text-white/80">
              In Western Australia, strata companies with 10 or more lots, or a replacement value of $5 million or more, must keep a reserve fund and a 10-year plan, reviewed at least every five years. We prepare that plan, value the buildings for insurance, and identify the safety and asbestos hazards on common property.
            </p>
            <Link href={paths.sfp} className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-white underline decoration-ochre decoration-2 underline-offset-4">
              Who needs a 10-year plan? <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="grid content-start gap-px bg-white/15">
            {[
              ["Independent", "We are not affiliated with maintenance companies and do not rely on referrals to them, much like an independent auditor."],
              ["Practical", "Recommendations that make sense on site and in the budget, not box-ticking against today's building code."],
              ["Experienced", `Registered valuers since ${facts.since}, with ${facts.schemesInspected} strata schemes inspected across Australia.`],
              ["Covered", `${facts.indemnity} professional indemnity insurance, for your peace of mind.`],
            ].map(([t, d]) => (
              <li key={t} className="bg-eucalypt-deep p-6 sm:p-7">
                <h3 className="display text-xl text-white">{t}</h3>
                <p className="mt-2 text-white/75">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <Image
              src="/images/strata-building.jpg"
              alt="A modern multi-level strata apartment building with balconies, landscaped gardens and a black steel fence"
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full"
            />
            <p className="num absolute -bottom-5 left-5 bg-ochre px-5 py-3 text-lg text-white sm:left-8">Since {facts.since}</p>
          </div>
          <div>
            <p className="kicker text-ochre-deep">A word about us</p>
            <h2 className="display mt-3 text-[clamp(2rem,4vw,3rem)] text-eucalypt-deep">Valuing property since {facts.since}.</h2>
            <div className="prose-rfp mt-6 text-lg">
              <p>
                Since {facts.since} we have valued a very wide variety of properties, from due diligence on some of Australia&rsquo;s largest property transactions to small suburban cottages. Our experts have given evidence in Federal and State courts.
              </p>
              <p>
                We have particular expertise in strata property, having inspected {facts.schemesInspected} strata schemes in Australia. Clients receive accurate, practical reports in an easy-to-read format, backed by well-researched advice.
              </p>
            </div>
            <Link href={paths.about} className="btn btn-dark mt-8">
              More about us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section aria-labelledby="t-h" className="border-y border-line bg-sand/60 py-16 sm:py-24">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="t-h" className="display text-[clamp(2rem,4vw,3rem)] text-eucalypt-deep">
              What clients say
            </h2>
            <Link href={paths.testimonials} className="inline-flex min-h-11 items-center gap-2 font-semibold text-eucalypt">
              All testimonials <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((t) => (
              <li key={t.slug}>
                <figure className="flex h-full flex-col border-t-4 border-ochre bg-white p-7">
                  <blockquote className="text-graphite">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-auto pt-6">
                    <Link href={testimonialPath(t.slug)} className="font-semibold text-ink hover:underline">
                      {t.name}
                    </Link>
                    <span className="block text-sm text-mute">{t.role}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-mute">Testimonials refer to BIV Reports, our sister brand.</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section aria-labelledby="how-h" className="py-16 sm:py-24">
        <div className="wrap">
          <p className="kicker text-ochre-deep">How it works</p>
          <h2 id="how-h" className="display mt-3 text-[clamp(2rem,4vw,3rem)] text-eucalypt-deep">
            From enquiry to report.
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              ["Request a quote", "Tell us about the property and the reports you need, online or by phone."],
              ["Inspection", "We inspect the property and its common property."],
              ["Your report", `Usually within ${facts.turnaround}, with photographs and clear recommendations.`],
              ["Questions", "Call us if anything in the report needs explaining to the owners."],
            ].map(([t, d], i) => (
              <li key={t} className="border-t-2 border-eucalypt pt-5">
                <span className="num text-sm text-ochre-deep">Step {i + 1}</span>
                <h3 className="display mt-1 text-xl text-eucalypt-deep">{t}</h3>
                <p className="mt-2 text-graphite">{d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-graphite">
            Prefer to talk it through? Call{" "}
            <a href={org.phoneHref} className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
              {org.phone}
            </a>
            .
          </p>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
