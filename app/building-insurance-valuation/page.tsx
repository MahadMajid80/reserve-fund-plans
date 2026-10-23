import { FaqArticle } from "@/components/FaqArticle";
import { pageMeta } from "@/lib/seo";
import { serviceBy } from "@/lib/services";

const s = serviceBy("biv");
export const metadata = pageMeta({ path: s.faqPath, title: s.faqTitle, description: s.faqDescription });

export default function Page() {
  return <FaqArticle s={s} />;
}
