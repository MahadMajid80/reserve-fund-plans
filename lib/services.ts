// Full content for the four service pages and the four FAQ pages.
// Text is carried over from the old reservefundplans.com.au pages (services/biv, whs, sfp, asb and the four FAQ pages),
// lightly tidied for grammar and Australian spelling, with legislation references updated to current WA law.
// "tagline" lines are new copy. See docs/CLAIMS-TO-CONFIRM.md for anything flagged.
import type { DiamondKey } from "./content";
import { beatQuote, facts, org, paths } from "./site";

export type Faq = { q: string; a: string[]; list?: string[]; table?: [string, string][] };
export type Section = { title: string; body?: string[]; list?: string[]; after?: string[] };

export type Special =
  | { kind: "frequency"; title: string; intro: string; rows: { type: string; every: string; years: number }[] }
  | { kind: "consider"; points: string[]; goal: string; is: string; isNotTitle: string; isNot: string[]; final: string[] }
  | { kind: "hazards"; title: string; intro: string; hazards: string[]; note: string }
  | {
      kind: "penalties";
      title: string;
      intro: string;
      rows: { category: string; desc: string; corp: number; officer: string; worker: string }[];
    };

export type Service = {
  slug: "biv" | "whs" | "sfp" | "asb";
  path: string;
  faqPath: string;
  key: DiamondKey;
  code: string;
  /** One product name used everywhere (singular). */
  name: string;
  /** Plural label for cards and menus. */
  title: string;
  h1: string;
  seoTitle: string;
  description: string;
  tagline: string;
  /** Short summary carried over from the old /services/ page. */
  excerpt: string;
  why: { q: string; a: string[] };
  facts: { label: string; value: string }[];
  sections: Section[];
  order: { title: string; intro: string; steps: string[] };
  special: Special;
  further: string;
  /** Short noun for "Order your …" */
  noun: string;
  faq: { h1: string; title: string; description: string; intro: string; faqs: Faq[] };
  offer?: { price: string; description: string };
};

export const turnaround = `Our normal turnaround time is around ${facts.turnaround}, and ${beatQuote}.`;

const frequencyRows = [
  { type: "Lot 1 in most Community Schemes", every: "Each 5 years", years: 5 },
  { type: "Community Scheme Lot 1 with major improvements (sheds, cabana, pool, recreation hall, community hall, BBQ areas)", every: "Each 2–3 years", years: 2.5 },
  { type: "Three level walk-up (12 and 18 packs)", every: "Each 2–3 years", years: 2.5 },
  { type: "Villas, townhouses and the like", every: "Each 2–3 years", years: 2.5 },
  { type: "Six level and more schemes (residential or other)", every: "Each year", years: 1 },
  { type: "Industrial office warehouses: old", every: "Each 1–2 years", years: 1.5 },
  { type: "Industrial office warehouses: new", every: "Each 2–3 years", years: 2.5 },
  { type: "Commercial office buildings: large", every: "Each 1–2 years", years: 1.5 },
  { type: "Commercial office buildings: small", every: "Each 2–3 years", years: 2.5 },
];

const rv = facts.revaluation;


export const services: Service[] = [
  /* ═══════════════ Building Insurance Valuation ═══════════════ */
  {
    slug: "biv",
    path: paths.biv,
    faqPath: paths.faqBiv,
    key: "blue",
    code: "BIV",
    name: "Building Insurance Valuation",
    title: "Building Insurance Valuations",
    h1: "Building Insurance Valuation",
    seoTitle: "Strata Building Insurance Valuations WA | Reserve Fund Plans",
    description:
      "Building Insurance Valuations for WA strata and community schemes by valuers since 1984. Certificates of Value for full replacement cost in 3–7 business days.",
    tagline: "Know your true replacement cost, before you ever need it.",
    excerpt: "We provide Certificates of Value for the replacement cost and reinstatement of strata and community scheme buildings.",
    why: {
      q: "Why do I need an Insurance Valuation?",
      a: [
        "In Western Australia a strata company must insure its buildings and other insurable assets for replacement value (Strata Titles Act 1985, s97). A current valuation is the most reliable way to know what that figure is.",
        `We consider it prudent for all strata schemes to obtain a valuation by a valuer ${rv.minimum}, and recommend a valuation ${rv.recommended} (and in some cases every year for larger commercial and industrial properties) so the insured value reflects true building replacement costs.`,
      ],
    },
    facts: [
      { label: "Prepared by", value: "A valuer" },
      { label: "Turnaround", value: facts.turnaround },
      { label: "Indemnity cover", value: facts.indemnity },
      { label: "Insure for", value: "Replacement value" },
    ],
    sections: [
      {
        title: "Certificates of Value for strata and community schemes",
        body: [
          "We provide Certificates of Value for the replacement cost and reinstatement of the buildings and other improvements of the Strata or Community Plan, so the strata company can meet its obligation to insure for replacement value under the Strata Titles Act 1985 (WA).",
        ],
      },
      {
        title: "Experience",
        body: [
          "Our chief valuer has over 30 years experience including Expert Evidence in numerous Courts and due diligence on the largest property transactions in Australia to the smaller suburban cottage, amongst other things.",
          "We recommend that a Valuer carries out your Building Insurance Valuation.",
        ],
      },
      {
        title: "Professional indemnity insurance",
        body: [`We are members of a Cover of Excellence scheme under the Professional Standards Councils and we carry ${facts.indemnity} Professional Indemnity Insurance.`],
      },
      {
        title: "Re-valuation frequency",
        body: [
          `Good strata and property managers obtain a Building Insurance Valuation at least every three years, and in some cases each year. This protects against potential loss from under-insurance. We consider that the best solution is to have ${rv.best} by a Valuer to ensure that your sum insured keeps up to date with the market changes in building costs.`,
          "If you are under-insured the insurance company may use the “co-insurance” or averaging clause of the Policy and may only pay a portion of the true replacement cost of the improvements. The shortfall may have to be paid by the owner, or the Strata Manager if found to be negligent by not getting an updated and current Building Insurance Valuation.",
          `Be aware that building costs can increase significantly faster than CPI. For example, ${facts.stale.costRise2004}. There is a danger of simply applying a CPI or arbitrary increase without being familiar with the movement in construction costs.`,
          "Use our service to determine an accurate and up to date Building Insurance Valuation for your sum insured.",
        ],
      },
      {
        title: "Compliance",
        body: [
          "Our Building Insurance Valuation Reports follow the relevant legislation and good valuation practice as required by the Valuers Institute. Our Report details the individual components that correctly make up a valid Building Insurance Valuation such as demolition costs, professional and Council fees, escalation in construction costs and GST, amongst other things.",
          "We also take into account different cost factors such as location (some country areas or less accessible areas), different types of construction material, different finishes, heritage items and the like.",
          "We are specialists in this type of valuation work.",
        ],
      },
    ],
    order: {
      title: "Ordering a Building Insurance Valuation",
      intro: "When we receive your instructions we will:",
      steps: [
        "Inspect the subject property and assess the materials, and the amount of materials, required for the complete replacement of the building and its ancillary improvements.",
        "Take photos of the improvements and the surrounding area.",
        "Estimate the replacement cost of the improvements and materials, and allow for any additional items specified in the relevant legislation or required by good valuation practice.",
        "Ensure that the Building Insurance Valuation is carried out by a Valuer.",
        "Provide Certificates of Value: usually one bound copy, one unbound for photocopying, and a PDF file for emailing.",
      ],
    },
    special: {
      kind: "frequency",
      title: "How often should you revalue?",
      intro: "It depends on the type of property. Pick yours to see our recommended minimum frequency.",
      rows: frequencyRows,
    },
    further:
      "In addition to carrying out Building Insurance Valuations, we also assess and prepare Asbestos Registers and Asbestos Management Plans, Reserve Fund Plans (Maintenance Plans), and Work Health and Safety Reports including ‘Common Law Duty of Care’ Reports.",
    noun: "valuation",
    faq: {
      h1: "Building Insurance Valuation FAQs",
      title: "Building Insurance Valuation FAQs | Reserve Fund Plans",
      description:
        "Building Insurance Valuation FAQs for WA strata: what it is, whether owners need one, how it affects premiums and how often buildings should be revalued.",
      intro: "Answers to the questions strata companies and strata managers ask us most about Building Insurance Valuations.",
      faqs: [
        {
          q: "What is a Building Insurance Valuation?",
          a: [
            "A Building Insurance Valuation is a professional assessment carried out by a Valuer of the replacement cost of all improvements within a strata scheme, community scheme or stand-alone property.",
            "The Building Insurance Valuation also allows for the escalation of construction costs over the period of insurance, and the periods for documentation and construction of the replacement building, an allowance for professional fees, demolition and removal of debris, and GST, amongst other things.",
          ],
        },
        {
          q: "Do the owners need to get a Building Insurance Valuation?",
          a: [
            "A WA strata company must insure its buildings for replacement value. It is prudent to obtain a Building Insurance Valuation from Reserve Fund Plans to meet that obligation.",
            `For added assurance, we carry ${facts.indemnity} Professional Indemnity Insurance.`,
          ],
        },
        {
          q: "What is the benefit of obtaining a Building Insurance Valuation?",
          a: [
            "The benefit of obtaining a Building Insurance Valuation regularly is to ensure that the sum insured is in line with the real cost of replacing the improvements in the case of total destruction or partial damage.",
            "For large strata and community schemes we recommend an annual valuation, rather than the strata company or property owner simply accepting some arbitrary escalation from insurers or brokers well above the actual rise in construction costs.",
          ],
        },
        {
          q: "Does a Building Insurance Valuation increase the amount that owners have to pay on an annual basis?",
          a: [
            "No. In fact, by obtaining a current Building Insurance Valuation the strata company and property owner can rest assured knowing that they are paying the appropriate premium based upon an accurate and current recommended sum insured.",
          ],
        },
        {
          q: "Can a Strata Company or the Owners vary a Building Insurance Valuation?",
          a: [
            "The strata company should insure the building for ‘at least’ the recommended sum insured from the latest Building Insurance Valuation. If the strata company or property owner and the insurer agree, the property can be insured for an amount higher than the recommended sum insured.",
          ],
        },
        {
          q: "How often should a Building Insurance Valuation be reviewed?",
          a: ["It depends on the type of property. In our opinion the following is a reasonable guide to a minimum frequency for obtaining revaluations."],
          table: frequencyRows.map((r) => [r.type, r.every]),
        },
      ],
    },
  },

  /* ═══════════════ Work Health and Safety (WHS) Report ═══════════════ */
  {
    slug: "whs",
    path: paths.whs,
    faqPath: paths.faqWhs,
    key: "sage",
    code: "WHS",
    name: "WHS Report",
    title: "WHS Reports",
    h1: "Work Health and Safety Reports",
    seoTitle: "Strata WHS Safety Reports WA | Reserve Fund Plans",
    description:
      "Work Health and Safety (WHS) Reports for WA strata properties: practical safety inspections with a risk assessment for every hazard. Request a quote.",
    tagline: "Practical safety reports that focus on genuine hazards.",
    excerpt: "Safety Reports identify hazards and the consequential risk of harm to people and potential damage to property.",
    why: {
      q: "Do I need a Safety Report?",
      a: [
        "As a strata company it is essential that you be aware of the likely hazards and associated risks you are obliged to control under your Common Law Duty of Care (reflected in the Civil Liability Act 2002 (WA)) and, where it applies to you, the Work Health and Safety Act 2020 (WA).",
      ],
    },
    facts: [
      { label: "Also called", value: "OHS · Duty of Care" },
      { label: "Turnaround", value: facts.turnaround },
      { label: "Each hazard", value: "Risk assessed" },
      { label: "Legislation", value: "WHS Act 2020 (WA)" },
    ],
    sections: [
      {
        title: "What a WHS Report covers",
        body: [
          "Safety Reports are sometimes called WHS Reports, OHS Reports, Duty of Care Reports, Hazard Reports and the like. In essence, each is similar: the purpose of a Safety Report is to identify hazards and the risk of harm to people or potential damage to property, from both a Common Law Duty of Care and a WHS legislative requirement.",
        ],
      },
      {
        title: "Safety obligations",
        body: [
          "A property has to be without risks to the health and safety of any person. Our Work Health and Safety Inspections take a practical and sensible approach to dealing with, and recommending the best treatment of, any hazards and any likely risks associated with those hazards.",
        ],
      },
      {
        title: "Legislative obligations",
        body: [
          "Our Safety Report addresses your general obligations under the Civil Liability Act 2002 (WA), the Work Health and Safety Act 2020 (WA) and the Work Health and Safety (General) Regulations 2022 where they apply, and your Common Law Duty of Care.",
          "Western Australia’s Work Health and Safety Act 2020 and its regulations commenced on 31 March 2022, replacing the earlier occupational safety and health laws for most workplaces.",
        ],
      },
      {
        title: "Proper risk assessment",
        body: [
          "We carry out a separate and proper Risk Assessment of each identified hazard so that you can more easily prioritise your resources.",
          "Our Safety Report is NOT a current standards compliance report where every structure and item has to be brought up to the current National Construction Code (formerly the Building Code of Australia). Our Safety Reports focus on genuine hazards and risks to people and property, and our recommendations are practical and common sense.",
        ],
      },
    ],
    order: {
      title: "Ordering a Safety Report",
      intro: "When we receive your instructions we will:",
      steps: [
        "Physically carry out an inspection of the property.",
        "Take a practical and flexible approach to control measures to either eliminate or minimise any hazard.",
        "Prioritise risk by carrying out a proper Risk Assessment for each identified hazard, so that the Owners can decide which hazards should be rectified first.",
        "Carry out a visual inspection of the electrical board if access is provided on the day of inspection, although we do not employ electrical engineers.",
        "Provide colour photographs, the location and a description of any hazards that are identified on the subject property.",
        "Provide a thorough explanation within our WHS Report.",
      ],
    },
    special: {
      kind: "hazards",
      title: "Types of hazards",
      intro: "Some of the typical hazards can be identified in a number of broad categories. Every one we find gets its own risk assessment.",
      hazards: ["Trip", "Fall", "Electrical", "Protrusion", "Slip", "Crush"],
      note: "…amongst many others.",
    },
    further:
      "In addition to carrying out Work Health and Safety Reports, we also assess and prepare Building Insurance Valuations, Asbestos Registers and Asbestos Management Plans, and Reserve Fund Plans (Maintenance Plans).",
    noun: "WHS Report",
    faq: {
      h1: "Work Health and Safety FAQs",
      title: "Work Health and Safety FAQs | Reserve Fund Plans",
      description:
        "Work Health and Safety FAQs for WA strata owners: what a safety inspection is, whether you need one, what it costs owners and how often to re-inspect.",
      intro: "Answers to the questions strata companies and strata managers ask us most about safety inspections and WHS Reports.",
      faqs: [
        {
          q: "What is a Safety Inspection?",
          a: [
            "Primarily, a safety inspection identifies the likely hazards and risk of harm to people or potential damage to property, from both a Common Law Duty of Care and a legislative requirement.",
            "In essence, a property has to be without risks to the health and safety of any person. Our inspections take a practical and sensible approach to dealing with and treating any hazards and any likely risks associated with those hazards.",
            "It is NOT a current standards compliance report where every structure and item has to be brought up to the current building standards.",
          ],
        },
        {
          q: "Do the owners and Strata Company need to get a Safety Inspection?",
          a: [
            "A strata company or property owner has a Common Law Duty of Care to ensure that their property is without risks to the health and safety of any person. This duty is reflected in the Civil Liability Act 2002 (WA).",
            "It is absolutely prudent to obtain a professional Safety Report from Reserve Fund Plans to be able to demonstrate to a Court that you have taken reasonable steps and proper care in the management and ownership of your property.",
            "Under work health and safety laws, a strata company for a purely residential scheme is generally not treated as a Person Conducting a Business or Undertaking (PCBU) unless it engages a worker as an employee. Its Common Law Duty of Care still applies.",
          ],
        },
        {
          q: "What is the benefit of obtaining a Safety Inspection?",
          a: [
            "The benefit of obtaining a professional Safety Report is to identify and then fix any likely hazards so that your property is safe for you, your children and extended family, and your visitors.",
            "In addition, you are significantly minimising any legal issue when you can demonstrate to a Court that you have taken reasonable steps and proper care in the management and ownership of your property. Insurers may also decline to insure a property with significant safety hazards.",
          ],
        },
        {
          q: "Does a Safety Inspection increase the amount that owners have to pay on an annual basis?",
          a: [
            "In some cases where the property has significant hazards that need to be addressed, the answer is yes.",
            "Proper management and care of a property would ordinarily include the rectification and minimisation of the risk of harm. It is usually where a maintenance program has been neglected that issues of risk of harm, and consequential costs, arise. Insurers may also refuse cover for properties with significant hazards.",
          ],
        },
        {
          q: "Can Owners or a Strata Company vary a Safety Report?",
          a: [
            "A Safety Report can be varied by an owner dealing with the likely control measures that are recommended within a report. For example, a recommendation may include the grinding down of an exposed trip hazard in an access way; however, an owner may decide that it is ‘reasonably practicable’ to simply secure that area from anyone being able to enter, or apply highlight paint to the hazard and warning signage as an interim measure.",
            "That is, a different control measure may be implemented to the recommended control measures, and the identified hazard has to be addressed.",
          ],
        },
        {
          q: "How often should a Safety Inspection be reviewed?",
          a: [
            "It depends on the property. Larger strata or community schemes, particularly where hazards can change quickly, should ideally be re-inspected annually. A modern small villa complex with limited common property may be best served with a two to three yearly re-inspection cycle, whereas a commercial or retail property with a large number of transient people may require a six-monthly or annual re-inspection.",
          ],
        },
      ],
    },
  },

  /* ═══════════════ Reserve Fund Plan ═══════════════ */
  {
    slug: "sfp",
    path: paths.sfp,
    faqPath: paths.faqSfp,
    key: "brass",
    code: "RFP",
    name: "Reserve Fund Plan",
    title: "Reserve Fund Plans",
    h1: "10 Year Reserve Fund Plans",
    seoTitle: "10 Year Reserve Fund Plans for WA Strata | Reserve Fund Plans",
    description:
      "10 Year Reserve Fund Plans (maintenance plans) for WA strata companies, prepared by a valuer after a site inspection. Easy to read. Request a quote.",
    tagline: "Set aside the right amount each year. No more, no less.",
    excerpt: "A strata company with 10 or more lots, or a replacement value of $5 million or more, must keep a reserve fund and a 10 year plan.",
    why: {
      q: "Why do I need a Reserve Fund Plan?",
      a: [
        "Under the Strata Titles Act 1985 (WA), a strata company with 10 or more lots, or with a replacement value of $5 million or more, must keep a reserve fund and prepare a 10 year plan. The plan must be reviewed at least every five years, and taken into account when the annual budget is set.",
        "This enables the strata company to plan for the cost of maintaining its common property by raising appropriate reserve funds to cover necessary expenditure, rather than relying on special levies.",
      ],
    },
    facts: [
      { label: "Plan length", value: "10 years" },
      { label: "Review", value: "At least every 5 years" },
      { label: "Turnaround", value: facts.turnaround },
      { label: "Indemnity cover", value: facts.indemnity },
    ],
    sections: [
      {
        title: "What our Reserve Fund Plans cover",
        body: [
          "We specialise in, and are passionate about, providing 10 Year Reserve Fund Plans (sometimes referred to as Maintenance Plans) which are compliant with the Strata Titles Act 1985 (WA).",
          "The plan lists the common property expected to need maintenance, repair, renewal or replacement beyond routine upkeep, such as windows, fencing, concrete paths, lighting and the painting of buildings, amongst many other things. Our plans are practical and are set out in Easy To Read Reports.",
        ],
      },
      {
        title: "Strata company obligations",
        body: [
          "The purpose of a Reserve Fund Plan is to determine the amount to be set aside each year to meet expenses of a capital nature, allowing for the escalation of construction costs over the 10 years.",
          "The benefit of obtaining a Reserve Fund Plan is to provide a pool of funds to be easily applied to maintain the appearance and the quality of the improvements contained within the strata scheme, thereby assisting the strata company to meet its legal obligations.",
        ],
      },
      {
        title: "Strict duty to repair and maintain common property",
        body: [
          "A strata company must keep its common property in good and serviceable repair. The reserve fund provides the mechanism to have sufficient funds available to meet that obligation when major items wear out.",
          "In addition, there is the Common Law Duty of Care to all visitors and owners to ensure that the property is safe for any person, reflected in the Civil Liability Act 2002 (WA).",
        ],
      },
      {
        title: "Reviews: the best approach",
        list: [
          "Review the plan within 5 years from the date of the last plan, as the Act requires.",
          "Obtain a new report with a new site inspection.",
          "Consider any variation to the existing annual reserve fund contributions.",
          "It is similar to reviewing a budget to adjust and fine-tune the savings for the strata company.",
        ],
      },
      {
        title: "Risk management",
        body: [
          "Appropriate funding may prevent the owners from breaching their strict statutory obligation to repair and maintain common property, and prevent the owners from incurring unnecessary costs, as occurred in Seiwa Australia Pty Limited v Owners SP35042 [2006] NSWSC 1157 and Nicita v Owners SP64837 [2010] NSWSC 68.",
        ],
      },
    ],
    order: {
      title: "Ordering a Reserve Fund Plan",
      intro: "Once we receive an order for a Reserve Fund Plan we will:",
      steps: [
        "Inspect the subject property and identify likely items requiring repair, renewal, replacement or maintenance within and beyond 10 years.",
        "Provide the strata company with the opportunity to include additional items that they would like: for example, earlier renewal of landscaping, or upgrading other common areas such as building a BBQ area, kids’ playground or gym.",
        "Analyse, prepare and issue the 10 Year Reserve Fund Plan, with the recommended amount to be set aside each year, the total amount to be expended throughout the 10 year term (including an allowance for the escalation of construction costs), and the likely timeframe for the maintenance or replacement of each item.",
        "Take photos of relevant replacement or maintenance items.",
        "Ensure that the 10 Year Reserve Fund Plan is carried out by a Valuer.",
      ],
    },
    special: {
      kind: "consider",
      points: [
        "Independent, unbiased advice",
        "Avoid unnecessary Special Levies",
        "User pays: a fairer system",
        "Adds value: a well maintained building and a healthy reserve fund balance",
        "Legal requirement to maintain common property",
        "Good practice",
        "Saves owners and strata managers time",
        "Professionally carried out",
        `Risk transfer: we have ${facts.indemnityShort} Professional Indemnity insurance for the Reserve Fund Plan`,
        "Addresses latent and unforeseen costs",
      ],
      goal: "Goal of a Reserve Fund Plan",
      is: "To simply determine the amount to be set aside each year.",
      isNotTitle: "What a Reserve Fund Plan is NOT",
      isNot: [
        "A detailed quote for every single item, for replacement, renewal or repair",
        "A highly accurate assessment of the cost and time frame",
        "A Dilapidation Report",
        "A Maintenance Schedule",
        "An opportunity for the owners to get free building, fire or safety advice",
      ],
      final: [
        "Legislation: a strict duty to repair and maintain common property",
        "An ageing population on fixed incomes",
        "No ability to comply without adequate funds",
        "Potential increase in safety and litigation issues (and potentially no insurance)",
        "Resistance to setting money aside may present a difficult management situation",
      ],
    },
    further:
      "In addition to carrying out Reserve Fund Plans (Maintenance Plans), we also assess and prepare Building Insurance Valuations, Asbestos Registers and Asbestos Management Plans, and Work Health and Safety Reports including ‘Common Law Duty of Care’ Reports.",
    noun: "Reserve Fund Plan",
    faq: {
      h1: "Reserve Fund Plan FAQs",
      title: "Reserve Fund Plan FAQs | Reserve Fund Plans",
      description:
        "Reserve Fund Plan FAQs for WA strata: what a 10 year plan is, whether your strata company needs one, how it affects levies and how often to review it.",
      intro: "Answers to the questions strata companies and strata managers ask us most about 10 Year Reserve Fund Plans.",
      faqs: [
        {
          q: "What is a Reserve Fund Plan?",
          a: [
            "A plan as to how the strata company will meet its strict liability to repair and maintain common property and raise sufficient funds to cover the costs. The annual amounts required for the 10 year plan will vary between schemes; for instance, newer schemes may require relatively less money than the plans for older schemes with more repair work due.",
          ],
        },
        {
          q: "Does a Strata Company have to get a Reserve Fund Plan?",
          a: [
            "In Western Australia, a strata company with 10 or more lots, or with a replacement value of $5 million or more, must keep a reserve fund and a 10 year plan under the Strata Titles Act 1985 (WA).",
            "The plan must be reviewed, and adjusted if required, at least every five years, and taken into account when the annual budget is set. Smaller schemes can choose to have one.",
          ],
        },
        {
          q: "What is the benefit of obtaining a Reserve Fund Plan?",
          a: [
            "A good plan should increase the value of your property by ensuring it presents well and is well maintained. Our Australian designed and owned software provides flexibility in our reserve fund recommendations to ensure that you:",
          ],
          list: [
            "Do not have excessive funds sitting around in the bank",
            "Have minimal but sufficient annual reserve fund contributions (no special levies)",
            "Do not have to pay levies larger than are required",
          ],
        },
        {
          q: "Does a Reserve Fund Plan increase the amount that owners have to pay on an annual basis?",
          a: [
            "It is not a black and white answer; each reserve fund plan should reflect the individual needs of its scheme. On some occasions we have recommended a reduction in the amount being collected, due to unnecessary money sitting idle in the reserve fund account.",
            "An increase may be recommended if the current amount being collected is insufficient to address the projected cost of repairing, maintaining or renewing the improvements and their surrounds.",
          ],
        },
        { q: "Can a Strata Company vary a Reserve Fund Plan?", a: ["Yes. It is their fund to use as they need, providing they meet their strict obligations to repair and maintain the common property."] },
        { q: "How often should a Reserve Fund Plan be reviewed?", a: ["The Act requires a review at least every five years. We recommend a Reserve Fund Plan be prepared every 2–3 years."] },
      ],
    },
  },

  /* ═══════════════ Asbestos Report ═══════════════ */
  {
    slug: "asb",
    path: paths.asb,
    faqPath: paths.faqAsb,
    key: "oxblood",
    code: "ASB",
    name: "Asbestos Report",
    title: "Asbestos Reports",
    h1: "Asbestos Reports",
    seoTitle: "Strata Asbestos Register & Management Plan WA | Reserve Fund Plans",
    description:
      "Asbestos Reports for WA strata and commercial properties: an Asbestos Register and Asbestos Management Plan in one report, from a visual inspection.",
    tagline: "A Register and a Management Plan, together, in one report.",
    excerpt: "Our Asbestos Report includes both an ‘Asbestos Register’ and an ‘Asbestos Management Plan’.",
    why: {
      q: "Why do I need an Asbestos Report?",
      a: [
        "Our Asbestos Report includes BOTH an Asbestos Register and an Asbestos Management Plan.",
        "In Western Australia, a workplace in a building constructed before 31 December 2003 must have an Asbestos Register unless no asbestos has been identified there. This can apply to commercial, retail, industrial and mixed-use strata schemes where the common property is a workplace.",
      ],
    },
    facts: [
      { label: "Includes", value: "Register + Management Plan" },
      { label: "Inspection", value: "Visual" },
      { label: "Turnaround", value: facts.turnaround },
      { label: "Testing", value: "NATA accredited labs" },
    ],
    sections: [
      {
        title: "What an Asbestos Report covers",
        body: [
          "There are requirements under Work Health and Safety legislation to prepare and display an Asbestos Register at a workplace. Where asbestos has been identified or is assumed to be present, an Asbestos Management Plan must also be implemented and reviewed at least every five years, or sooner if conditions change. Our Asbestos Report gives you both.",
        ],
      },
      {
        title: "Asbestos Register",
        body: ["An Asbestos Register identifies Asbestos or Asbestos Containing Material (ACM) and where it is located on the subject property. A complying Asbestos Register has the following minimum features:"],
        list: [
          "A proper Risk Assessment has been carried out on each identified item",
          "Appropriate control measures and hierarchy of control to limit the exposure to the ACM",
          "Whether the ACM is non-friable, or friable (able to be crushed with hand pressure)",
          "Identification of the size and extent of the ACM",
          "The type or name of the ACM product",
          "The specific location of any ACM",
          "Whether the ACM is accessible",
          "The condition of the ACM and the contamination risk, amongst other things",
        ],
      },
      {
        title: "Asbestos Management Plan",
        body: [
          "An Asbestos Management Plan sets out the way in which the Asbestos or ACM is to be treated: for example, whether using a hierarchy of controls, or simply left in place and continually monitored. A complying Asbestos Management Plan contains the following minimum information:",
        ],
        list: [
          "The date to commence and the date to complete any proposed works",
          "The person responsible for implementing the control measures",
          "The recommended control measures",
          "The size and extent of the ACM",
          "The location of the item",
          "The item description, amongst other things",
        ],
      },
      {
        title: "Assumed asbestos",
        body: [
          "Under WHS regulations, a competent person who reasonably believes that a material contains asbestos may assume that it is ACM. If asbestos or ACM is assumed to be present at a workplace, it is taken to be identified at the workplace.",
        ],
      },
      {
        title: "Testing",
        body: [
          "A person with management or control of a workplace may identify asbestos or ACM by arranging for a sample to be analysed. There is no legislative requirement for any samples to be tested. In fact, the key principle in dealing with Asbestos or ACM is that the material NOT BE DISTURBED. Gouging, cutting or breaking material to obtain a sample simply increases the risk of releasing dangerous asbestos fibres, regardless of sealing the damaged material with PVA, paint and the like.",
          "Reserve Fund Plans does not recommend that Asbestos and ACM be disturbed for the purpose of obtaining samples for testing. However, where work is to be carried out on or near an item identified as Asbestos or ACM, our trained asbestos Inspectors can obtain a sample using the appropriate Codes of Practice. Each sample will then be tested by a NATA Accredited laboratory in Western Australia.",
        ],
      },
      {
        title: "It is prudent to obtain an Asbestos Report",
        body: [
          "Although there are exemptions under Work Health and Safety legislation for some residential strata schemes, none of these exemptions protect the owner from legal action for a breach of their Common Law Duty of Care, also known as occupiers’ liability. Asbestos is a known dangerous material and, as such, each owner has a Duty of Care to ensure that no harm comes to anyone as a result of the asbestos on that property.",
          "For the small fee of obtaining an Asbestos Report, a strata company or property owner can obtain a significant degree of protection: not only knowing what items may contain asbestos, but also being able to demonstrate that they have taken reasonable steps in identifying hazards on their property.",
        ],
      },
    ],
    order: {
      title: "Ordering an Asbestos Report",
      intro: "When we receive your instructions we will:",
      steps: [
        "Inspect the subject property.",
        "Take a practical and flexible approach to control measures to either eliminate or minimise any Asbestos or ACM hazard.",
        "Prioritise risk by carrying out a proper Risk Assessment for each identified Asbestos or ACM hazard, so that the Owners can decide which hazards should be rectified first.",
        "Carry out a visual inspection only of each item that may be Asbestos or ACM.",
        "Provide colour photographs, the location and a description of any Asbestos or ACM hazards that are identified on the subject property.",
        "Provide a thorough explanation within our Asbestos Report.",
      ],
    },
    special: {
      kind: "penalties",
      title: "Penalties under WA work health and safety law",
      intro:
        "There are significant penalties for failing to comply with health and safety duties under the Work Health and Safety Act 2020 (WA), particularly where someone is harmed. Maximum penalties as at 1 August 2026 (Safe Work Australia).",
      rows: [
        { category: "Category 1", desc: "Breach of a health and safety duty causing death or serious harm (s31)", corp: 3_500_000, officer: "$680,000 and up to 5 years’ imprisonment", worker: "$340,000" },
        { category: "Category 2", desc: "Breach of a health and safety duty exposing an individual to the risk of death or serious harm (s32)", corp: 1_800_000, officer: "$350,000", worker: "$170,000" },
        { category: "Category 3", desc: "Failure to comply with a health and safety duty (s33)", corp: 570_000, officer: "$120,000", worker: "$55,000" },
      ],
    },
    further:
      "In addition to carrying out Asbestos Registers and Asbestos Management Plans, we also assess and prepare Work Health and Safety Reports including ‘Common Law Duty of Care’ Reports, Reserve Fund Plans (Maintenance Plans), and Building Insurance Valuations.",
    noun: "Asbestos Report",
    faq: {
      h1: "Asbestos Report FAQs",
      title: "Asbestos Report FAQs | Reserve Fund Plans",
      description:
        "Asbestos Report FAQs for WA strata owners: what is included, whether you need one, the benefits, whether it can be varied and how often to review it.",
      intro: "Answers to the questions strata companies and strata managers ask us most about Asbestos Reports, Asbestos Registers and Asbestos Management Plans.",
      faqs: [
        {
          q: "What is an Asbestos Report?",
          a: [
            "Our Asbestos Report includes BOTH an Asbestos Register and an Asbestos Management Plan.",
            "The Asbestos Register is a Work Health and Safety requirement for many workplaces. An Asbestos Management Plan sets out the control measures and time frames to address any identified Asbestos or Asbestos Containing Material (ACM).",
          ],
        },
        {
          q: "Do the owners need to get an Asbestos Report?",
          a: [
            "There are exemptions from Work Health and Safety legislation for many residential strata schemes from having to obtain an Asbestos Register and an Asbestos Management Plan, particularly where the strata scheme does not engage any worker as an employee. However, none of these exemptions protect the owner from legal action for a breach of their Common Law Duty of Care.",
            "Asbestos is a known dangerous material and, as such, each owner has a Duty of Care to ensure that no harm comes to anyone as a result of the asbestos on that property. A prudent owner should simply obtain an Asbestos Report for the small fee that we charge.",
          ],
        },
        {
          q: "What is the benefit obtaining an Asbestos Report?",
          a: [
            "You would be complying with legislation where required and, from a Common Law Duty of Care point of view, you would be discharging one of the key onuses of a responsible property owner: identifying hazards.",
            "Without an Asbestos Register a contractor is at risk, and so is the instructing property owner or their agent, particularly if an asbestos contamination incident occurs. Contractors who know which items contain asbestos can wear protective equipment, contain and collect any dust properly, and correctly dispose of any hazardous material.",
          ],
        },
        {
          q: "Does an Asbestos Report increase the amount that owners have to pay on an annual basis?",
          a: [
            "If anything, obtaining an Asbestos Report saves money. Where a register is required and multiple contractors attend a property, each would otherwise have to obtain an Asbestos Register. It is more prudent for a property owner to simply obtain one Asbestos Register, rather than pay for multiple registers through each contractor’s quote.",
          ],
        },
        {
          q: "Can Owners vary an Asbestos Report?",
          a: [
            "Generally, an Owner cannot arbitrarily vary an Asbestos Register. If an item was assumed to contain asbestos, the Register can be varied if a sample is taken of that item, analysed by a NATA Accredited Lab and found not to contain asbestos. The notation on that item in the Register can then be varied in accordance with the lab analysis, which should be attached to the register.",
            "An Asbestos Management Plan can be varied by an owner provided that appropriate measures are taken. The plan covers the rectification, removal or other works, who is responsible for that work and when it must be done.",
          ],
        },
        {
          q: "How often should an Asbestos Report be reviewed?",
          a: [
            "An Asbestos Report should be reviewed regularly to ensure that no damage to an item containing asbestos, or assumed to contain asbestos, has occurred. Where a management plan is required, it must be reviewed at least every five years, or sooner if conditions change.",
          ],
        },
      ],
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const totalFaqs = services.reduce((n, s) => n + s.faq.faqs.length, 0);

/** Stable id for a question, used for #anchors from the FAQ hub. */
export const faqId = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
