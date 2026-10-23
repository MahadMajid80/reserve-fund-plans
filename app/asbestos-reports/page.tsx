import { JsonLd } from "@/components/JsonLd";
import { FaqTopicPage } from "@/components/pages/InfoPages";
import { faqSchema, pageMeta } from "@/lib/seo";
import { serviceBySlug } from "@/lib/services";

const s = serviceBySlug("asb")!;

export const metadata = pageMeta({ path: s.faqPath, title: s.faq.title, description: s.faq.description });

export default function Page() {
  return (
    <>
      {/* FAQPage schema built from the same data that renders the visible answers */}
      <JsonLd data={faqSchema(s.faq.faqs)} />
      <FaqTopicPage service={s} />
    </>
  );
}
