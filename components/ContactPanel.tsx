import Link from "next/link";
import { Email } from "./Email";
import { facts, org, paths } from "@/lib/site";

export function ContactPanel() {
  return (
    <aside aria-label="Contact details" className="lg:sticky lg:top-32">
      <div className="bg-eucalypt-deep p-7 text-white sm:p-9">
        <h2 className="kicker text-white/65">Call us</h2>
        <a href={org.phoneHref} className="num mt-2 block text-[clamp(1.9rem,3.2vw,2.5rem)] hover:text-ochre-pale">
          {org.phone}
        </a>
        <h2 className="kicker mt-7 text-white/65">Email</h2>
        <Email className="mt-2 inline-flex min-h-11 items-center text-lg break-all underline decoration-ochre underline-offset-4" />
        <h2 className="kicker mt-7 text-white/65">Office</h2>
        <address className="mt-2 not-italic text-white/85">
          {org.address.street}
          <br />
          {org.address.locality} {org.address.region} {org.address.postcode}
        </address>
        {org.hours && (
          <>
            <h2 className="kicker mt-7 text-white/65">Hours</h2>
            <p className="mt-2 text-white/85">{org.hours}</p>
          </>
        )}
        <dl className="mt-8 grid gap-px bg-white/15">
          {[
            ["Usual turnaround", facts.turnaround],
            ["Professional indemnity", facts.indemnity],
          ].map(([k, v]) => (
            <div key={k} className="bg-eucalypt-deep py-3">
              <dt className="text-sm text-white/65">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-5 text-graphite">
        We respect your privacy and keep all client communications strictly confidential. Not sure which report you need? Read the{" "}
        <Link href={paths.faq} className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
          FAQs
        </Link>{" "}
        or just call.
      </p>
    </aside>
  );
}
