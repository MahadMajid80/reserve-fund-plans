import { ContactPanel } from "@/components/ContactPanel";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { paths } from "@/lib/site";

const title = "Request a Quote | Reserve Fund Plans";
const description = "Request a quote for a 10-year reserve fund plan, building insurance valuation, WHS safety report or asbestos report. Five short steps, about two minutes.";
export const metadata = pageMeta({ path: paths.quote, title, description });

export default function QuotePage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Request a quote", paths.quote],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.quote, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        kicker="Quote request"
        title="Request a quote"
        lede={<p>Select the services you need and tell us about the property. Five short steps, with a chance to check everything before you send.</p>}
      />
      <section className="wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <div className="border border-line bg-white/70 p-5 sm:p-9">
          <QuoteForm />
        </div>
        <ContactPanel />
      </section>
    </main>
  );
}
