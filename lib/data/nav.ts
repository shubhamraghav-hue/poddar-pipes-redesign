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
  href: string;
  megaMenu?: MegaMenuColumn[];
}

export const navItems: NavItem[] = [
  { key: "home", href: "/" },
  {
    key: "about",
    href: "/about",
    megaMenu: [
      {
        heading: "navCompany",
        links: [
          { label: "navCompanyProfile", href: "/about#story" },
          { label: "navVisionMission", href: "/about#mission" },
          { label: "navLeadershipTeam", href: "/about#leadership" },
          { label: "navMilestones", href: "/about#timeline" },
          { label: "navCertifications", href: "/about#certifications" },
        ],
      },
      {
        heading: "navOperations",
        links: [
          { label: "navManufacturingExcellence", href: "/manufacturing" },
          { label: "navQualityAssurance", href: "/quality" },
          { label: "navSustainabilityCSR", href: "/sustainability" },
          { label: "navCareers", href: "/careers" },
        ],
      },
    ],
  },
  {
    key: "products",
    href: "/products",
    megaMenu: [
      {
        heading: "navPipingSystems",
        links: [
          { label: "navUpvc", href: "/products?category=upvc-pipes" },
          { label: "navCpvc", href: "/products?category=cpvc-pipes" },
          { label: "navSwr", href: "/products?category=swr-pipes" },
        ],
      },
      {
        heading: "navStorageDrainage",
        links: [
          { label: "navTanks", href: "/products?category=tanks" },
          { label: "navUgd", href: "/products?category=ugd-pipes" },
        ],
      },
      {
        heading: "navApplicationSystems",
        links: [
          { label: "navAgriculture", href: "/products?category=agricultural-pipes" },
          { label: "navViewFullCatalog", href: "/products" },
        ],
      },
    ],
  },
  { key: "industries", href: "/industries" },
  {
    key: "resources",
    href: "/resources",
    megaMenu: [
      {
        heading: "navResources",
        links: [
          { label: "navProductCatalogues", href: "/resources#catalogues" },
          { label: "navTechnicalDataSheets", href: "/resources#datasheets" },
          { label: "navBlogsArticles", href: "/resources#blogs" },
          { label: "navFaqs", href: "/resources#faqs" },
        ],
      },
      {
        heading: "navToolsGuides",
        links: [
          { label: "navPipeCementCalculator", href: "/tools/calculator" },
          { label: "navFindPlumber", href: "/tools/find-a-plumber" },
          { label: "navInstallationGuide", href: "/resources/installation" },
        ],
      },
    ],
  },
  { key: "contact", href: "/contact" },
];
