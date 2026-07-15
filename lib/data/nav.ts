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
        heading: "Company",
        links: [
          { label: "Company Profile & History", href: "/about#story" },
          { label: "Vision & Mission", href: "/about#mission" },
          { label: "Leadership Team", href: "/about#leadership" },
          { label: "Milestones", href: "/about#timeline" },
          { label: "Certifications", href: "/about#certifications" },
        ],
      },
      {
        heading: "Operations",
        links: [
          { label: "Manufacturing Excellence", href: "/manufacturing" },
          { label: "Quality Assurance", href: "/quality" },
          { label: "Sustainability & CSR", href: "/sustainability" },
          { label: "Careers", href: "/careers" },
        ],
      },
    ],
  },
  {
    key: "products",
    href: "/products",
    megaMenu: [
      {
        heading: "Piping Systems",
        links: [
          { label: "uPVC", href: "/products?category=upvc-pipes" },
          { label: "CPVC", href: "/products?category=cpvc-pipes" },
          { label: "SWR", href: "/products?category=swr-pipes" },
        ],
      },
      {
        heading: "Storage & Drainage",
        links: [
          { label: "TANKS", href: "/products?category=tanks" },
          { label: "UGD", href: "/products?category=ugd-pipes" },
        ],
      },
      {
        heading: "Application Systems",
        links: [
          { label: "Agriculture", href: "/products?category=agricultural-pipes" },
          { label: "View Full Catalog", href: "/products" },
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
        heading: "Resources",
        links: [
          { label: "Product Catalogues", href: "/resources#catalogues" },
          { label: "Technical Data Sheets", href: "/resources#datasheets" },
          { label: "Blogs & Articles", href: "/resources#blogs" },
          { label: "FAQs", href: "/resources#faqs" },
        ],
      },
      {
        heading: "Tools & Guides",
        links: [
          { label: "Pipe & Cement Calculator", href: "/tools/calculator" },
          { label: "Installation Guide", href: "/resources/installation" },
        ],
      },
    ],
  },
  { key: "contact", href: "/contact" },
];
