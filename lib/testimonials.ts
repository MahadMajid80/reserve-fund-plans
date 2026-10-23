// The four testimonials published on the old reservefundplans.com.au, quoted verbatim. The full wording comes from
// the same testimonials as published on biv.com.au (the old Reserve Fund Plans pages show matching excerpts).
// Each keeps its original detail-page URL. The quotes name "BIV Reports", the sister brand; they are kept as written.
// Spelling fixes in the job titles only: "Principle" → "Principal", "Wadonga" → "Wodonga". TODO [ASK]: confirm.

export type Testimonial = { slug: string; name: string; role: string; quote: string; date: string };

export const testimonials: Testimonial[] = [
  {
    slug: "christine-nesbit-principle-and-licensee-albury-wadonga-real-estate",
    name: "Christine Nesbit",
    role: "Principal and Licensee, Albury Wodonga Real Estate",
    quote:
      "At Albury Wodonga Real Estate we have found that ‘BIV Reports’ provide cost effective, well written reports that are easy to follow. They offer a good service responding quickly to any urgent requests and their extensive knowledge and advice provides us with absolute confidence in their product. BIV Reports makes our job easier.",
    date: "2020-06-01",
  },
  {
    slug: "michael-kimpton-director-mk-owners-corporation-services-pty-ltd",
    name: "Michael Kimpton",
    role: "Director, MK Owners Corporation Services Pty Ltd",
    quote:
      "We emailed a question to BIV Reports and within an hour we had a reply phone call and an answer. These guys are prompt, professional and caring. BIV Reports know their work and they know strata properties. They have valued our portfolio and we have been very happy with receiving the valuations on time and well before each insurance renewal. I recommend their service to any prudent strata manager.",
    date: "2020-06-01",
  },
  {
    slug: "bryan-owners-corporation-manager-tideways",
    name: "Bryan",
    role: "Owners Corporation Manager, Tideways",
    quote:
      "The BIV Reports we receive are clear, concise and of the highest quality. I use BIV Reports for all of my necessary Reports and wouldn’t go anywhere else. Their back office is a pleasure to deal with and their prices are excellent. I have no hesitation in recommending their services.",
    date: "2020-06-01",
  },
  {
    slug: "emma-fairbrother-strata-plan-pty-ltd",
    name: "Emma Fairbrother",
    role: "Strata Plan Pty Ltd",
    quote:
      "BIV Reports are price competitive and their Reports usually take two weeks, with urgent requests being completed in a few days. I can speak to the Directors easily and Shane Foley has attended one of my Executive Meetings to support me in explaining the purpose and utility of a Maintenance Fund Plan. In addition, queries are responded to very quickly from their office.",
    date: "2020-06-01",
  },
];

export const testimonialPath = (slug: string) => `/testimonials/${slug}/`;
