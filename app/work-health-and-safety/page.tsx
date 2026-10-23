import { FaqArticle } from "@/components/FaqArticle";
import { pageMeta } from "@/lib/seo";
import { serviceBy } from "@/lib/services";

const s = serviceBy("whs");
export const metadata = pageMeta({ path: s.faqPath, title: s.faqTitle, description: s.faqDescription });

export default function Page() {
  return <FaqArticle s={s} />;
}
