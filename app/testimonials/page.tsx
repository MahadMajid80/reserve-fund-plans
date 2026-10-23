import { TestimonialsPage } from "@/components/pages/InfoPages";
import { pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.testimonials,
  title: "Testimonials | Reserve Fund Plans",
  description:
    "What strata managers and real estate principals say about our reports: clear, concise, cost-effective and delivered on time.",
});

export default function Page() {
  return <TestimonialsPage />;
}
