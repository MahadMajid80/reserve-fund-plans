import Image from "next/image";
import Link from "next/link";
import { Blocks, CtaBand, PageHero } from "./Page";
import { JsonLd } from "./JsonLd";
import { services, type Service } from "@/lib/services";
import { breadcrumbSchema, serviceSchema, webPageSchema } from "@/lib/seo";
import { facts, org, paths } from "@/lib/site";

export function ServiceArticle({ s }: { s: Service }) {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Services", paths.services],
    [s.name, s.path],
  ];
  const others = services.filter((x) => x.key !== s.key);
  return (
    <main id="main">
      <JsonLd data={[serviceSchema(s), webPageSchema(s.path, s.title, s.description), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} kicker={`Service ${s.code} · ${s.name}`} title={s.h1} lede={<p>{s.lede}</p>}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`${paths.quote}?service=${s.key}`} className="btn btn-primary">
            Request a quote
          </Link>
          <a href={org.phoneHref} className="btn btn-ghost text-eucalypt">
            Call {org.phone}
          </a>
        </div>
      </PageHero>

      <div className="wrap grid gap-12 py-14 sm:py-20 lg:grid-cols-[15rem_1fr_19rem] lg:gap-14">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-32">
            <p className="kicker text-mute">On this page</p>
            <ol className="mt-4 grid gap-1 border-l border-line text-[0.93rem]">
              {s.sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-graphite hover:border-ochre hover:text-eucalypt">
                    {sec.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0">
          {s.sections.map((sec, i) => (
            <section key={sec.id} id={sec.id} className={`scroll-mt-32 ${i ? "mt-12 border-t border-line pt-10" : ""}`}>
              <h2 className="display flex items-baseline gap-4 text-[clamp(1.55rem,2.6vw,2.05rem)] text-eucalypt-deep">
                <span className="num text-base text-ochre-deep" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {sec.heading}
              </h2>
              <div className="mt-4">
                <Blocks blocks={sec.blocks} />
              </div>
            </section>
          ))}
        </article>

        <aside className="lg:order-none">
          <div className="sticky top-32 grid gap-4">
            <div className="border border-line bg-white p-6">
              <h2 className="kicker text-eucalypt">What you receive</h2>
              <ul className="mt-4 grid gap-3 text-[0.95rem] text-graphite">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3">
                    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-ochre-deep" aria-hidden="true">
                      <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-sm text-mute">Usual turnaround: {facts.turnaround} after the inspection.</p>
            </div>
            <div className="relative overflow-hidden bg-eucalypt-deep p-6 text-white">
              <Image src="/images/strata-building.jpg" alt="" fill sizes="20rem" className="object-cover opacity-20" />
              <div className="relative">
                <p className="display text-2xl">Need a quote?</p>
                <p className="mt-2 text-white/80">It takes about two minutes.</p>
                <Link href={`${paths.quote}?service=${s.key}`} className="btn btn-primary mt-5 w-full">
                  Start your request
                </Link>
              </div>
            </div>
            <Link href={s.faqPath} className="group flex items-center justify-between border border-line bg-sand/50 p-5 hover:border-eucalypt">
              <span>
                <span className="block text-sm text-mute">Questions?</span>
                <span className="font-semibold text-eucalypt">Read the {s.name.toLowerCase()} FAQs</span>
              </span>
              <span aria-hidden="true" className="text-ochre-deep transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </aside>
      </div>

      <section className="border-t border-line bg-sand/50">
        <div className="wrap py-14 sm:py-18">
          <h2 className="display text-3xl text-eucalypt-deep">Our other services</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.key}>
                <Link href={o.path} className="group flex h-full flex-col border border-line bg-white p-6 hover:border-eucalypt">
                  <span className="num text-sm text-ochre-deep">{o.code}</span>
                  <span className="display mt-2 text-xl text-eucalypt-deep">{o.name}</span>
                  <span className="mt-2 text-[0.95rem] text-graphite">{o.summary}</span>
                  <span className="mt-auto pt-4 text-sm font-semibold text-eucalypt">
                    Learn more <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
