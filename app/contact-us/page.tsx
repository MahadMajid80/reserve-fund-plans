import { ContactPage } from "@/components/pages/ContactPage";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.contact,
  title: "Contact Us 1300 55 18 30 | Reserve Fund Plans",
  description:
    "Contact Reserve Fund Plans in Applecross, Perth on 1300 55 18 30, or request a quote online for a reserve fund plan, valuation, WHS or asbestos report.",
});

export default function Page() {
  return <ContactPage />;
}
