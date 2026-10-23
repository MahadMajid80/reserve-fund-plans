// The four testimonials from the old reservefundplans.com.au /testimonials/ page, quoted verbatim (they name
// BIV Reports, the sister brand). Each keeps its original detail-page URL. Tags drive the filter on /testimonials/.
// Job-title spelling fixed ("Principle" → "Principal", "Wadonga" → "Wodonga"); the URL slugs keep the original spelling.
export type Tag = "Reserve fund plans" | "Valuations" | "Speed" | "Regional" | "Easy to read";

export const tags: Tag[] = ["Reserve fund plans", "Valuations", "Speed", "Easy to read", "Regional"];

export type Testimonial = { quote: string; name: string; role: string; tags: Tag[]; featured?: boolean; slug: string };

export const allTestimonials: Testimonial[] = [
  {
    quote:
      "At Albury Wodonga Real Estate we have found that ‘BIV Reports’ provide cost effective, well written reports that are easy to follow. They offer a good service responding quickly to any urgent requests and their extensive knowledge and advice provides us with absolute confidence in their product. BIV Reports makes our job easier.",
    name: "Christine Nesbit",
    role: "Principal and Licensee, Albury Wodonga Real Estate",
    tags: ["Easy to read", "Speed", "Regional"],
    slug: "christine-nesbit-principle-and-licensee-albury-wadonga-real-estate",
  },
  {
    quote:
      "We emailed a question to BIV Reports and within an hour we had a reply phone call and an answer. These guys are prompt, professional and caring. BIV Reports know their work and they know strata properties. They have valued our portfolio and we have been very happy with receiving the valuations on time and well before each insurance renewal. I recommend their service to any prudent strata manager.",
    name: "Michael Kimpton",
    role: "Director, MK Owners Corporation Services Pty Ltd",
    tags: ["Valuations", "Speed"],
    featured: true,
    slug: "michael-kimpton-director-mk-owners-corporation-services-pty-ltd",
  },
  {
    quote:
      "The BIV Reports we receive are clear, concise and of the highest quality. I use BIV Reports for all of my necessary Reports and wouldn’t go anywhere else. Their back office is a pleasure to deal with and their prices are excellent. I have no hesitation in recommending their services.",
    name: "Bryan",
    role: "Owners Corporation Manager, Tideways",
    tags: ["Easy to read"],
    slug: "bryan-owners-corporation-manager-tideways",
  },
  {
    quote:
      "BIV Reports are price competitive and their Reports usually take two weeks, with urgent requests being completed in a few days. I can speak to the Directors easily and Shane Foley has attended one of my Executive Meetings to support me in explaining the purpose and utility of a Maintenance Fund Plan. In addition, queries are responded to very quickly from their office.",
    name: "Emma Fairbrother",
    role: "Strata Plan Pty Ltd",
    tags: ["Reserve fund plans", "Speed"],
    slug: "emma-fairbrother-strata-plan-pty-ltd",
  },
];

export const testimonialCount = allTestimonials.length;
export const testimonialByName = (n: string) => allTestimonials.find((t) => t.name === n)!;
export const testimonialPath = (slug: string) => `/testimonials/${slug}/`;
