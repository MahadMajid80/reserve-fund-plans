"use client";

import { Mark } from "../Diamonds";
import { Button, Chip, LineReveal } from "../ui";
import { paths } from "@/lib/site";

export function NotFoundView() {
  return (
    <main className="relative overflow-hidden">
      <Mark line className="pointer-events-none absolute top-1/2 -right-40 w-[42rem] -translate-y-1/2 text-ink/[0.05]" />
      <div className="wrap relative flex min-h-[86svh] flex-col justify-center py-32">
        <Chip>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-oxblood" />
          Error 404
        </Chip>
        <LineReveal as="h1" immediate className="h-display mt-6 text-[clamp(2.8rem,7vw,6rem)]" lines={["Page not found."]} />
        <p className="mt-6 max-w-md text-lg text-graphite">This page isn’t on the plan. It may have moved. Try our services, or get in touch.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={paths.services}>Our services</Button>
          <Button href={paths.contact} tone="ghost">
            Contact us
          </Button>
          <Button href={paths.home} tone="ghost">
            Home
          </Button>
        </div>
      </div>
    </main>
  );
}
