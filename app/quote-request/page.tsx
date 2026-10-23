import { QuotePage } from "@/components/pages/ContactPage";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.quote,
  title: "Request a Quote | Reserve Fund Plans",
  description:
    "Request a quote for a 10 year reserve fund plan, building insurance valuation, WHS report or asbestos report. Turnaround 3–7 business days.",
});

export default function Page() {
  return <QuotePage />;
}
