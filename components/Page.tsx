import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "@/lib/services";
import { org, paths } from "@/lib/site";

/** Visible breadcrumb trail (the matching BreadcrumbList JSON-LD is added by each page). */
export function Breadcrumbs({ crumbs }: { crumbs: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-mute">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map(([label, href], i) => (
          <li key={href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-graphite">
                {label}
              </span>
            ) : (
              <Link href={href} className="inline-flex min-h-8 items-center hover:text-eucalypt hover:underline">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ crumbs, kicker, title, lede, children }: { crumbs: [string, string][]; kicker?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="ledger border-b border-line bg-sand/60">
      <div className="wrap pt-8 pb-14 sm:pt-10 sm:pb-18">
        <Breadcrumbs crumbs={crumbs} />
        {kicker && <p className="kicker mt-10 text-ochre-deep">{kicker}</p>}
        <h1 className={`display max-w-4xl text-[clamp(2.3rem,5.2vw,4.2rem)] text-eucalypt-deep ${kicker ? "mt-3" : "mt-10"}`}>{title}</h1>
        {lede && <div className="mt-6 max-w-3xl text-lg text-graphite sm:text-xl">{lede}</div>}
        {children}
      </div>
    </section>
  );
}

/** Renders content blocks. Strings may contain the internal <a href> links written in lib/services.ts (trusted, static). */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-rfp">
      {blocks.map((b, i) => {
        if (typeof b === "string") return <p key={i} dangerouslySetInnerHTML={{ __html: b }} />;
        if ("list" in b)
          return (
            <ul key={i}>
              {b.list.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          );
        if ("table" in b)
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[0.97rem]">
                {b.head && (
                  <thead>
                    <tr className="border-b-2 border-eucalypt text-ink">
                      <th scope="col" className="py-3 pr-4 font-semibold">
                        {b.head[0]}
                      </th>
                      <th scope="col" className="py-3 font-semibold">
                        {b.head[1]}
                      </th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {b.table.map(([a, c]) => (
                    <tr key={a} className="border-b border-line">
                      <td className="py-3 pr-4">{a}</td>
                      <td className="num py-3 font-semibold whitespace-nowrap text-eucalypt">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <p key={i} className="mt-4 border-l-4 border-sage bg-sage-pale/60 px-5 py-4 text-[0.97rem]">
            {b.note}
          </p>
        );
      })}
    </div>
  );
}

/** The closing call to action used at the foot of most pages. */
export function CtaBand({ title = "Ready to talk about your scheme?", text }: { title?: string; text?: string }) {
  return (
    <section className="bg-eucalypt text-white">
      <div className="wrap grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="display text-[clamp(1.9rem,3.6vw,3rem)]">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            {text ?? "Tell us about the property and the report you need. We'll come back to you with a quote, or call if anything needs clarifying."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href={paths.quote} className="btn btn-primary">
            Request a quote
          </Link>
          <a href={org.phoneHref} className="btn btn-ghost text-white">
            Call {org.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
