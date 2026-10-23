import { ServicesIndexPage } from "@/components/pages/InfoPages";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.services,
  title: "Strata Compliance Reports in WA | Reserve Fund Plans",
  description:
    "Strata reports for WA: 10 year reserve fund plans, building insurance valuations, WHS safety reports and asbestos registers. Compare our services.",
});

export default function Page() {
  return <ServicesIndexPage />;
}
