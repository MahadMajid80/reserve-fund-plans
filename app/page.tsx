import { Article, Calculator, Closing, Coverage, Feature, Hero, Numbers, Preloader, Quotes, Reports } from "@/components/Home";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, pageMeta } from "@/lib/seo";
import { paths } from "@/lib/site";

export const metadata = pageMeta({
  path: paths.home,
  title: "10 Year Reserve Fund Plans for WA Strata | Reserve Fund Plans",
  description:
    "10 year reserve fund plans, building insurance valuations, WHS and asbestos reports for Western Australian strata schemes. Registered Valuers since 1984.",
});

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Preloader />
      <main>
        <Hero />
        <Reports />
        <Feature />
        <Numbers />
        <Calculator />
        <Coverage />
        <Article />
        <Quotes />
        <Closing />
      </main>
    </>
  );
}
