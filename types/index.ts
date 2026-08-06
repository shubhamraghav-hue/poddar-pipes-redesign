import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export interface SolutionCategory {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export type ProductCategory =
  | "upvc-pipes"
  | "cpvc-pipes"
  | "swr-pipes"
  | "tanks"
  | "ugd-pipes"
  | "agricultural-pipes";

export interface FAQItemInline {
  question: string;
  answer: string;
}
export type ProductIcon =
  | "pipette"
  | "flame"
  | "waves"
  | "cylinder"
  | "network"
  | "sprout";
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  specs: { label: string; value: string }[];
  sizes: string[];
  applications: string[];
  materials: string[];
  installationGuide: string[];
  faqs: FAQItemInline[];
  icon: ProductIcon;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Certification {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Office {
  id: string;
  city: string;
  country: string;
  type: string;
  address: string;
  phone: string;
  email: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image?: string;
}


export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
  /** Real file under /public/downloads — omit if no real asset exists yet. */
  fileUrl?: string;
}

export interface BentoFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  size: "sm" | "md" | "lg";
}

export interface Plumber {
  id: string;
  name: string;
  phone: string;
  pincode: string;
}
