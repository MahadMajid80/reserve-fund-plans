import Link from "next/link";
import { services } from "@/lib/services";
import { org, paths } from "@/lib/site";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="wrap py-20 sm:py-28">
      <p className="num text-ochre-deep">404</p>
      <h1 className="display mt-3 max-w-3xl text-[clamp(2.3rem,5vw,4rem)] text-eucalypt-deep">We couldn&rsquo;t find that page.</h1>
      <p className="mt-5 max-w-2xl text-lg text-graphite">
        It may have moved. Try one of these, or call{" "}
        <a href={org.phoneHref} className="font-semibold text-eucalypt underline">
          {org.phone}
        </a>
        .
      </p>
      <ul className="mt-10 grid max-w-3xl gap-2 sm:grid-cols-2">
        {[["Home", paths.home] as const, ...services.map((s) => [s.name, s.path] as const), ["Request a quote", paths.quote] as const].map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="flex min-h-12 items-center justify-between border border-line bg-white px-5 font-semibold text-eucalypt hover:border-eucalypt">
              {l} <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
