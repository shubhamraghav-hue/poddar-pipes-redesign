import type { PressArticle } from "@/types";

// Press coverage of the ₹758 crore Vemgal (Kolar district, Karnataka)
// expansion, as shown on the News & Media page (Figma node 1653:9258).
//
// The six cards, their order (row by row) and their headlines/summaries are
// the mock's own copy — short original paraphrases, not reproduced text. The
// links are the verified source URLs; open each one for the original report.
//
// Three earlier entries are not in the mock and were dropped on request:
// MB Patil's X post (x.com/MBPatil/status/1950134790595998139), Construction
// Week Online (constructionweekonline.in/business/karnataka-poddar-plumb) and
// The Manufacturing Frontier's Vijayapura story
// (themanufacturingfrontier.com/poddar-plumbing-to-set-up-a-major-facility-in-the-vemgal-industrial-area-of-karnataka/).
export const pressArticles: PressArticle[] = [
  {
    id: "the-hindu",
    date: "July 2025",
    outlet: "The Hindu",
    headline: "Karnataka project targets ₹3,000 crore in tax revenue",
    summary:
      "Poddar Plumbing’s Karnataka project is expected to generate around ₹3,000 crore in tax revenue over ten years, supporting the state’s economy through expanded manufacturing.",
    sourceUrl:
      "https://www.thehindu.com/news/national/karnataka/poddar-plumbing-to-generate-tax-revenues-of-3000-crore-for-karnataka-government-in-next-10-years/article69870677.ece",
  },
  {
    id: "deccan-herald",
    date: "July 2025",
    outlet: "Deccan Herald",
    headline: "₹758 crore investment planned for new Vemagal factory",
    summary:
      "Poddar Plumbing plans a ₹758 crore pipe factory in Vemagal, Karnataka, with production expected to begin by August 2026.",
    sourceUrl:
      "https://www.deccanherald.com/business/poddar-plumbing-to-invest-rs-758-cr-on-new-pipe-factory-in-vemagal-3654881",
  },
  {
    id: "et-hrworld",
    date: "July 2025",
    outlet: "ET HRWorld",
    headline: "Karnataka expansion expected to create 12,000 new jobs",
    summary:
      "The proposed Karnataka expansion is expected to create 3,000 direct and 9,000 indirect jobs, strengthening local employment through a new manufacturing facility.",
    sourceUrl:
      "https://hr.economictimes.indiatimes.com/news/industry/poddar-plumbings-karnataka-expansion-3000-direct-jobs-and-rs-1500-crore-turnover/123002707",
  },
  {
    id: "businessline",
    date: "July 2025",
    outlet: "BusinessLine",
    headline: "Expanded Karnataka investment pairs manufacturing growth with job creation",
    summary:
      "Poddar Plumbing plans to increase its Karnataka investment to ₹758 crore, with the expansion expected to create 12,000 jobs and support manufacturing growth.",
    sourceUrl:
      "https://www.thehindubusinessline.com/companies/poddar-plumbing-scales-up-investment-in-karnataka-plans-to-invest-758-cr-create-12000-jobs/article69869234.ece",
  },
  {
    id: "tube-pipe-india",
    date: "July 2025",
    outlet: "Tube & Pipe India",
    headline: "Kolar plant investment rises from ₹492 to ₹758 crore",
    summary:
      "Poddar Plumbing has increased its Kolar plant investment from ₹492 crore to ₹758 crore, supporting a new 33 acre production facility in Karnataka.",
    sourceUrl: "https://tubepipeindia.com/poddar-plumbing-scales-up/",
  },
  {
    id: "first-construction-council",
    date: "July 2025",
    outlet: "First Construction Council",
    headline: "₹758 crore project to support Karnataka’s industrial growth",
    summary:
      "The expanded Karnataka investment will support a new Vemgal manufacturing facility, with plans expected to create 12,000 jobs and strengthen the state’s piping industry.",
    sourceUrl: "https://firstconstructioncouncil.com/article/912316",
  },
];
