// lib/data/industries.ts
import {
  Home,
  Building2,
  Factory,
  Sprout,
  Landmark,
  Droplets,
  Waves,
  HardHat,
  ShieldCheck,
  Hotel,
} from "lucide-react";

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: typeof Home;
  // TODO: replace with real Poddar Pipes site/installation photography
  image: string;
}

export const industries: Industry[] = [
  {
    id: "residential",
    name: "Residential",
    description:
      "Plumbing, drainage, and water supply systems for homes and housing developments.",
    icon: Home,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "commercial",
    name: "Commercial",
    description:
      "Reliable piping systems for offices, hotels, malls, and mixed-use developments.",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "industrial",
    name: "Industrial",
    description:
      "Chemical-resistant process, effluent, and cooling water piping for manufacturing plants.",
    icon: Factory,
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description:
      "Irrigation and water conveyance systems built for Indian farming conditions.",
    icon: Sprout,
    image:
      "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description:
      "Large-diameter water transport and drainage systems for civic infrastructure projects.",
    icon: Landmark,
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "irrigation",
    name: "Irrigation",
    description:
      "Drip, sprinkler, and lift irrigation piping for farms, orchards, and plantations.",
    icon: Droplets,
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "water-supply",
    name: "Water Supply",
    description:
      "Municipal and rural water supply networks engineered for long service life.",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1548407260-da850faa41e3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "construction",
    name: "Construction",
    description:
      "Plumbing, drainage, and structural piping specified into new-build construction.",
    icon: HardHat,
    image:
      "https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "government",
    name: "Government Projects",
    description:
      "Compliant, certified piping systems for public water and sanitation schemes.",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description:
      "Hot & cold water plumbing and drainage for hotels, resorts, and hospitality developments.",
    icon: Hotel,
    image:
      "https://images.pexels.com/photos/14036444/pexels-photo-14036444.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];



// import {
//   Home,
//   Building2,
//   Factory,
//   Wheat,
//   Landmark,
//   Droplets,
//   Waves,
//   HardHat,
//   ShieldCheck,
// } from "lucide-react";
// import type { Industry } from "@/types";

// export const industries: Industry[] = [
//   {
//     id: "residential",
//     name: "Residential",
//     description: "Plumbing, drainage, and water supply systems for homes and housing developments.",
//     icon: Home,
//   },
//   {
//     id: "commercial",
//     name: "Commercial",
//     description: "Reliable piping systems for offices, hotels, malls, and mixed-use developments.",
//     icon: Building2,
//   },
//   {
//     id: "industrial",
//     name: "Industrial",
//     description: "Chemical-resistant process, effluent, and cooling water piping for manufacturing plants.",
//     icon: Factory,
//   },
//   {
//     id: "agriculture",
//     name: "Agriculture",
//     description: "Irrigation and water conveyance systems built for Indian farming conditions.",
//     icon: Wheat,
//   },
//   {
//     id: "infrastructure",
//     name: "Infrastructure",
//     description: "Large-diameter water transport and drainage systems for civic infrastructure projects.",
//     icon: Landmark,
//   },
//   {
//     id: "irrigation",
//     name: "Irrigation",
//     description: "Drip, sprinkler, and lift irrigation piping for farms, orchards, and plantations.",
//     icon: Droplets,
//   },
//   {
//     id: "water-supply",
//     name: "Water Supply",
//     description: "Municipal and rural water supply networks engineered for long service life.",
//     icon: Waves,
//   },
//   {
//     id: "construction",
//     name: "Construction",
//     description: "Plumbing, drainage, and structural piping specified into new-build construction.",
//     icon: HardHat,
//   },
//   {
//     id: "government-projects",
//     name: "Government Projects",
//     description: "Compliant, certified piping systems for public water and sanitation schemes.",
//     icon: ShieldCheck,
//   },
// ];
