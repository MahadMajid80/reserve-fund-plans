import Link from "next/link";
import { Email } from "./Email";
import { Logo } from "./Logo";
import { org, paths } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-eucalypt-deep text-white/80">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] lg:py-20">
        <div>
          <Link href={paths.home} className="inline-block">
            <Logo light />
          </Link>
          <p className="mt-6 max-w-sm">Reserve fund plans, building insurance valuations, safety reports and asbestos reports for strata and community schemes.</p>
          <address className="mt-6 not-italic">
            {org.address.street}
            <br />
            {org.address.locality} {org.address.region} {org.address.postcode}
          </address>
          <p className="mt-4">
            <a href={org.phoneHref} className="display text-2xl text-white hover:text-ochre-pale">
              {org.phone}
            </a>
            <br />
            <Email className="inline-flex min-h-11 items-center text-white underline decoration-ochre underline-offset-4 hover:text-ochre-pale" />
          </p>
        </div>
        <nav aria-label="Services">
          <h2 className="kicker text-white/60">Services</h2>
          <ul className="mt-4 grid gap-1">
            {services.map((s) => (
              <li key={s.key}>
                <Link href={s.path} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="kicker text-white/60">Company</h2>
          <ul className="mt-4 grid gap-1">
            {[
              ["About us", paths.about],
              ["Testimonials", paths.testimonials],
              ["FAQs", paths.faq],
              ["Contact us", paths.contact],
              ["Request a quote", paths.quote],
              ["Legal and privacy", paths.legal],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-6 text-sm text-white/65 sm:flex-row sm:justify-between">
          <p>
            © 2008–{year} {org.name} ({org.legalName})
            {org.abn ? ` · ABN ${org.abn}` : ""}
          </p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
