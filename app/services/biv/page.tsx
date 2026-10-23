import { ServiceArticle } from "@/components/ServiceArticle";
import { pageMeta } from "@/lib/seo";
import { serviceBy } from "@/lib/services";

const s = serviceBy("biv");
export const metadata = pageMeta({ path: s.path, title: s.title, description: s.description });

export default function Page() {
  return <ServiceArticle s={s} />;
}
