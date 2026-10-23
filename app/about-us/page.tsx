import { AboutPage } from "@/components/pages/InfoPages";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.about,
  title: "About Us | Reserve Fund Plans, Perth WA",
  description:
    "About Reserve Fund Plans: Registered Valuers since 1984, with a Perth office in Applecross. Independent, insured strata reports in an easy-to-read format.",
});

export default function Page() {
  return <AboutPage />;
}
