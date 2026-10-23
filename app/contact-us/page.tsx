import { ContactPanel } from "@/components/ContactPanel";
import { Email } from "@/components/Email";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { org, paths } from "@/lib/site";

const title = `Contact Us ${org.phone} | Reserve Fund Plans`;
const description = `Contact Reserve Fund Plans in Applecross, Perth. Call ${org.phone}, email us, or send your property details through our quote form.`;
export const metadata = pageMeta({ path: paths.contact, title, description });

export default function ContactPage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Contact us", paths.contact],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.contact, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero
        crumbs={crumbs}
        kicker={`Call ${org.phone}`}
        title="Contact us"
        lede={
          <p>
            Call us on{" "}
            <a href={org.phoneHref} className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
              {org.phone}
            </a>
            , email <Email className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4" />, or send us your details below.
          </p>
        }
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
