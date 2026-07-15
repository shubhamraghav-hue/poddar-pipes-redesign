import type { BlogPost, JobOpening, DownloadItem } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "choosing-pipe-material-for-borewell",
    title: "How to Choose the Right Pipe Material for Your Borewell",
    excerpt: "A practical comparison of uPVC and GI column pipe for submersible pump installations.",
    category: "Buying Guides",
    readTime: "6 min read",
    date: "2026-05-12",
    image:
      "https://images.unsplash.com/photo-1737574990049-264694ce17a0?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "b2",
    slug: "drip-irrigation-water-savings",
    title: "How Much Water Can Drip Irrigation Actually Save?",
    excerpt: "Field data on water use reduction when switching from flood irrigation to drip systems.",
    category: "Agriculture",
    readTime: "5 min read",
    date: "2026-04-20",
    image:
      "https://images.pexels.com/photos/10606633/pexels-photo-10606633.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  {
    id: "b3",
    slug: "cpvc-vs-upvc-plumbing",
    title: "CPVC vs uPVC: Choosing the Right Pipe for Your Plumbing",
    excerpt: "Understanding temperature ratings, applications, and cost differences between the two.",
    category: "Plumbing",
    readTime: "4 min read",
    date: "2026-03-08",
    image:
      "https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
  {
    id: "b4",
    slug: "pushfit-vs-solfit-ugd-installation",
    title: "Pushfit vs Solfit: Choosing the Right UGD Joint for Your Site",
    excerpt: "Key differences and common mistakes to avoid when jointing underground drainage pipe on site.",
    category: "Technical",
    readTime: "7 min read",
    date: "2026-02-15",
    image:
      "https://images.pexels.com/photos/37627673/pexels-photo-37627673.jpeg?auto=compress&cs=tinysrgb&w=1400",
  },
];

export const jobOpenings: JobOpening[] = [
  { id: "j1", title: "Production Engineer — Extrusion", department: "Manufacturing", location: "Plant Location", type: "Full-time" },
  { id: "j2", title: "Quality Assurance Executive", department: "Quality", location: "Plant Location", type: "Full-time" },
  { id: "j3", title: "Regional Sales Manager", department: "Sales & Marketing", location: "Multiple Locations", type: "Full-time" },
  { id: "j4", title: "R&D Engineer — Polymer Compounds", department: "Research & Development", location: "Plant Location", type: "Full-time" },
];

// Real catalogue PDFs (from Poddar Pipes) served from /public/downloads.
// CPVC's source file is a 132MB Illustrator export — too large to ship as a
// web download as-is; needs a proper compressed export before it can join
// this list (see CONTENT_TODOS.md).
export const downloads: DownloadItem[] = [
  { id: "dl1", title: "uPVC Gold Catalogue", category: "Catalogue", fileType: "PDF", fileSize: "1.1 MB", fileUrl: "/downloads/poddar-upvc-gold-catalogue.pdf" },
  { id: "dl2", title: "SWR Gold Catalogue", category: "Catalogue", fileType: "PDF", fileSize: "908 KB", fileUrl: "/downloads/poddar-swr-gold-catalogue.pdf" },
  { id: "dl3", title: "UGD Gold Catalogue", category: "Catalogue", fileType: "PDF", fileSize: "1.2 MB", fileUrl: "/downloads/poddar-ugd-gold-catalogue.pdf" },
  { id: "dl4", title: "Agri Gold Catalogue", category: "Catalogue", fileType: "PDF", fileSize: "652 KB", fileUrl: "/downloads/poddar-agri-gold-catalogue.pdf" },
  { id: "dl5", title: "Water Tanks Catalogue", category: "Catalogue", fileType: "PDF", fileSize: "344 KB", fileUrl: "/downloads/poddar-water-tanks-catalogue.pdf" },
];
