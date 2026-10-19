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
          { label: "navUpvc", href: "/products/upvc-pipes#range" },
          { label: "navCpvc", href: "/products/cpvc-pipes#range" },
          { label: "navSwr", href: "/products/swr-pipes#range" },
        ],
      },
      {
        heading: "navStorageDrainage",
        links: [
          // UGD before Tank — Figma "header products hover" (1979:33062).
          { label: "navUgd", href: "/products/ugd-pipes#range" },
          { label: "navTanks", href: "/products/tanks#range" },
        ],
      },
      {
        heading: "navApplicationSystems",
        links: [
          { label: "navAgriculture", href: "/products/agricultural-pipes#range" },
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
  // Header label is "NEWS" (Figma header 1979:32592); the footer keeps "News & Media".
  { key: "navNews", href: "/articles" },
  { key: "contact", href: "/contact" },
  { key: "faq", href: "/faq" },
];
