import { FaqHubPage } from "@/components/pages/InfoPages";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.faq,
  title: "Strata Report FAQs | Reserve Fund Plans",
  description:
    "Answers to common questions about WA reserve fund plans, building insurance valuations, WHS reports and asbestos reports for strata schemes.",
});

export default function Page() {
  return <FaqHubPage />;
}
