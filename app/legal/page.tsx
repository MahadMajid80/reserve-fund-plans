import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Page";
import { breadcrumbSchema, pageMeta, webPageSchema } from "@/lib/seo";
import { org, paths } from "@/lib/site";

const title = "Legal, Disclaimer and Privacy | Reserve Fund Plans";
const description = "The website disclaimer, privacy statement and external links policy for reservefundplans.com.au.";
export const metadata = pageMeta({ path: paths.legal, title, description });

// TODO [ASK]: have the privacy statement reviewed against the Privacy Act 1988 and the Australian Privacy
// Principles if the business is covered by them (see docs/CLAIMS-TO-CONFIRM.md).
export default function LegalPage() {
  const crumbs: [string, string][] = [
    ["Home", paths.home],
    ["Legal", paths.legal],
  ];
  return (
    <main id="main">
      <JsonLd data={[webPageSchema(paths.legal, title, description), breadcrumbSchema(crumbs)]} />
      <PageHero crumbs={crumbs} title="Legal" />
      <div className="wrap max-w-3xl py-14 sm:py-20">
        <div className="prose-rfp text-[1.05rem]">
          <h2 className="display mb-4 text-3xl text-eucalypt-deep">Disclaimer</h2>
          <p>
            The information on this website is provided for general purposes only. {org.name} works to keep it current and accurate, but makes no representations or warranties, express or implied, about the completeness,
            accuracy, reliability, suitability or availability of the website or the information, products, services or graphics on it. Any reliance you place on this information is strictly at your own risk.
          </p>
          <p>
            The general information on this website is not legal advice and is not a substitute for a report prepared for your property. Legislation changes from time to time; please check the current law or seek advice for your
            circumstances.
          </p>
          <p>We make every reasonable effort to keep the website running smoothly, but take no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.</p>

          <h2 className="display mt-12 mb-4 text-3xl text-eucalypt-deep">Privacy</h2>
          <p>This privacy statement explains how {org.name} uses and protects the information you give us through this website.</p>
          <p>
            When you send a quote request or message, the details you enter are emailed to our office so we can respond to your enquiry. We use them only for that purpose and for providing the services you ask for. The website does
            not store your enquiry in a database, and we do not sell or share your details with third parties for marketing.
          </p>
          <p>
            To protect the form from spam, it may use Google reCAPTCHA, which is subject to Google&rsquo;s{" "}
            <a href="https://policies.google.com/privacy" rel="noopener noreferrer">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" rel="noopener noreferrer">
              Terms of Service
            </a>
            . Your browser may keep the answers you have typed into the quote form in this tab until you send it or close the tab.
          </p>
          <p>We may change this statement from time to time by updating this page. Please check it periodically.</p>

          <h2 className="display mt-12 mb-4 text-3xl text-eucalypt-deep">Links</h2>
          <p>
            This website may link to other websites that are not under our control. We have no control over the nature, content or availability of those sites, and a link does not imply a recommendation or endorsement of the views
            expressed on them. Once you leave our website, we are not responsible for any information you provide to other sites, and their privacy statements apply.
          </p>

          <h2 className="display mt-12 mb-4 text-3xl text-eucalypt-deep">Contact</h2>
          <p>
            {org.name} ({org.legalName}), {org.address.street}, {org.address.locality} {org.address.region} {org.address.postcode}. Phone <a href={org.phoneHref}>{org.phone}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
