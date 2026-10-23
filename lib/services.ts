// Service and FAQ content, rewritten from the old reservefundplans.com.au pages in plain Australian English.
// Meaning and claims are kept; outdated legislation references are updated only where verified against official
// sources, and everything uncertain is listed in docs/CLAIMS-TO-CONFIRM.md.
import { facts, paths } from "./site";

export type Block = string | { list: string[] } | { table: [string, string][]; head?: [string, string] } | { note: string };
export type Section = { id: string; heading: string; blocks: Block[] };
export type Faq = { q: string; a: Block[] };

export type ServiceKey = "sfp" | "biv" | "whs" | "asb";

export type Service = {
  key: ServiceKey;
  path: string;
  faqPath: string;
  /** short name used in menus and cards */
  name: string;
  /** H1 on the service page */
  h1: string;
  /** numbered tag shown on cards */
  code: string;
  title: string;
  description: string;
  /** opening paragraph under the H1 */
  lede: string;
  /** one-line card summary */
  summary: string;
  /** what the client receives */
  deliverables: string[];
  sections: Section[];
  faqTitle: string;
  faqH1: string;
  faqDescription: string;
  faqs: Faq[];
};

const turnaroundSection = (what: string): Section => ({
  id: "turnaround-and-fees",
  heading: "Turnaround time and fees",
  blocks: [
    `${what} are usually completed within ${facts.turnaround} of the inspection. Fees depend on the property, so we quote each job individually.`,
    `${facts.priceMatch}. Send it through with your quote request.`,
  ],
});

export const services: Service[] = [
  /* ───────────────────────── Reserve Fund Plans ───────────────────────── */
  {
    key: "sfp",
    path: paths.sfp,
    faqPath: paths.faqSfp,
    name: "Reserve Fund Plans",
    h1: "10-Year Reserve Fund Plans for WA Strata Companies",
    code: "01",
    title: "10-Year Reserve Fund Plans for WA Strata | Reserve Fund Plans",
    description:
      "Independent 10-year reserve fund plans (maintenance plans) for WA strata companies, prepared after a site inspection by a valuer. Request a quote.",
    lede:
      "A 10-year reserve fund plan sets out how a strata company will pay for the major repair, renewal and replacement of its common property over the next decade, so owners contribute steadily instead of facing a large special levy.",
    summary: "Ten-year plans that forecast common property repairs and set fair, steady owner contributions.",
    deliverables: [
      "A site inspection of the common property",
      "A 10-year schedule of expected repairs, renewals and replacements",
      "Recommended annual contributions, with cost escalation built in",
      "Photographs of the items assessed",
    ],
    sections: [
      {
        id: "why-you-need-one",
        heading: "Why does a strata company need a reserve fund plan?",
        blocks: [
          "Under the Strata Titles Act 1985 (WA), a strata company with 10 or more lots, or with a replacement value of $5 million or more, must keep a reserve fund and prepare a 10-year plan. The plan must be reviewed at least every five years, and the strata company must take it into account when it sets its annual budget.",
          "The plan lists the common property expected to need maintenance, repair, renewal or replacement beyond routine upkeep, and estimates what it will cost and when. Smaller schemes that are not required to have a plan often find one useful for the same reason: it turns large, irregular bills into predictable contributions.",
        ],
      },
      {
        id: "what-the-plan-covers",
        heading: "What our reserve fund plans cover",
        blocks: [
          "We prepare plans that are intended to comply with the Strata Titles Act 1985 (WA). Typical items include:",
          { list: ["Windows, doors and balustrades", "Fencing, gates and retaining walls", "Paths, driveways and car parks", "External lighting", "Painting of common areas and exteriors", "Roofs, gutters and downpipes"] },
          "The plan sets out the annual contribution needed to build the reserve fund, allowing for cost escalation over the 10 years.",
        ],
      },
      {
        id: "ordering-a-plan",
        heading: "Ordering a reserve fund plan",
        blocks: [
          "Once we receive your instructions, we:",
          {
            list: [
              "Inspect the property and its common property",
              "Consider any additional items the owners ask us to include",
              "Prepare the plan, with annual contributions and cost escalation",
              "Photograph the items assessed",
            ],
          },
          "The inspection and plan are carried out by a valuer.",
        ],
      },
      {
        id: "duty-to-repair",
        heading: "The strict duty to repair and maintain common property",
        blocks: [
          "A strata company must keep its common property in good and serviceable repair. The reserve fund exists so the company can meet that duty when major items wear out. The company also owes a common law duty of care to anyone who uses the property.",
        ],
      },
      {
        id: "reviews",
        heading: "Reviewing the plan",
        blocks: [
          "The Act requires the plan to be reviewed at least every five years. A review should include a fresh site inspection, because buildings rarely age exactly as forecast, and contributions can then be adjusted up or down, much like a budget review.",
          "We recommend preparing a new plan every two to three years so the figures stay close to real conditions and costs.",
        ],
      },
      {
        id: "benefits",
        heading: "What a good plan gives owners",
        blocks: [
          {
            list: [
              "Independent advice: we are not affiliated with maintenance companies and do not rely on referrals to them",
              "A lower risk of special levies, because the money is collected gradually",
              "A fairer, user-pays system: owners contribute for the wear that happens while they own their lot",
              `Peace of mind: we hold ${facts.indemnity} in professional indemnity insurance`,
              "A better-maintained building, which helps protect property values",
            ],
          },
        ],
      },
      {
        id: "what-it-is-not",
        heading: "What a reserve fund plan is not",
        blocks: [
          "A reserve fund plan is a forecast for budgeting. It is not:",
          {
            list: [
              "A detailed quotation for building work",
              "A precise cost estimate for a particular repair",
              "A dilapidation report",
              "A maintenance schedule",
              "Building, structural or safety advice",
            ],
          },
          `For safety advice, see our <a href="${paths.whs}">work health and safety reports</a>.`,
        ],
      },
      {
        id: "risk-management",
        heading: "Risk management",
        blocks: [
          "Without enough money in reserve, a strata company can struggle to carry out repairs it is legally obliged to make. Courts have held owners and strata companies responsible for the cost of failing to repair and maintain common property, and the outcome can be far more expensive than the repair itself. A realistic plan, adopted and funded, is one of the most practical ways to manage that risk.",
        ],
      },
      {
        id: "further-services",
        heading: "Further services",
        blocks: [
          `We also prepare <a href="${paths.biv}">building insurance valuations</a>, <a href="${paths.asb}">asbestos registers and management plans</a> and <a href="${paths.whs}">work health and safety reports</a>, including common law duty of care reports.`,
        ],
      },
      turnaroundSection("Reserve fund plans"),
    ],
    faqTitle: "Reserve Fund Plan FAQs | Reserve Fund Plans",
    faqH1: "Reserve Fund Plan FAQs",
    faqDescription:
      "Answers to common questions about WA 10-year reserve fund plans: who needs one, how often to review it, and how it affects strata levies.",
    faqs: [
      {
        q: "What is a reserve fund plan?",
        a: [
          "A plan that sets out how a strata company will raise enough money to meet its duty to repair and maintain common property. The annual amounts over the 10 years vary from scheme to scheme. Newer schemes usually need less than older ones with more repair work coming due.",
        ],
      },
      {
        q: "Does a strata company have to get a reserve fund plan?",
        a: [
          "In Western Australia, a strata company with 10 or more lots, or with a replacement value of $5 million or more, must have a reserve fund and a 10-year plan, and must review the plan at least every five years. Smaller schemes can choose to have one.",
        ],
      },
      {
        q: "What is the benefit of a reserve fund plan?",
        a: [
          "A good plan keeps the scheme well maintained, which helps protect property values. We aim to keep contributions as low as possible while still sufficient, so money does not sit idle in the reserve account, special levies are avoided and owners do not pay more than they need to. Our plans are prepared using Australian designed and owned software.",
        ],
      },
      {
        q: "Does a reserve fund plan increase what owners pay each year?",
        a: [
          "There is no fixed answer, because every plan reflects the needs of its scheme. Sometimes we recommend collecting less because money is sitting idle in the reserve account. Other times we recommend collecting more because current contributions will not cover the projected repair, maintenance and renewal costs.",
        ],
      },
      {
        q: "Can a strata company vary a reserve fund plan?",
        a: [
          "Yes. The reserve fund belongs to the strata company, and it can use the money as it needs to, provided it still meets its legal duty to repair and maintain the common property.",
        ],
      },
      {
        q: "How often should a reserve fund plan be reviewed?",
        a: ["The Act requires a review at least every five years. We recommend preparing a new plan every two to three years so it stays accurate."],
      },
    ],
  },

  /* ───────────────────────── Building Insurance Valuations ───────────────────────── */
  {
    key: "biv",
    path: paths.biv,
    faqPath: paths.faqBiv,
    name: "Building Insurance Valuations",
    h1: "Building Insurance Valuations for Strata and Community Schemes",
    code: "02",
    title: "Strata Building Insurance Valuations WA | Reserve Fund Plans",
    description:
      "Building insurance valuations and certificates of value for WA strata and community schemes, assessing full replacement cost. Request a quote.",
    lede:
      "A building insurance valuation is a valuer's assessment of what it would cost to fully rebuild your strata or community scheme today. We issue certificates of value for the replacement and reinstatement cost of the buildings and other improvements.",
    summary: "Certificates of value for the full replacement cost of strata and community buildings.",
    deliverables: [
      "A site inspection by a valuer",
      "Certificates of value for the replacement and reinstatement cost",
      "An itemised assessment, including demolition, fees, escalation and GST",
      "Photographs of the improvements and surroundings",
    ],
    sections: [
      {
        id: "why-you-need-one",
        heading: "Why do I need an insurance valuation?",
        blocks: [
          "WA strata companies must insure their buildings and other insurable assets for replacement value. A current valuation is the most reliable way to know what that figure is.",
          "We recommend a valuation by a valuer at least every five years, and preferably every two to three years. For larger commercial and industrial properties, we recommend an annual valuation, so the sum insured keeps pace with real rebuilding costs.",
        ],
      },
      {
        id: "experience",
        heading: "Experience",
        blocks: [
          "Our chief valuer has over 30 years' experience, including giving expert evidence in many courts, and has carried out due diligence on everything from major property transactions to small suburban homes. We recommend that a valuer carries out your building insurance valuation.",
        ],
      },
      {
        id: "professional-indemnity",
        heading: "Professional indemnity insurance",
        blocks: [`We are members of a Professional Standards Councils scheme and hold ${facts.indemnity} in professional indemnity insurance.`],
      },
      {
        id: "revaluation-frequency",
        heading: "How often should you revalue?",
        blocks: [
          "Good strata and property managers obtain a valuation at least every three years, and some every year. We consider an annual inspection by a valuer best practice, because building costs move with the market and can rise well above inflation. In 2004, for example, the cost of concrete and steel rose by over 25%.",
          "Applying CPI or an arbitrary percentage to last year's figure, without knowledge of construction cost movements, is no substitute for a valuation.",
        ],
      },
      {
        id: "under-insurance",
        heading: "The risk of under-insurance",
        blocks: [
          "If a property is under-insured, the insurer may apply a co-insurance or averaging clause and pay only part of the true replacement cost. The owners may have to cover the shortfall, and a strata manager who failed to obtain a current valuation may be found negligent.",
        ],
      },
      {
        id: "ordering-a-valuation",
        heading: "Ordering a building insurance valuation",
        blocks: [
          "Once we receive your instructions, the valuer:",
          {
            list: [
              "Inspects the property and assesses the materials and quantities needed to fully rebuild it and its ancillary improvements",
              "Photographs the improvements and surroundings",
              "Estimates the replacement cost, including the items required by legislation and good valuation practice",
              "Provides the certificates of value",
            ],
          },
          "You will usually receive a bound copy, an unbound copy for photocopying, and a PDF by email.",
        ],
      },
      {
        id: "what-is-included",
        heading: "What the valuation includes",
        blocks: [
          "Our reports follow good valuation practice and itemise the components that make up the replacement cost, including:",
          {
            list: [
              "Demolition and removal of debris",
              "Professional and council fees",
              "Construction cost escalation over the insurance period and the rebuilding period",
              "GST",
              "Allowances for location, construction materials, finishes and heritage items where relevant",
            ],
          },
        ],
      },
      {
        id: "further-services",
        heading: "Further services",
        blocks: [
          `We also prepare <a href="${paths.sfp}">10-year reserve fund plans</a>, <a href="${paths.asb}">asbestos registers and management plans</a> and <a href="${paths.whs}">work health and safety reports</a>, including common law duty of care reports.`,
        ],
      },
      turnaroundSection("Building insurance valuations"),
    ],
    faqTitle: "Building Insurance Valuation FAQs | Reserve Fund Plans",
    faqH1: "Building Insurance Valuation FAQs",
    faqDescription:
      "Common questions about strata building insurance valuations in WA: why owners need one, what it includes and how often to review it.",
    faqs: [
      {
        q: "What is a building insurance valuation?",
        a: [
          "A valuer's professional assessment of the cost to replace all the improvements in a strata scheme, community scheme or standalone property. It allows for construction cost escalation over the insurance period, the time needed for documentation and rebuilding, professional fees, demolition and debris removal, GST and other factors.",
        ],
      },
      {
        q: "Do the owners need a building insurance valuation?",
        a: [
          `A WA strata company must insure its buildings for replacement value. A valuation is the prudent way to establish that figure and meet the obligation. For added assurance, we hold ${facts.indemnity} in professional indemnity insurance.`,
        ],
      },
      {
        q: "What is the benefit of a building insurance valuation?",
        a: [
          "Regular valuations keep the sum insured in line with the real cost of rebuilding after total destruction or partial damage. For large strata and community schemes, we recommend an annual valuation rather than accepting arbitrary increases from insurers or brokers that can exceed actual construction cost movements.",
        ],
      },
      {
        q: "Does a valuation increase what owners pay each year?",
        a: ["No. A current valuation helps owners confirm they are paying a premium based on an accurate, up-to-date recommended sum insured."],
      },
      {
        q: "Can a strata company or the owners vary a building insurance valuation?",
        a: [
          "The strata company should insure the building for at least the recommended sum insured in its latest valuation. If the strata company or owner and the insurer agree, the property can be insured for more than that amount.",
        ],
      },
      {
        q: "How often should a building insurance valuation be reviewed?",
        a: [
          "Our suggested minimum frequency depends on the type of property:",
          {
            head: ["Property type", "Suggested minimum"],
            table: [
              ["Lot 1 in most community schemes", "Every 5 years"],
              ["Lot 1 with major improvements (sheds, cabana, pool, recreation or community hall, barbecue areas)", "Every 2 to 3 years"],
              ["Three-level walk-ups (12 and 18 packs)", "Every 2 to 3 years"],
              ["Villas, townhouses and similar", "Every 2 to 3 years"],
              ["Schemes of six levels or more", "Every year"],
              ["Older industrial office warehouses", "Every 1 to 2 years"],
              ["Newer industrial office warehouses", "Every 2 to 3 years"],
              ["Large commercial office buildings", "Every 1 to 2 years"],
              ["Small commercial office buildings", "Every 2 to 3 years"],
            ],
          },
        ],
      },
    ],
  },

  /* ───────────────────────── WHS Reports ───────────────────────── */
  {
    key: "whs",
    path: paths.whs,
    faqPath: paths.faqWhs,
    name: "Work Health and Safety Reports",
    h1: "Work Health and Safety Reports for Strata Properties",
    code: "03",
    title: "Strata WHS Safety Reports WA | Reserve Fund Plans",
    description:
      "Practical WHS safety reports for WA strata and commercial properties: hazards identified, each risk assessed and control measures recommended. Request a quote.",
    lede:
      "Our safety reports, also called WHS, OHS, duty of care or hazard reports, identify the hazards on your property and the risk they pose to people and property, with practical recommendations for what to do about each one.",
    summary: "Hazard identification and individual risk assessments, with practical control measures.",
    deliverables: [
      "A physical inspection of the property",
      "An individual risk assessment for each hazard, so you can prioritise",
      "Practical, flexible control measures",
      "Colour photographs, locations and descriptions of each hazard",
    ],
    sections: [
      {
        id: "do-i-need-one",
        heading: "Do I need a safety report?",
        blocks: [
          "A strata company should know the likely hazards and risks on its property that it must control. That duty comes from the common law duty of care, reflected in the Civil Liability Act 2002 (WA), and, where the strata company is a person conducting a business or undertaking, from the Work Health and Safety Act 2020 (WA).",
        ],
      },
      {
        id: "safety-obligations",
        heading: "Safety obligations",
        blocks: [
          "A property should be free of risks to anyone's health and safety. Our inspections take a practical, sensible approach to recommending treatments or control measures for each hazard and its associated risk.",
        ],
      },
      {
        id: "legislative-obligations",
        heading: "Legislative obligations",
        blocks: [
          "The report addresses the general obligations under the Civil Liability Act 2002 (WA), work health and safety legislation where it applies, and the common law duty of care.",
          {
            note: "Western Australia's Work Health and Safety Act 2020 and Work Health and Safety (General) Regulations 2022 commenced on 31 March 2022, replacing the earlier occupational safety and health laws for most workplaces.",
          },
        ],
      },
      {
        id: "types-of-hazards",
        heading: "Types of hazards",
        blocks: ["Typical hazards fall into broad categories, including:", { list: ["Trip hazards", "Fall hazards", "Electrical hazards", "Protrusions", "Slip hazards", "Crush hazards"] }],
      },
      {
        id: "risk-assessment",
        heading: "Proper risk assessment",
        blocks: [
          "Each hazard we identify receives its own risk assessment, so you can prioritise your resources.",
          "The report is not a compliance check requiring every structure to meet current National Construction Code standards. It focuses on genuine hazards to people and property, and our recommendations are practical and common sense.",
        ],
      },
      {
        id: "ordering-a-report",
        heading: "Ordering a safety report",
        blocks: [
          "Once we receive your instructions, we:",
          {
            list: [
              "Physically inspect the property",
              "Recommend flexible control measures to eliminate or minimise each hazard",
              "Prioritise the risks through individual assessments, so owners can decide what to fix first",
              "Visually inspect the electrical board if access is available on the day (we do not employ electrical engineers)",
              "Provide colour photographs, locations and descriptions of the hazards, with a thorough written explanation",
            ],
          },
        ],
      },
      {
        id: "further-services",
        heading: "Further services",
        blocks: [
          `We also prepare <a href="${paths.biv}">building insurance valuations</a>, <a href="${paths.asb}">asbestos registers and management plans</a> and <a href="${paths.sfp}">10-year reserve fund plans</a>.`,
        ],
      },
      turnaroundSection("Safety reports"),
    ],
    faqTitle: "Work Health and Safety FAQs | Reserve Fund Plans",
    faqH1: "Work Health and Safety Report FAQs",
    faqDescription:
      "Questions about strata safety inspections and WHS reports in WA: what they cover, whether owners need one and how often to re-inspect.",
    faqs: [
      {
        q: "What is a safety inspection?",
        a: [
          "A safety inspection identifies likely hazards and the risk of harm to people or damage to property, under both the common law duty of care and legislation. The aim is a property free of risks to health and safety, achieved through practical, sensible treatment of hazards. It is not a compliance report requiring every structure to meet current building standards.",
        ],
      },
      {
        q: "Do the owners and strata company need a safety inspection?",
        a: [
          "The strata company or property owner has a common law duty of care to keep the property free of risks to anyone's health and safety, reflected in the Civil Liability Act 2002 (WA). A professional safety report helps show that reasonable steps and proper care were taken.",
          "Under work health and safety laws, a strata company for a purely residential scheme is generally not treated as a person conducting a business or undertaking (PCBU) unless it engages a worker as an employee. Its common law duty of care still applies.",
        ],
      },
      {
        q: "What is the benefit of a safety inspection?",
        a: [
          "A professional report helps you identify and fix hazards, so the property is safe for residents, their children and family, and visitors. It also reduces legal exposure by showing reasonable care in managing the property. Insurers may decline to insure a property with significant safety hazards.",
        ],
      },
      {
        q: "Does a safety inspection increase what owners pay each year?",
        a: [
          "Sometimes, where significant hazards need attention. Proper management includes fixing risks, and risks and their costs usually arise from neglected maintenance. Insurers may also refuse cover for properties with significant hazards.",
        ],
      },
      {
        q: "Can the owners or strata company vary a safety report?",
        a: [
          "Yes. You can use a different control measure from the one we recommend, provided the hazard is still dealt with appropriately. For example, instead of grinding down an exposed trip hazard, the owners might decide it is reasonably practicable to fence off the area, or to apply high-visibility paint and warning signs as an interim measure.",
        ],
      },
      {
        q: "How often should a safety inspection be reviewed?",
        a: [
          "It depends on the property. Larger strata or community schemes, especially where hazards can change quickly, should ideally be re-inspected every year. A modern small villa complex with limited common property may suit a two to three year cycle. Commercial or retail properties with many visitors may need inspections once or twice a year.",
        ],
      },
    ],
  },

  /* ───────────────────────── Asbestos Reports ───────────────────────── */
  {
    key: "asb",
    path: paths.asb,
    faqPath: paths.faqAsb,
    name: "Asbestos Reports",
    h1: "Asbestos Registers and Management Plans",
    code: "04",
    title: "Strata Asbestos Register & Management Plan WA | Reserve Fund Plans",
    description:
      "Asbestos reports for WA strata and commercial properties: an asbestos register and asbestos management plan from a visual inspection. Request a quote.",
    lede:
      "Our asbestos report combines an asbestos register, which records where asbestos is or is assumed to be, with an asbestos management plan, which sets out how each item will be controlled and by when.",
    summary: "An asbestos register and management plan in one report, from a visual inspection.",
    deliverables: [
      "A visual inspection of the property",
      "An asbestos register with a risk assessment for each item",
      "An asbestos management plan with control measures and timeframes",
      "Colour photographs, locations and descriptions",
    ],
    sections: [
      {
        id: "why-you-need-one",
        heading: "Why do I need an asbestos report?",
        blocks: [
          "In Western Australia, a workplace in a building constructed before 31 December 2003 must have an asbestos register unless no asbestos has been identified there. This can apply to commercial, retail, industrial and mixed-use strata schemes where the common property is a workplace.",
          "Where asbestos has been identified or is assumed to be present, an asbestos management plan is also required, and it must be reviewed at least every five years, or sooner if conditions or control measures change.",
        ],
      },
      {
        id: "asbestos-register",
        heading: "The asbestos register",
        blocks: [
          "A register records where asbestos or asbestos-containing material (ACM) is located on a property. Our registers record, for each item:",
          {
            list: [
              "A risk assessment",
              "Control measures, following the hierarchy of control",
              "Whether the material is friable (can be crumbled by hand pressure) or non-friable",
              "Its size and extent, and the type of product",
              "Its exact location and how accessible it is",
              "Its condition and the risk of contamination",
            ],
          },
        ],
      },
      {
        id: "asbestos-management-plan",
        heading: "The asbestos management plan",
        blocks: [
          "The management plan sets out how each item is to be handled, for example by applying controls, or by leaving it in place and monitoring it. It records:",
          {
            list: [
              "Start and completion dates for proposed works",
              "Who is responsible for the control measures",
              "The recommended controls",
              "The size, extent, location and description of each item",
            ],
          },
        ],
      },
      {
        id: "assumed-asbestos",
        heading: "Assumed asbestos",
        blocks: [
          "Under WHS regulations, a competent person who reasonably believes a material contains asbestos may assume that it does. Assumed asbestos is then treated as identified at the workplace.",
        ],
      },
      {
        id: "testing",
        heading: "Testing",
        blocks: [
          "Asbestos can be identified by having a sample analysed, but there is no general legal requirement to take samples, and the guiding principle is that asbestos should not be disturbed. Cutting, gouging or breaking material to take a sample increases the risk of releasing fibres, and sealing the damaged area afterwards with PVA or paint does not remove that risk. We do not recommend disturbing asbestos for sampling.",
          "Where work is planned on or near identified asbestos, our trained inspectors can take samples in line with the relevant codes of practice, for testing by a NATA-accredited laboratory in Western Australia.",
        ],
      },
      {
        id: "prudent-to-obtain",
        heading: "Why a report is prudent even where it is not required",
        blocks: [
          "Whatever the register requirements, owners remain liable for breaching their common law duty of care, also called occupiers' liability. Owners must ensure that no one is harmed by asbestos on their property. An asbestos report shows that the strata company or owner took reasonable steps to identify the hazard.",
        ],
      },
      {
        id: "penalties",
        heading: "Penalties",
        blocks: [
          "Significant penalties can apply under WHS laws for failing to comply with asbestos register and management plan requirements, particularly where someone is harmed.",
        ],
      },
      {
        id: "ordering-a-report",
        heading: "Ordering an asbestos report",
        blocks: [
          "Once we receive your instructions, we:",
          {
            list: [
              "Inspect the property (visual inspection only)",
              "Take a practical, flexible approach to controlling hazards",
              "Rank the risks through a risk assessment, so owners can prioritise",
              "Provide colour photographs, locations and descriptions, with a detailed explanation",
            ],
          },
        ],
      },
      {
        id: "further-services",
        heading: "Further services",
        blocks: [
          `We also prepare <a href="${paths.whs}">work health and safety reports</a>, including common law duty of care reports, <a href="${paths.sfp}">reserve fund plans</a> (also called maintenance plans) and <a href="${paths.biv}">building insurance valuations</a>.`,
        ],
      },
      turnaroundSection("Asbestos reports"),
    ],
    faqTitle: "Asbestos Report FAQs | Reserve Fund Plans",
    faqH1: "Asbestos Report FAQs",
    faqDescription:
      "Questions about asbestos registers and management plans for WA strata properties: who needs one, the benefits and how often to review.",
    faqs: [
      {
        q: "What is an asbestos report?",
        a: [
          "An asbestos report combines an asbestos register, which work health and safety laws require for many workplaces, with an asbestos management plan, which sets out control measures and deadlines for dealing with identified asbestos or asbestos-containing material.",
        ],
      },
      {
        q: "Do the owners need an asbestos report?",
        a: [
          "Many purely residential strata schemes are not required to have a register and plan under WHS laws, particularly if no workers are engaged. Those exemptions do not protect owners from claims for breaching their common law duty of care. Asbestos is a known hazard, so owners must take steps to prevent harm, and a prudent owner will obtain a report.",
        ],
      },
      {
        q: "What is the benefit of an asbestos report?",
        a: [
          "It helps owners meet legal requirements where they apply and fulfil the common law duty to identify hazards. It also protects contractors and the instructing owner or agent: contractors who know which items contain asbestos can use protective equipment, contain and collect dust, and dispose of material correctly.",
        ],
      },
      {
        q: "Does an asbestos report increase what owners pay each year?",
        a: [
          "No, and it can save money. Where a register is required and several contractors attend a property, one register for the property is more economical than each contractor including the cost of their own in their quote.",
        ],
      },
      {
        q: "Can the owners vary an asbestos report?",
        a: [
          "Owners generally cannot change the register themselves. If an item assumed to contain asbestos is sampled and a NATA-accredited laboratory finds it asbestos-free, the register entry can be updated and the laboratory results attached. Owners can vary the management plan if appropriate measures are taken. The plan covers remediation or removal, who is responsible and when the work must happen.",
        ],
      },
      {
        q: "How often should an asbestos report be reviewed?",
        a: [
          "Regularly, to confirm that items containing, or assumed to contain, asbestos have not been damaged. Where a management plan is required, it must be reviewed at least every five years, or sooner if conditions change.",
        ],
      },
    ],
  },
];

export const serviceBy = (k: ServiceKey) => services.find((s) => s.key === k)!;
