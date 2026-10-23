import { LegalPage } from "@/components/pages/InfoPages";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.legal,
  title: "Legal & Privacy | Reserve Fund Plans",
  description:
    "Reserve Fund Plans website disclaimer and privacy policy: how we collect, use, store and protect personal information under the Privacy Act 1988.",
});

export default function Page() {
  return <LegalPage />;
}
