export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  links: MegaMenuLink[];
}

export interface NavItem {
  key: string;
  /**
   * Omitted for a pure menu label: "Resources" opens its dropdown but is not
   * a page (client decision 2026-10-08 — /resources was removed and now
   * redirects to /articles).
   */
  href?: string;
  megaMenu?: MegaMenuColumn[];
}

export const navItems: NavItem[] = [
  { key: "home", href: "/" },
  {
    key: "about",
    href: "/about",
    // megaMenu: [
    //   {
    //     heading: "navCompany",
    //     links: [
    //       { label: "navCompanyProfile", href: "/about#story" },
    //       { label: "navVisionMission", href: "/about#mission" },
    //       { label: "navLeadershipTeam", href: "/about#leadership" },
    //       { label: "navMilestones", href: "/about#timeline" },
    //       { label: "navCertifications", href: "/about#certifications" },
    //     ],
    //   },
    //   {
    //     heading: "navOperations",
    //     links: [
    //       { label: "navManufacturingExcellence", href: "/manufacturing" },
    //       { label: "navQualityAssurance", href: "/quality" },
    //       { label: "navSustainabilityCSR", href: "/sustainability" },
    //       { label: "navCareers", href: "/careers" },
    //     ],
    //   },
    // ],
  },
  {
    key: "products",
    href: "/products",
    megaMenu: [
      {
        heading: "navPipingSystems",
        links: [
          { label: "navUpvc", href: "/products?category=upvc-pipes#range" },
          { label: "navCpvc", href: "/products?category=cpvc-pipes#range" },
          { label: "navSwr", href: "/products?category=swr-pipes#range" },
        ],
      },
      {
        heading: "navStorageDrainage",
        links: [
          { label: "navTanks", href: "/products?category=tanks#range" },
          { label: "navUgd", href: "/products?category=ugd-pipes#range" },
        ],
      },
      {
        heading: "navApplicationSystems",
        links: [
          { label: "navAgriculture", href: "/products?category=agricultural-pipes#range" },
          // { label: "navViewFullCatalog", href: "/products" },
        ],
      },
    ],
  },
  // { key: "industries", href: "/industries" },
  // "Resources" dropdown replaced by a plain News & Media link, and the
  // Pipe & Cement Calculator dropped from the header (client, 2026-10-14).
  // The calculator page stays live, linked from the footer. The old item:
  //   { key: "resources", megaMenu: [
  //     { heading: "navResources", links: [{ label: "navBlogsArticles", href: "/articles" }] },
  //     { heading: "navToolsGuides", links: [{ label: "navPipeCementCalculator", href: "/tools/calculator" }] },
  //   ] },
  { key: "navBlogsArticles", href: "/articles" },
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/faq" },
];
