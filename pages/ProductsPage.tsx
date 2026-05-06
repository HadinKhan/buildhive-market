import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Icons } from "../components/Icons";
import { useWishlist, WishlistItem } from "../src/hooks/useWishlist";
import { useFilters } from "../src/hooks/useFilters";
import { useAuth } from "../src/context/AuthContext";
import api from "../src/services/api";
import {
  productService,
  type Product as ApiProduct,
} from "../src/services/productService";
import type { Product as CartProduct } from "../types";

interface ProductsPageProps {
  onNavigate: (page: string, productId?: string) => void;
  initialCategory?: string | null;
  onAddToCart?: (product: CartProduct, quantity: number) => void;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  materialType?: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  seller: string;
  seller_id?: string;
  business_id?: string;
  business?: any;
  sellerData?: any;
  images?: Array<{ image_url?: string }>;
  verified: boolean;
  description: string;
  tags: string[];
  specs?: { [key: string]: string };
  relatedProducts?: string[];
}

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: string;
  description: string;
  subcategories: string[];
}

interface MaterialGroup {
  label: string;
  options: string[];
}

interface SellerProfile {
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  responseTime: string;
  location: string;
  established: string;
  description: string;
  phone: string;
  email: string;
  certifications: string[];
  business?: any;
  seller?: any;
}

const categories: Category[] = [
  {
    id: "construction-materials",
    title: "Construction Materials",
    subtitle: "Cement, steel, timber",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    tone: "amber",
    description:
      "Premium-grade building materials sourced from verified suppliers across Pakistan.",
    subcategories: [
      "Cement & Concrete",
      "Steel & Reinforcement",
      "Timber & Wood",
      "Bricks & Blocks",
      "Aggregates & Sand",
      "Roofing Materials",
      "Waterproofing & Chemicals",
      "Insulation",
    ],
  },
  {
    id: "interior-assets",
    title: "Interior Assets",
    subtitle: "Fixtures, fittings, finishes",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    tone: "purple",
    description:
      "Transform spaces with curated interior elements and professional finishing solutions.",
    subcategories: [
      "Lighting & Electrical",
      "Flooring & Tiles",
      "Hardware & Fixtures",
      "Paint & Coatings",
      "Kitchen & Bath",
      "Decorative Elements",
      "Ceilings & Partitions",
      "Furniture & Storage",
    ],
  },
  {
    id: "architectural-resources",
    title: "Architectural Resources",
    subtitle: "Blueprints & CAD files",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    tone: "blue",
    description:
      "Professional digital assets for architects and engineers with technical documentation.",
    subcategories: [
      "2D Blueprints",
      "3D Models",
      "CAD Templates",
      "Structural Drawings",
      "MEP Plans",
      "Landscape Designs",
      "Estimation Sheets",
      "Permit Documents",
    ],
  },
  {
    id: "project-templates",
    title: "Project Templates",
    subtitle: "Ready-to-use kits",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
    tone: "green",
    description:
      "Complete project kits with pre-configured material lists, cost estimates, and timelines.",
    subcategories: [
      "Residential Kits",
      "Commercial Kits",
      "Renovation Kits",
      "Grey Structure Kits",
      "Finishing Kits",
      "Interior Design Kits",
      "Custom Projects",
    ],
  },
  {
    id: "plumbing-sanitary",
    title: "Plumbing & Sanitary",
    subtitle: "Pipes, fittings, fixtures",
    icon: <Icons.Plumbing className="h-6 w-6" />,
    tone: "cyan",
    description:
      "Complete water supply, drainage, sanitaryware, and bathroom fitting materials for houses.",
    subcategories: [
      "Pipes & Fittings",
      "Sanitaryware",
      "Bathroom Fixtures",
      "Water Tanks",
      "Valves & Pumps",
      "Drainage",
    ],
  },
  {
    id: "electrical-safety",
    title: "Electrical & Safety",
    subtitle: "Wiring, panels, protection",
    icon: <Icons.Electrical className="h-6 w-6" />,
    tone: "yellow",
    description:
      "Wiring, switchgear, lighting, backup power, and home safety products for reliable installations.",
    subcategories: [
      "Wires & Cables",
      "Switches & Sockets",
      "Distribution Boards",
      "Breakers & Protection",
      "Backup Power",
      "Security & Safety",
    ],
  },
  {
    id: "doors-windows",
    title: "Doors & Windows",
    subtitle: "Frames, panels, glass",
    icon: <Icons.Home className="h-6 w-6" />,
    tone: "orange",
    description:
      "Main doors, room doors, windows, glass, frames, grills, and hardware for house openings.",
    subcategories: [
      "Doors",
      "Windows",
      "Glass & Glazing",
      "Frames",
      "Grills & Railings",
      "Locks & Hinges",
    ],
  },
  {
    id: "exterior-landscape",
    title: "Exterior & Landscape",
    subtitle: "Pavers, boundary, garden",
    icon: <Icons.Globe className="h-6 w-6" />,
    tone: "emerald",
    description:
      "Exterior finishes, driveway materials, garden fixtures, boundary walls, and outdoor drainage.",
    subcategories: [
      "Pavers & Kerbs",
      "Boundary Wall",
      "Facade Finishes",
      "Garden & Irrigation",
      "Outdoor Lighting",
      "Drain Covers",
    ],
  },
  {
    id: "tools-equipment",
    title: "Tools & Equipment",
    subtitle: "Machines, safety, rentals",
    icon: <Icons.Tools className="h-6 w-6" />,
    tone: "slate",
    description:
      "Construction tools, site equipment, scaffolding, PPE, and rental equipment used during house construction.",
    subcategories: [
      "Power Tools",
      "Hand Tools",
      "Scaffolding",
      "Safety Gear",
      "Mixers & Cutters",
      "Survey Tools",
    ],
  },
];

const materialTaxonomy: Record<string, MaterialGroup[]> = {
  "construction-materials": [
    {
      label: "Bricks & Blocks",
      options: [
        "Red clay brick",
        "Awwal brick",
        "Doem brick",
        "Khingar brick",
        "Fly ash brick",
        "Concrete solid block",
        "Hollow block",
        "AAC block",
        "Paver brick",
        "Tuff tile",
      ],
    },
    {
      label: "Cement & Concrete",
      options: [
        "OPC 43 cement",
        "OPC 53 cement",
        "PPC cement",
        "SRC cement",
        "White cement",
        "Ready-mix concrete",
        "Lean concrete",
        "Concrete admixture",
        "Grout",
        "Mortar",
      ],
    },
    {
      label: "Steel & Reinforcement",
      options: [
        "Grade 40 rebar",
        "Grade 60 rebar",
        "Binding wire",
        "MS angle",
        "MS channel",
        "I-beam",
        "Welded mesh",
        "Steel stirrups",
        "GI sheet",
        "Expanded metal",
      ],
    },
    {
      label: "Aggregates & Sand",
      options: [
        "Margalla crush",
        "Sargodha crush",
        "River sand",
        "Chenab sand",
        "Lawrencepur sand",
        "Plaster sand",
        "Bajri",
        "Stone dust",
        "Marble chips",
      ],
    },
    {
      label: "Timber & Boards",
      options: [
        "Deodar wood",
        "Kail wood",
        "Partal wood",
        "Sheesham wood",
        "Pine wood",
        "Plywood",
        "MDF board",
        "Chipboard",
        "Lasani board",
        "Formwork shuttering",
      ],
    },
    {
      label: "Roofing & Insulation",
      options: [
        "RCC slab material",
        "GI roofing sheet",
        "Clay roof tile",
        "Bitumen membrane",
        "Heat insulation sheet",
        "Rockwool",
        "XPS board",
        "Foam board",
      ],
    },
    {
      label: "Waterproofing & Chemicals",
      options: [
        "Bitumen coating",
        "Polyurethane coating",
        "Acrylic waterproofing",
        "Damp proof course",
        "Termite proofing",
        "Concrete curing compound",
        "Tile bond",
        "Epoxy grout",
      ],
    },
  ],
  "interior-assets": [
    {
      label: "Flooring & Tiles",
      options: [
        "Ceramic tile",
        "Porcelain tile",
        "Granite tile",
        "Marble tile",
        "Travertine",
        "Wooden flooring",
        "Vinyl flooring",
        "Terrazzo",
        "Skirting",
        "Tile spacers",
      ],
    },
    {
      label: "Paint & Wall Finishes",
      options: [
        "Primer",
        "Emulsion paint",
        "Weather shield",
        "Enamel paint",
        "Texture paint",
        "Wall putty",
        "Distemper",
        "Wallpaper",
        "Wall panels",
        "Polish",
      ],
    },
    {
      label: "Ceilings & Partitions",
      options: [
        "Gypsum board",
        "False ceiling channel",
        "Ceiling tile",
        "PVC ceiling",
        "Cement board",
        "Glass partition",
        "Aluminum partition",
        "Acoustic panel",
      ],
    },
    {
      label: "Kitchen & Bath",
      options: [
        "Kitchen cabinet",
        "Countertop slab",
        "Sink",
        "Mixer tap",
        "Vanity",
        "Shower set",
        "Floor drain",
        "Bathroom accessory set",
      ],
    },
    {
      label: "Hardware & Fixtures",
      options: [
        "Door handle",
        "Mortise lock",
        "Hinges",
        "Drawer channel",
        "Cabinet knob",
        "Tower bolt",
        "Door stopper",
        "Curtain bracket",
      ],
    },
    {
      label: "Lighting & Decor",
      options: [
        "LED panel",
        "Downlight",
        "Spotlight",
        "Chandelier",
        "Wall light",
        "Cove light",
        "Mirror light",
        "Decorative molding",
      ],
    },
  ],
  "architectural-resources": [
    {
      label: "Drawing Sets",
      options: [
        "Floor plan",
        "Elevation",
        "Section",
        "Structural drawing",
        "Electrical plan",
        "Plumbing plan",
        "HVAC plan",
        "Landscape plan",
      ],
    },
    {
      label: "Digital Formats",
      options: [
        "DWG file",
        "PDF drawing",
        "Revit model",
        "SketchUp model",
        "3ds Max scene",
        "Blender model",
        "BOQ spreadsheet",
        "Cost estimate",
      ],
    },
    {
      label: "House Types",
      options: [
        "3 marla house",
        "5 marla house",
        "7 marla house",
        "10 marla house",
        "1 kanal house",
        "Farmhouse",
        "Basement plan",
        "Duplex plan",
      ],
    },
  ],
  "project-templates": [
    {
      label: "Build Stage",
      options: [
        "Grey structure kit",
        "Finishing kit",
        "Turnkey kit",
        "Renovation kit",
        "Bathroom remodel",
        "Kitchen remodel",
        "Boundary wall kit",
        "Roof treatment kit",
      ],
    },
    {
      label: "House Size",
      options: [
        "3 marla",
        "5 marla",
        "7 marla",
        "10 marla",
        "1 kanal",
        "2 kanal",
        "Apartment",
        "Commercial shop",
      ],
    },
    {
      label: "Deliverables",
      options: [
        "Material list",
        "Labor schedule",
        "BOQ",
        "Cost estimate",
        "Timeline",
        "Vendor list",
        "Inspection checklist",
      ],
    },
  ],
  "plumbing-sanitary": [
    {
      label: "Pipes & Fittings",
      options: [
        "PPRC pipe",
        "UPVC pipe",
        "PVC pipe",
        "HDPE pipe",
        "GI pipe",
        "PEX pipe",
        "Elbow",
        "Tee",
        "Union",
        "Reducer",
        "Solvent cement",
      ],
    },
    {
      label: "Sanitaryware",
      options: [
        "Commode",
        "Squat pan",
        "Wash basin",
        "Pedestal basin",
        "Muslim shower",
        "Flush tank",
        "Concealed cistern",
        "Floor trap",
      ],
    },
    {
      label: "Water System",
      options: [
        "Overhead tank",
        "Underground tank",
        "Water pump",
        "Pressure pump",
        "Gate valve",
        "Ball valve",
        "Check valve",
        "Water filter",
      ],
    },
    {
      label: "Drainage",
      options: [
        "Manhole cover",
        "Gully trap",
        "Drain pipe",
        "Cleanout",
        "Rainwater pipe",
        "Floor drain",
        "Drain channel",
      ],
    },
  ],
  "electrical-safety": [
    {
      label: "Wires & Cables",
      options: [
        "1.5mm wire",
        "2.5mm wire",
        "4mm wire",
        "6mm wire",
        "10mm wire",
        "Coaxial cable",
        "Cat6 cable",
        "Flexible cable",
        "Earthing cable",
      ],
    },
    {
      label: "Switchgear",
      options: [
        "Switch",
        "Socket",
        "Dimmer",
        "Fan regulator",
        "DB box",
        "MCB",
        "RCCB",
        "MCCB",
        "Changeover switch",
        "Surge protector",
      ],
    },
    {
      label: "Power & Backup",
      options: [
        "UPS",
        "Solar inverter",
        "Battery",
        "Solar panel",
        "Generator",
        "Voltage stabilizer",
        "ATS panel",
      ],
    },
    {
      label: "Safety & Security",
      options: [
        "Smoke detector",
        "Gas detector",
        "CCTV camera",
        "Door sensor",
        "Smart lock",
        "Fire extinguisher",
        "Emergency light",
      ],
    },
  ],
  "doors-windows": [
    {
      label: "Doors",
      options: [
        "Solid wood door",
        "Panel door",
        "Flush door",
        "MDF door",
        "WPC door",
        "Steel door",
        "UPVC door",
        "Sliding door",
      ],
    },
    {
      label: "Windows",
      options: [
        "Aluminum window",
        "UPVC window",
        "Wooden window",
        "Sliding window",
        "Casement window",
        "Ventilator",
        "Mosquito mesh",
      ],
    },
    {
      label: "Glass & Frames",
      options: [
        "Clear glass",
        "Tempered glass",
        "Double glazed glass",
        "Frosted glass",
        "Aluminum frame",
        "Wooden frame",
        "Steel frame",
      ],
    },
    {
      label: "Grills & Hardware",
      options: [
        "Window grill",
        "Stair railing",
        "Balcony railing",
        "Main gate",
        "Door lock",
        "Hinge",
        "Handle set",
        "Door closer",
      ],
    },
  ],
  "exterior-landscape": [
    {
      label: "Driveway & Pavers",
      options: [
        "Tuff tile",
        "Concrete paver",
        "Kerb stone",
        "Cobblestone",
        "Grass paver",
        "Driveway drain",
        "Parking tile",
      ],
    },
    {
      label: "Facade & Boundary",
      options: [
        "Stone cladding",
        "Brick cladding",
        "Texture coating",
        "Boundary wall block",
        "Coping stone",
        "Exterior paint",
        "Main gate",
      ],
    },
    {
      label: "Garden & Irrigation",
      options: [
        "Garden soil",
        "Grass carpet",
        "Planter",
        "Sprinkler",
        "Drip pipe",
        "Outdoor tap",
        "Water feature",
      ],
    },
    {
      label: "Outdoor Fixtures",
      options: [
        "Gate light",
        "Bollard light",
        "Drain cover",
        "Manhole cover",
        "Outdoor socket",
        "Security camera",
      ],
    },
  ],
  "tools-equipment": [
    {
      label: "Power Tools",
      options: [
        "Drill machine",
        "Angle grinder",
        "Marble cutter",
        "Tile cutter",
        "Demolition hammer",
        "Welding machine",
        "Concrete vibrator",
      ],
    },
    {
      label: "Site Equipment",
      options: [
        "Concrete mixer",
        "Scaffolding",
        "Wheelbarrow",
        "Ladder",
        "Shuttering plates",
        "Props",
        "Level machine",
      ],
    },
    {
      label: "Hand Tools & PPE",
      options: [
        "Trowel",
        "Mason line",
        "Measuring tape",
        "Spirit level",
        "Safety helmet",
        "Safety shoes",
        "Gloves",
        "Goggles",
      ],
    },
  ],
};

const sellerProfiles: Record<string, SellerProfile> = {
  "Lucky Cement": {
    name: "Lucky Cement",
    avatar: "L",
    verified: true,
    rating: 4.8,
    responseTime: "< 2 hours",
    location: "Karachi, Sindh",
    established: "1993",
    description:
      "Pakistan's largest cement manufacturer with nationwide distribution and certified construction-grade cement.",
    phone: "+92-21-111-111-111",
    email: "sales@luckycement.com",
    certifications: ["ISO 9001", "PSQCA Certified", "Environmental Excellence"],
  },
  "Mughal Steel": {
    name: "Mughal Steel",
    avatar: "M",
    verified: true,
    rating: 4.7,
    responseTime: "< 4 hours",
    location: "Lahore, Punjab",
    established: "1950",
    description:
      "Steel manufacturer specializing in deformed bars and reinforcement solutions for residential and commercial structures.",
    phone: "+92-42-111-222-333",
    email: "info@mughalsteel.com",
    certifications: ["ISO 9001", "PSQCA", "ASTM Certified"],
  },
  "Forest Woodworks": {
    name: "Forest Woodworks",
    avatar: "F",
    verified: true,
    rating: 4.5,
    responseTime: "< 6 hours",
    location: "Peshawar, KPK",
    established: "2005",
    description:
      "Premium timber supplier offering kiln-dried and treated wood for structural and decorative applications.",
    phone: "+92-91-111-444-555",
    email: "sales@forestwoodworks.pk",
    certifications: ["Forest Stewardship Council", "Quality Mark Pakistan"],
  },
  "Tile Master Pakistan": {
    name: "Tile Master Pakistan",
    avatar: "T",
    verified: true,
    rating: 4.9,
    responseTime: "< 3 hours",
    location: "Faisalabad, Punjab",
    established: "2010",
    description:
      "Flooring, marble, granite, and tile solutions for residential and commercial projects.",
    phone: "+92-41-111-666-777",
    email: "contact@tilemaster.pk",
    certifications: ["ISO 9001", "CE Marking"],
  },
  "ArchDesign Studio": {
    name: "ArchDesign Studio",
    avatar: "A",
    verified: true,
    rating: 4.6,
    responseTime: "< 12 hours",
    location: "Islamabad",
    established: "2015",
    description:
      "Professional architectural design services, CAD templates, blueprints, and structural drawings.",
    phone: "+92-51-111-888-999",
    email: "studio@archdesign.pk",
    certifications: ["PCATP Registered", "ISO 9001"],
  },
  "BuildHive Templates": {
    name: "BuildHive Templates",
    avatar: "B",
    verified: true,
    rating: 4.8,
    responseTime: "< 8 hours",
    location: "Lahore, Punjab",
    established: "2018",
    description:
      "Ready-to-use construction kits with material lists, cost estimates, and project timelines.",
    phone: "+92-42-111-000-111",
    email: "kits@buildhive.pk",
    certifications: ["Engineering Council Certified"],
  },
  "BrightLight Solutions": {
    name: "BrightLight Solutions",
    avatar: "B",
    verified: true,
    rating: 4.4,
    responseTime: "< 5 hours",
    location: "Karachi, Sindh",
    established: "2012",
    description:
      "Electrical and lighting solutions with LED panels, smart switches, and installation support.",
    phone: "+92-21-111-333-444",
    email: "info@brightlight.pk",
    certifications: ["IEC Certified", "PSQCA"],
  },
  "CAD Masters": {
    name: "CAD Masters",
    avatar: "C",
    verified: true,
    rating: 4.7,
    responseTime: "< 24 hours",
    location: "Rawalpindi, Punjab",
    established: "2008",
    description:
      "CAD and BIM resources for architects, engineers, and construction teams.",
    phone: "+92-51-111-555-666",
    email: "templates@cadmasters.pk",
    certifications: ["Autodesk Authorized", "Trimble Certified"],
  },
  RenovatePro: {
    name: "RenovatePro",
    avatar: "R",
    verified: true,
    rating: 4.3,
    responseTime: "< 6 hours",
    location: "Lahore, Punjab",
    established: "2016",
    description:
      "Renovation services and templates for offices, homes, and commercial spaces.",
    phone: "+92-42-111-777-888",
    email: "projects@renovatepro.pk",
    certifications: ["PSQCA", "Safety Certified"],
  },
  "Pak Bricks Co.": {
    name: "Pak Bricks Co.",
    avatar: "P",
    verified: true,
    rating: 4.2,
    responseTime: "< 3 hours",
    location: "Gujranwala, Punjab",
    established: "1985",
    description:
      "Traditional and modern brick manufacturing for load-bearing and partition walls.",
    phone: "+92-55-111-222-333",
    email: "orders@pakbricks.pk",
    certifications: ["PSQCA", "Quality Mark"],
  },
  "SecureHome Tech": {
    name: "SecureHome Tech",
    avatar: "S",
    verified: true,
    rating: 4.6,
    responseTime: "< 4 hours",
    location: "Karachi, Sindh",
    established: "2019",
    description:
      "Smart home security and automation products with app-controlled locks and sensors.",
    phone: "+92-21-111-999-000",
    email: "support@securehome.pk",
    certifications: ["ISO 27001", "CE Certified"],
  },
  RenderWorks: {
    name: "RenderWorks",
    avatar: "R",
    verified: true,
    rating: 4.8,
    responseTime: "< 18 hours",
    location: "Islamabad",
    established: "2014",
    description:
      "3D rendering, visualization, walkthroughs, and model assets for architecture and real estate.",
    phone: "+92-51-111-444-555",
    email: "studio@renderworks.pk",
    certifications: ["Chaos Group Partner", "Autodesk Certified"],
  },
};

const productsPageStyles = `
* { box-sizing: border-box; }

.products-page-enhanced {
  min-height: 100vh;
  background: #07070b;
  color: #e2e8f0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.products-page-enhanced button,
.products-page-enhanced input,
.products-page-enhanced select {
  font: inherit;
}

.products-page-enhanced ::-webkit-scrollbar { width: 8px; height: 8px; }
.products-page-enhanced ::-webkit-scrollbar-track { background: #09090d; }
.products-page-enhanced ::-webkit-scrollbar-thumb { background: #4338ca; border-radius: 999px; }
.products-page-enhanced ::-webkit-scrollbar-thumb:hover { background: #6366f1; }

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  padding: 24px;
}

.filter-group {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.filter-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 0;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  user-select: none;
  background: none;
  border: none;
  width: 100%;
}

.filter-group-toggle {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a78bfa;
  transition: transform 0.25s ease;
}

.filter-group-toggle.expanded {
  transform: rotate(180deg);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.filter-search {
  position: relative;
  margin: 12px 0 10px;
}

.filter-search svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: #7f8da6;
}

.filter-search input {
  width: 100%;
  min-height: 36px;
  padding: 0 10px 0 32px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  outline: none;
  font-size: 12px;
}

.filter-subgroup {
  padding: 8px 0 4px;
}

.filter-subgroup-title {
  color: #a78bfa;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.7px;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.filter-checkbox:hover {
  background: rgba(255, 255, 255, 0.03);
}

.filter-checkbox input[type="checkbox"],
.filter-checkbox input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #a78bfa;
}

.filter-checkbox label {
  min-width: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-size: 13px;
  color: #cbd5e1;
}

.filter-checkbox label span:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-badge {
  font-size: 11px;
  color: #7f8da6;
  font-weight: 600;
}

.price-slider {
  margin-top: 12px;
  min-width: 0;
}

.price-slider input[type="range"] {
  width: 100%;
  max-width: 100%;
}

.price-inputs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  min-width: 0;
}

.price-inputs input {
  width: 100%;
  min-width: 0;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  text-align: center;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-inputs span {
  color: #cbd5e1;
  width: 10px;
  text-align: center;
}

.range-helper {
  color: #7f8da6;
  font-size: 11px;
  margin-top: 8px;
}

.rating-control {
  margin-top: 12px;
}

.rating-control input[type="range"] {
  width: 100%;
  max-width: 100%;
}

.rating-value-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.rating-value-row input {
  width: 82px;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  outline: none;
  text-align: center;
}

.rating-value-row span {
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 700;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(79, 70, 229, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.3);
  color: #c4b5fd;
  font-size: 12px;
  font-weight: 600;
}

.filter-chip button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  font-size: 12px;
  font-weight: 700;
}

.products-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-nav-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-search {
  position: relative;
  width: min(280px, 100%);
  flex: 0 0 260px;
}

.category-search svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #7f8da6;
}

.category-search input {
  width: 100%;
  min-height: 42px;
  padding: 0 12px 0 36px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #e2e8f0;
  outline: none;
  font-size: 13px;
}

.products-search {
  position: relative;
  flex: 1 1 300px;
}

.products-search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #7f8da6;
}

.products-search input {
  width: 100%;
  min-height: 44px;
  padding: 0 14px 0 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  outline: none;
}

.products-search input:focus {
  border-color: rgba(124, 58, 237, 0.45);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
}

.results-summary {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
}

.btn-reset {
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-reset:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.3);
  color: #c4b5fd;
}

.products-main {
  display: flex;
  flex-direction: column;
}

.comparison-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(79, 70, 229, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.25);
}

.comparison-bar p {
  color: #cbd5e1;
  font-size: 13px;
  margin: 0;
  flex: 1;
}

.btn-compare {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid rgba(167, 139, 250, 0.44);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 10px 22px rgba(0, 0, 0, 0.22);
}

.btn-compare:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830;
}

.btn-compare:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.compare-card {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.compare-card img {
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.compare-card-body {
  padding: 12px;
}

.compare-card-body h3 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 14px;
  line-height: 1.35;
}

.compare-card-body p {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
}

.compare-table-wrap {
  overflow-x: auto;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.compare-table th,
.compare-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  font-size: 13px;
  vertical-align: top;
}

.compare-table th {
  background: rgba(124, 58, 237, 0.1);
  color: #fff;
  font-weight: 800;
}

.compare-table td:first-child {
  color: #a78bfa;
  font-weight: 800;
  width: 140px;
}

.compare-highlight {
  color: #34d399;
  font-weight: 800;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: #0f0f15;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlide 0.3s ease;
}

@keyframes modalSlide {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: sticky;
  top: 0;
  background: rgba(15, 15, 21, 0.9);
  backdrop-filter: blur(16px);
}

.modal-header h2 {
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
}

.modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 20px;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.modal-body {
  padding: 24px;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.thumbnail-gallery {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  border-color: rgba(124, 58, 237, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details-info h3 {
  margin: 0 0 16px;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.2;
}

.product-details-price {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
}

.product-details-unit {
  color: #7f8da6;
  font-size: 13px;
  margin-bottom: 16px;
}

.specs-table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
  font-size: 13px;
}

.specs-table th,
.specs-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.specs-table th {
  color: #a78bfa;
  font-weight: 700;
  background: rgba(124, 58, 237, 0.08);
}

.specs-table td {
  color: #cbd5e1;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
  min-height: 54px;
  padding: 0 22px;
  border-radius: 16px;
  border: 1px solid rgba(167, 139, 250, 0.28);
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
  font-size: 14px;
}

.modal-actions .btn-primary {
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426;
  color: #f5f3ff;
  border-color: rgba(167, 139, 250, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 58, 237, 0.2);
}

.modal-actions .btn-primary:hover {
  transform: translateY(-2px);
  border-color: rgba(196, 181, 253, 0.68);
  background: linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22);
}

.modal-actions .btn-secondary {
  background: rgba(255, 255, 255, 0.025);
  border-color: rgba(167, 139, 250, 0.28);
  color: #e9d5ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.modal-actions .btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.055);
  border-color: rgba(167, 139, 250, 0.5);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 16px 34px rgba(0, 0, 0, 0.24);
}

.seller-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.15);
  margin-bottom: 20px;
}

.seller-card-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: inherit;
  text-align: left;
  cursor: pointer;
  padding: 0;
}

.seller-profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.seller-profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
}

.seller-stats-grid,
.template-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.seller-stat-card,
.template-stat-card {
  padding: 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.seller-stat-value,
.template-stat-value {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 900;
}

.seller-stat-label,
.template-stat-label {
  color: #7f8da6;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.seller-section,
.template-section {
  margin-bottom: 20px;
}

.seller-section h3,
.template-section h4 {
  color: #a78bfa;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0 0 10px;
  text-transform: uppercase;
}

.seller-certifications {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seller-cert-tag {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.1);
  border: 1px solid rgba(52, 211, 153, 0.2);
  color: #34d399;
  font-size: 11px;
  font-weight: 700;
}

.template-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-phase {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  font-size: 13px;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #8b5cf6;
  flex-shrink: 0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.pagination-controls button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pagination-controls button:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.3);
  color: #c4b5fd;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #7f8da6;
  font-size: 12px;
  margin: 0 8px;
}

.toast-notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #10b981;
  color: white;
  font-size: 13px;
  font-weight: 600;
  z-index: 100;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    top: 0;
    max-height: none;
  }

  .category-nav-row {
    align-items: stretch;
    flex-direction: column;
  }

  .category-search {
    flex: 1 1 auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    border-radius: 16px;
  }
}
`;

const toProductView = (product: ApiProduct): Product => ({
  id: product.id,
  name: product.name,
  category: product.categories?.slug || product.category_id || "products",
  subcategory: product.categories?.name || "Products",
  materialType: product.tags?.[0],
  price: product.price,
  unit: product.weight_unit ? `per ${product.weight_unit}` : "per item",
  rating: product.average_rating || 0,
  reviews: product.total_reviews || 0,
  image: product.product_images?.[0]?.image_url || (product as any).image || "",
  badge: product.is_featured ? "Featured" : undefined,
  seller: product.businesses?.business_name || "BuildHive Seller",
  seller_id:
    (product as any).seller_id ||
    (product as any).user_id ||
    (product as any).businesses?.user_id ||
    "",
  business_id: product.business_id || (product as any).businesses?.id || "",
  business: (product as any).businesses || (product as any).business || null,
  sellerData: (product as any).seller || null,
  images: product.product_images || [],
  verified: product.status === "approved",
  description: product.description || "",
  tags: product.tags || [],
  specs: {
    SKU: product.sku || "",
    Weight: product.weight ? `${product.weight} ${product.weight_unit}` : "",
    Stock: String(product.quantity),
  },
});

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  initialCategory,
  onAddToCart,
}) => {
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const {
    filters,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    updateFilter,
    updatePriceRange,
    toggleMaterialType,
    toggleSeller,
    toggleComparison,
    comparisonItems,
    clearAllFilters,
    getActiveFiltersCount,
    resultCount,
  } = useFilters(products);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || searchParams.get("categoryId") || "all",
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(
    null,
  );
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [categoryNavSearch, setCategoryNavSearch] = useState("");
  const [categorySearches, setCategorySearches] = useState<
    Record<string, string>
  >({});
  const [sellerSearch, setSellerSearch] = useState("");
  const [filterExpanded, setFilterExpanded] = useState<Record<string, boolean>>(
    {
      category: true,
      price: true,
      seller: true,
      rating: true,
    },
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoadingProducts(true);
    productService
      .getProducts({ status: "approved", isActive: true, limit: 100 })
      .then(({ products: apiProducts }) => {
        if (!cancelled) {
          setProducts(apiProducts.map(toProductView));
          setProductsError(null);
        }
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        if (!cancelled) {
          setProducts([]);
          setProductsError("Products are unavailable right now.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryProducts = useMemo(() => {
    let filtered =
      activeCategory === "all"
        ? filteredProducts
        : filteredProducts.filter((p) => p.category === activeCategory);
    if (showWishlistOnly) {
      filtered = filtered.filter((p) => isInWishlist(p.id));
    }
    return filtered;
  }, [activeCategory, filteredProducts, showWishlistOnly, isInWishlist]);

  const displayedProducts = useMemo(() => {
    const startIdx = (filters.page - 1) * filters.itemsPerPage;
    const endIdx = startIdx + filters.itemsPerPage;
    return categoryProducts.slice(startIdx, endIdx);
  }, [categoryProducts, filters.page, filters.itemsPerPage]);

  const categoryTotalPages = Math.max(
    1,
    Math.ceil(categoryProducts.length / filters.itemsPerPage),
  );

  const handleWishlistToggle = (product: Product) => {
    const wishlistItem: WishlistItem = {
      productId: product.id,
      addedAt: new Date(),
      category: product.category,
      productName: product.name,
      image: product.image,
      price: product.price,
    };
    toggleWishlist(wishlistItem);
    setToast(
      isInWishlist(product.id)
        ? "Removed from liked items"
        : "Added to liked items",
    );
    setTimeout(() => setToast(null), 2000);
  };

  const handleComparisonToggle = (productId: string) => {
    toggleComparison(productId);
  };

  const handlePageChange = (page: number) => {
    updateFilter("page", page);
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    requestAnimationFrame(scrollToTop);
    window.setTimeout(scrollToTop, 80);
  };

  const toCartProduct = (product: Product): CartProduct => ({
    id: product.id,
    business_id: "",
    category_id: product.category,
    name: product.name,
    slug: product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    description: product.description,
    price: product.price,
    track_quantity: false,
    quantity: 1,
    weight_unit: "kg",
    requires_shipping: true,
    is_physical: true,
    status: "approved",
    is_active: true,
    is_featured: false,
    created_at: "",
    updated_at: "",
    images: [
      {
        id: `${product.id}-image`,
        product_id: product.id,
        image_url: product.image,
        display_order: 0,
        created_at: "",
      },
    ],
    author: product.seller,
    rating: product.rating,
    sales: product.reviews,
  });

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(toCartProduct(product), 1);
    } else {
      setToast(`${product.name} added to cart`);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const comparedProducts = useMemo(
    () =>
      comparisonItems
        .map((productId) =>
          products.find((product) => product.id === productId),
        )
        .filter((product): product is Product => Boolean(product)),
    [comparisonItems, products],
  );
  const bestComparedPrice = comparedProducts.length
    ? Math.min(...comparedProducts.map((product) => product.price))
    : 0;
  const bestComparedRating = comparedProducts.length
    ? Math.max(...comparedProducts.map((product) => product.rating))
    : 0;
  const comparisonSpecKeys = useMemo(
    () =>
      Array.from(
        new Set(
          comparedProducts.flatMap((product) =>
            Object.keys(product.specs || {}),
          ),
        ),
      ).slice(0, 8),
    [comparedProducts],
  );

  const scrollToCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      const params = new URLSearchParams(searchParams);
      if (categoryId === "all") {
        params.delete("categoryId");
      } else {
        params.set("categoryId", categoryId);
      }
      setSearchParams(params);
      updateFilter("page", 1);
    },
    [searchParams, setSearchParams, updateFilter],
  );

  const renderHeart = (filled: boolean = false) => (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const renderStar = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  const renderCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const buildFallbackSellerProfile = (product: Product): SellerProfile => ({
    name: product.seller,
    avatar: product.seller.slice(0, 1).toUpperCase(),
    verified: product.verified,
    rating: product.rating,
    responseTime: "Contact seller",
    location: "",
    established: "",
    description: "",
    phone: "",
    email: "",
    certifications: [],
    business: product.business || null,
    seller: product.sellerData || null,
  });

  const handleViewSellerProfile = async (product: Product) => {
    const fallback = buildFallbackSellerProfile(product);
    let business = product.business || null;

    const businessId =
      product.business_id ||
      product.business?.id ||
      product.business?.business_id ||
      null;

    if (businessId) {
      try {
        const res = await api.get(`/business/${businessId}`);
        business = res.data?.data || res.data || business;
      } catch (error) {
        console.error("Failed to fetch business profile:", error);
      }
    }

    const seller =
      product.sellerData ||
      business?.seller ||
      business?.user ||
      product.business?.user ||
      null;

    const sellerData = { business, seller };
    console.log("SELLER DATA:", JSON.stringify(sellerData, null, 2));

    setSelectedSeller({
      ...fallback,
      location: business?.location || business?.city || fallback.location,
      established:
        business?.established ||
        business?.founded_year ||
        business?.created_at?.slice?.(0, 4) ||
        fallback.established,
      description: business?.description || "",
      phone: business?.phone || seller?.phone || "",
      email: business?.email || seller?.email || "",
      certifications: Array.isArray(business?.certifications)
        ? business.certifications
        : fallback.certifications,
      business,
      seller,
    });
  };

  const handleContactSellerFromProfile = async () => {
    if (!selectedSeller) return;

    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    const business = selectedSeller.business;
    console.log("CONTACT SELLER: participantId=", business?.user_id);

    const participantId =
      business?.user_id ||
      business?.userId ||
      selectedSeller.seller?.user_id ||
      selectedSeller.seller?.userId ||
      null;

    if (!participantId) {
      setToast("Could not start conversation, please try again");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setSelectedSeller(null);
    window.location.href = `/messages?participantId=${encodeURIComponent(participantId)}`;
  };

  const renderProductCard = (product: Product) => (
    <article
      key={product.id}
      className="product-card"
      style={{
        padding: 0,
        borderRadius: "24px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        cursor: "pointer",
        transition:
          "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
      }}
      onClick={() => setSelectedProduct(product)}
      onMouseEnter={(e) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.28)";
          e.currentTarget.style.boxShadow =
            "0 24px 50px rgba(0,0,0,0.34), 0 0 28px rgba(124, 58, 237, 0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        {(() => {
          const imageSrc =
            product.images?.[0]?.image_url || product.image || null;
          return (
            <>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "204px",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const placeholder = e.currentTarget
                      .nextElementSibling as HTMLElement | null;
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
              )}
              <div
                style={{
                  width: "100%",
                  height: "204px",
                  background: "#1f2937",
                  display: imageSrc ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                No image
              </div>
            </>
          );
        })()}
        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              color: "#fff",
              background:
                product.badge === "Best Seller"
                  ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                  : "linear-gradient(135deg, #34d399, #10b981)",
            }}
          >
            {product.badge}
          </span>
        )}

        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 8,
          }}
        >
          <button
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: isInWishlist(product.id)
                ? "rgba(168, 85, 247, 0.85)"
                : "rgba(0,0,0,0.38)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition:
                "background 0.25s ease, transform 0.25s ease, border-color 0.25s ease",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle(product);
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.background = "rgba(124, 58, 237, 0.85)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.background = isInWishlist(product.id)
                  ? "rgba(168, 85, 247, 0.85)"
                  : "rgba(0,0,0,0.38)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
            aria-label={
              isInWishlist(product.id)
                ? "Remove from liked items"
                : "Like this product"
            }
            title={
              isInWishlist(product.id)
                ? "Remove from liked items"
                : "Like this product"
            }
          >
            <div style={{ width: "18px", height: "18px", color: "white" }}>
              {renderHeart(isInWishlist(product.id))}
            </div>
          </button>

          <label
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.38)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "background 0.25s ease",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.background = "rgba(124, 58, 237, 0.85)";
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.background = "rgba(0,0,0,0.38)";
              }
            }}
          >
            <input
              type="checkbox"
              checked={comparisonItems.includes(product.id)}
              onChange={() => handleComparisonToggle(product.id)}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
                accentColor: "#a78bfa",
              }}
            />
          </label>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 10px",
            borderRadius: "999px",
            marginBottom: "10px",
            background: "rgba(124, 58, 237, 0.12)",
            border: "1px solid rgba(124, 58, 237, 0.18)",
            color: "#c4b5fd",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          {product.subcategory}
        </span>
        <h3
          style={{
            margin: "0 0 8px",
            color: "#fff",
            fontSize: "1.03rem",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            margin: "0 0 16px",
            color: "#7f8da6",
            fontSize: "13px",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "42px",
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ color: "#fff", fontWeight: 900, fontSize: "1.18rem" }}>
            Rs. {product.price.toLocaleString()}
            <span
              style={{ color: "#7887a2", fontSize: "12px", fontWeight: 600 }}
            >
              {" "}
              {product.unit}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#fbbf24",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {renderStar()}
            {product.rating.toFixed(1)}
            <span style={{ color: "#7f8da6", fontWeight: 500 }}>
              ({product.reviews})
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
          onMouseEnter={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "rgba(196, 181, 253, 0.68)";
              e.currentTarget.style.background =
                "linear-gradient(180deg, rgba(196, 181, 253, 0.16), rgba(124, 58, 237, 0.08)), #211830";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 18px 38px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(167, 139, 250, 0.22)";
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(167, 139, 250, 0.44)";
              e.currentTarget.style.background =
                "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 58, 237, 0.2)";
            }
          }}
          style={{
            width: "100%",
            minHeight: "42px",
            marginBottom: 14,
            border: "1px solid rgba(167, 139, 250, 0.44)",
            borderRadius: "16px",
            background:
              "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426",
            color: "#f5f3ff",
            fontSize: "13px",
            fontWeight: 900,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 14px 30px rgba(0, 0, 0, 0.24), 0 0 0 1px rgba(124, 58, 237, 0.2)",
            transition:
              "transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          <Icons.Cart style={{ width: 16, height: 16 }} />
          Add to Cart
        </button>
        <div
          onClick={(e) => {
            e.stopPropagation();
            void handleViewSellerProfile(product);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "11px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              flexShrink: 0,
            }}
          >
            {product.seller.charAt(0)}
          </div>
          <span style={{ color: "#9aa9c2", fontSize: "13px" }}>
            {product.seller}
          </span>
          {product.verified && (
            <span
              style={{
                width: "16px",
                height: "16px",
                color: "#34d399",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderCheck()}
            </span>
          )}
        </div>
      </div>
    </article>
  );

  const uniqueSellers = Array.from(new Set(products.map((p) => p.seller)));
  const visibleSellers = useMemo(() => {
    const query = sellerSearch.trim().toLowerCase();
    return uniqueSellers
      .filter((seller) => {
        const inActiveCategory = products.some(
          (product) =>
            product.seller === seller &&
            (activeCategory === "all" || product.category === activeCategory),
        );
        if (!inActiveCategory) return false;
        if (!query) return true;
        return seller.toLowerCase().includes(query);
      })
      .sort();
  }, [activeCategory, sellerSearch, uniqueSellers]);
  const activeFilterCount =
    getActiveFiltersCount() + (showWishlistOnly ? 1 : 0);
  const currentCategory = categories.find(
    (category) => category.id === activeCategory,
  );
  const currentCategoryLabel =
    activeCategory === "all"
      ? "all categories"
      : currentCategory?.title || "this category";
  const currentCategorySearch = categorySearches[activeCategory] || "";
  const visibleCategories = useMemo(() => {
    const query = categoryNavSearch.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((category) =>
      [
        category.title,
        category.subtitle,
        category.description,
        ...category.subcategories,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [categoryNavSearch]);
  const activeMaterialGroups = useMemo(() => {
    const sourceGroups =
      activeCategory === "all"
        ? Object.values(materialTaxonomy).flat()
        : materialTaxonomy[activeCategory] || [];
    const query = currentCategorySearch.trim().toLowerCase();

    return sourceGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => {
          if (!query) return true;
          return (
            option.toLowerCase().includes(query) ||
            group.label.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((group) => group.options.length > 0);
  }, [activeCategory, currentCategorySearch]);

  const productMatchesMaterial = useCallback(
    (product: Product, material: string) => {
      const needle = material.toLowerCase();
      return [
        product.subcategory,
        product.materialType,
        ...product.tags,
        ...Object.values(product.specs || {}),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    },
    [],
  );

  const getMaterialCount = useCallback(
    (material: string) =>
      products.filter(
        (product) =>
          (activeCategory === "all" || product.category === activeCategory) &&
          productMatchesMaterial(product, material),
      ).length,
    [activeCategory, productMatchesMaterial],
  );

  const categoryProductsForPrice = products.filter(
    (product) =>
      activeCategory === "all" || product.category === activeCategory,
  );
  const categoryMaxPrice = Math.max(
    1000,
    ...categoryProductsForPrice.map((product) => product.price),
  );
  const visiblePriceMin = Math.min(filters.priceRange[0], categoryMaxPrice);
  const visiblePriceMax = Math.min(filters.priceRange[1], categoryMaxPrice);
  const visibleRating = filters.rating ?? 0;

  return (
    <div className="products-page-enhanced">
      <style>{productsPageStyles}</style>

      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 20px 0" }}
      >
        <div className="category-nav-row">
          <div className="category-search">
            <Icons.Search />
            <input
              type="search"
              placeholder="Search categories"
              value={categoryNavSearch}
              onChange={(event) => setCategoryNavSearch(event.target.value)}
            />
          </div>
          <nav
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              padding: "0 0 14px",
              scrollbarWidth: "none",
              flex: 1,
            }}
          >
            <button
              onClick={() => scrollToCategory("all")}
              style={{
                minHeight: "42px",
                padding: "0 18px",
                borderRadius: "999px",
                border:
                  activeCategory === "all"
                    ? "1px solid rgba(167, 139, 250, 0.44)"
                    : "1px solid rgba(255,255,255,0.08)",
                background:
                  activeCategory === "all"
                    ? "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426"
                    : "rgba(255,255,255,0.03)",
                color: activeCategory === "all" ? "#f5f3ff" : "#94a3b8",
                boxShadow:
                  activeCategory === "all"
                    ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 22px rgba(0,0,0,0.22)"
                    : "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
              }}
            >
              All Categories
            </button>
            {visibleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                style={{
                  minHeight: "42px",
                  padding: "0 18px",
                  borderRadius: "999px",
                  border:
                    activeCategory === cat.id
                      ? "1px solid rgba(167, 139, 250, 0.44)"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    activeCategory === cat.id
                      ? "linear-gradient(180deg, rgba(196, 181, 253, 0.12), rgba(124, 58, 237, 0.06)), #1a1426"
                      : "rgba(255,255,255,0.03)",
                  color: activeCategory === cat.id ? "#f5f3ff" : "#94a3b8",
                  boxShadow:
                    activeCategory === cat.id
                      ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 22px rgba(0,0,0,0.22)"
                      : "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="sidebar">
            <div className="active-filters">
              {filters.materialTypes.map((type) => (
                <div key={type} className="filter-chip">
                  {type}
                  <button onClick={() => toggleMaterialType(type)}>x</button>
                </div>
              ))}
              {filters.sellers.map((seller) => (
                <div key={seller} className="filter-chip">
                  {seller}
                  <button onClick={() => toggleSeller(seller)}>x</button>
                </div>
              ))}
              {showWishlistOnly && (
                <div className="filter-chip">
                  Liked Items Only
                  <button onClick={() => setShowWishlistOnly(false)}>x</button>
                </div>
              )}
              {activeFilterCount > 0 && (
                <button className="btn-reset" onClick={clearAllFilters}>
                  Reset Filters ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Material Types Filter */}
            <div className="filter-group">
              <button
                className="filter-group-title"
                onClick={() =>
                  setFilterExpanded((p) => ({ ...p, category: !p.category }))
                }
              >
                Material Types
                <span
                  className={`filter-group-toggle ${filterExpanded.category ? "expanded" : ""}`}
                >
                  v
                </span>
              </button>
              {filterExpanded.category && (
                <>
                  <div className="filter-search">
                    <Icons.Search />
                    <input
                      type="search"
                      placeholder={`Search ${currentCategoryLabel}`}
                      value={currentCategorySearch}
                      onChange={(event) =>
                        setCategorySearches((prev) => ({
                          ...prev,
                          [activeCategory]: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="filter-options">
                    {activeMaterialGroups.map((group) => (
                      <div key={group.label} className="filter-subgroup">
                        <div className="filter-subgroup-title">
                          {group.label}
                        </div>
                        {group.options.map((type) => {
                          const count = getMaterialCount(type);
                          return (
                            <div key={type} className="filter-checkbox">
                              <input
                                type="checkbox"
                                id={`material-${activeCategory}-${type}`}
                                checked={filters.materialTypes.includes(type)}
                                onChange={() => toggleMaterialType(type)}
                              />
                              <label
                                htmlFor={`material-${activeCategory}-${type}`}
                              >
                                <span>{type}</span>
                                <span className="filter-badge">({count})</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {activeMaterialGroups.length === 0 && (
                      <div
                        style={{
                          color: "#7f8da6",
                          fontSize: 12,
                          padding: "8px 0",
                        }}
                      >
                        No material types found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <button
                className="filter-group-title"
                onClick={() =>
                  setFilterExpanded((p) => ({ ...p, price: !p.price }))
                }
              >
                Price Range
                <span
                  className={`filter-group-toggle ${filterExpanded.price ? "expanded" : ""}`}
                >
                  v
                </span>
              </button>
              {filterExpanded.price && (
                <div className="price-slider">
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={visiblePriceMin}
                    onChange={(e) =>
                      updatePriceRange([
                        Number(e.target.value),
                        filters.priceRange[1],
                      ])
                    }
                  />
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={visiblePriceMax}
                    onChange={(e) =>
                      updatePriceRange([
                        filters.priceRange[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                  <div className="price-inputs">
                    <input
                      type="number"
                      value={visiblePriceMin}
                      min="0"
                      max={categoryMaxPrice}
                      onChange={(event) =>
                        updatePriceRange([
                          Number(event.target.value),
                          filters.priceRange[1],
                        ])
                      }
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={visiblePriceMax}
                      min="0"
                      max={categoryMaxPrice}
                      onChange={(event) =>
                        updatePriceRange([
                          filters.priceRange[0],
                          Number(event.target.value),
                        ])
                      }
                      placeholder="Max"
                    />
                  </div>
                  <div className="range-helper">
                    Max updates from the highest product price in{" "}
                    {currentCategoryLabel}.
                  </div>
                </div>
              )}
            </div>

            {/* Seller Filter */}
            <div className="filter-group">
              <button
                className="filter-group-title"
                onClick={() =>
                  setFilterExpanded((p) => ({ ...p, seller: !p.seller }))
                }
              >
                Sellers
                <span
                  className={`filter-group-toggle ${filterExpanded.seller ? "expanded" : ""}`}
                >
                  v
                </span>
              </button>
              {filterExpanded.seller && (
                <>
                  <div className="filter-search">
                    <Icons.Search />
                    <input
                      type="search"
                      placeholder="Search sellers"
                      value={sellerSearch}
                      onChange={(event) => setSellerSearch(event.target.value)}
                    />
                  </div>
                  <div className="filter-options">
                    {visibleSellers.map((seller) => {
                      const count = products.filter(
                        (p) =>
                          p.seller === seller &&
                          (activeCategory === "all" ||
                            p.category === activeCategory),
                      ).length;
                      return (
                        <div key={seller} className="filter-checkbox">
                          <input
                            type="checkbox"
                            id={`seller-${seller}`}
                            checked={filters.sellers.includes(seller)}
                            onChange={() => toggleSeller(seller)}
                          />
                          <label htmlFor={`seller-${seller}`}>
                            <span>{seller}</span>
                            <span className="filter-badge">({count})</span>
                          </label>
                        </div>
                      );
                    })}
                    {visibleSellers.length === 0 && (
                      <div
                        style={{
                          color: "#7f8da6",
                          fontSize: 12,
                          padding: "8px 0",
                        }}
                      >
                        No sellers found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <button
                className="filter-group-title"
                onClick={() =>
                  setFilterExpanded((p) => ({ ...p, rating: !p.rating }))
                }
              >
                Rating
                <span
                  className={`filter-group-toggle ${filterExpanded.rating ? "expanded" : ""}`}
                >
                  v
                </span>
              </button>
              {filterExpanded.rating && (
                <div className="rating-control">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={visibleRating}
                    onChange={(event) => {
                      const nextRating = Number(event.target.value);
                      updateFilter(
                        "rating",
                        nextRating === 0 ? null : nextRating,
                      );
                    }}
                  />
                  <div className="rating-value-row">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={visibleRating}
                      onChange={(event) => {
                        const nextRating = Math.min(
                          5,
                          Math.max(0, Number(event.target.value)),
                        );
                        updateFilter(
                          "rating",
                          nextRating === 0 ? null : nextRating,
                        );
                      }}
                    />
                    <span>
                      {visibleRating === 0
                        ? "Any rating"
                        : `${visibleRating.toFixed(1)}+ Stars`}
                    </span>
                  </div>
                  {filters.rating !== null && (
                    <button
                      className="btn-reset"
                      style={{ marginTop: 10 }}
                      onClick={() => updateFilter("rating", null)}
                    >
                      Clear Rating
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Filter */}
            <div className="filter-group">
              <div className="filter-checkbox">
                <input
                  type="checkbox"
                  id="wishlist-only"
                  checked={showWishlistOnly}
                  onChange={() => setShowWishlistOnly(!showWishlistOnly)}
                />
                <label htmlFor="wishlist-only">
                  <span>Show Liked Items Only ({wishlist.length})</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Products Area */}
          <main className="products-main">
            <div className="products-toolbar">
              <div className="products-search">
                <Icons.Search />
                <input
                  type="search"
                  placeholder="Search products, sellers, or tags"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <span className="results-summary">
                {categoryProducts.length} of {resultCount} products
              </span>
            </div>

            {/* Comparison Bar */}
            {comparisonItems.length > 0 && (
              <div className="comparison-bar">
                <p>{comparisonItems.length} items selected for comparison</p>
                <button
                  className="btn-compare"
                  disabled={comparisonItems.length < 2}
                  onClick={() => setShowCompareModal(true)}
                >
                  Compare Products
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "24px",
              }}
            >
              {isLoadingProducts ? (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "54px 18px",
                    color: "#cbd5e1",
                  }}
                >
                  Loading products...
                </div>
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => renderProductCard(product))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "54px 18px",
                    borderRadius: "24px",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ color: "#a78bfa", fontSize: 48 }}>
                    <Icons.Search style={{ width: 48, height: 48 }} />
                  </div>
                  <h3
                    style={{
                      margin: "14px 0 8px",
                      color: "#fff",
                      fontSize: "1.15rem",
                    }}
                  >
                    No products found
                  </h3>
                  <p style={{ color: "#7f8da6" }}>
                    {productsError || "Try adjusting the search or filters"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {categoryTotalPages > 1 && (
              <div className="pagination-controls">
                <button
                  disabled={filters.page === 1}
                  onClick={() =>
                    handlePageChange(Math.max(1, filters.page - 1))
                  }
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {filters.page} of {categoryTotalPages}
                </span>
                <button
                  disabled={filters.page === categoryTotalPages}
                  onClick={() =>
                    handlePageChange(
                      Math.min(categoryTotalPages, filters.page + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Compare Modal */}
      {showCompareModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCompareModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Comparison</h2>
              <button
                className="modal-close"
                onClick={() => setShowCompareModal(false)}
              >
                x
              </button>
            </div>
            <div className="modal-body">
              <div className="compare-grid">
                {comparedProducts.map((product) => (
                  <div key={product.id} className="compare-card">
                    <img src={product.image} alt={product.name} />
                    <div className="compare-card-body">
                      <h3>{product.name}</h3>
                      <p>{product.seller}</p>
                      <p>{product.subcategory}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="compare-table-wrap">
                <table className="compare-table">
                  <tbody>
                    <tr>
                      <td>Price</td>
                      {comparedProducts.map((product) => (
                        <td key={`${product.id}-price`}>
                          <span
                            className={
                              product.price === bestComparedPrice
                                ? "compare-highlight"
                                : ""
                            }
                          >
                            Rs. {product.price.toLocaleString()} {product.unit}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Rating</td>
                      {comparedProducts.map((product) => (
                        <td key={`${product.id}-rating`}>
                          <span
                            className={
                              product.rating === bestComparedRating
                                ? "compare-highlight"
                                : ""
                            }
                          >
                            {product.rating.toFixed(1)} / 5 ({product.reviews}{" "}
                            reviews)
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Seller</td>
                      {comparedProducts.map((product) => (
                        <td key={`${product.id}-seller`}>
                          {product.seller}{" "}
                          {product.verified ? "(Verified)" : ""}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Quality signal</td>
                      {comparedProducts.map((product) => (
                        <td key={`${product.id}-quality`}>
                          {product.rating >= 4.7
                            ? "Premium rated"
                            : product.rating >= 4.4
                              ? "Strong buyer rating"
                              : "Standard rating"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Best for</td>
                      {comparedProducts.map((product) => (
                        <td key={`${product.id}-tags`}>
                          {product.tags.slice(0, 3).join(", ")}
                        </td>
                      ))}
                    </tr>
                    {comparisonSpecKeys.map((specKey) => (
                      <tr key={specKey}>
                        <td>{specKey}</td>
                        {comparedProducts.map((product) => (
                          <td key={`${product.id}-${specKey}`}>
                            {product.specs?.[specKey] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                x
              </button>
            </div>
            <div className="modal-body">
              <div className="product-detail-grid">
                {/* Images */}
                <div className="product-images">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="main-image"
                  />
                </div>

                {/* Details */}
                <div className="product-details-info">
                  <h3>{selectedProduct.name}</h3>
                  <div className="product-details-price">
                    Rs. {selectedProduct.price.toLocaleString()}
                  </div>
                  <div className="product-details-unit">
                    {selectedProduct.unit}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#fbbf24",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                    >
                      {renderStar()}
                      {selectedProduct.rating.toFixed(1)} (
                      {selectedProduct.reviews} reviews)
                    </div>
                  </div>

                  <p
                    style={{
                      color: "#cbd5e1",
                      lineHeight: 1.6,
                      marginBottom: 20,
                    }}
                  >
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.specs && (
                    <div>
                      <h4
                        style={{
                          color: "#fff",
                          marginBottom: 12,
                          fontSize: "14px",
                          fontWeight: 700,
                        }}
                      >
                        Specifications
                      </h4>
                      <table className="specs-table">
                        <tbody>
                          {Object.entries(selectedProduct.specs).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td style={{ fontWeight: 600 }}>{key}</td>
                                <td>{value}</td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: "rgba(124, 58, 237, 0.08)",
                      border: "1px solid rgba(124, 58, 237, 0.15)",
                      marginBottom: 20,
                    }}
                  >
                    <p style={{ color: "#cbd5e1", margin: 0, fontSize: 13 }}>
                      <strong style={{ color: "#fff" }}>Seller:</strong>{" "}
                      {selectedProduct.seller}
                      {selectedProduct.verified && (
                        <span
                          style={{
                            color: "#34d399",
                            marginLeft: 8,
                            fontWeight: 600,
                          }}
                        >
                          Verified
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    className="btn-secondary"
                    style={{ width: "100%", marginBottom: 20 }}
                    onClick={() => {
                      void handleViewSellerProfile(selectedProduct);
                    }}
                  >
                    View Seller Profile
                  </button>

                  {selectedProduct.category === "project-templates" && (
                    <div className="template-section">
                      <h4>Template Includes</h4>
                      <div className="template-stats-grid">
                        <div className="template-stat-card">
                          <div className="template-stat-value">BOQ</div>
                          <div className="template-stat-label">
                            Material list
                          </div>
                        </div>
                        <div className="template-stat-card">
                          <div className="template-stat-value">Cost</div>
                          <div className="template-stat-label">Estimate</div>
                        </div>
                        <div className="template-stat-card">
                          <div className="template-stat-value">Plan</div>
                          <div className="template-stat-label">Timeline</div>
                        </div>
                      </div>
                      <h4>Sample Timeline</h4>
                      <div className="template-timeline">
                        {[
                          "Foundation and structure",
                          "Brickwork and plaster",
                          "Electrical and plumbing",
                          "Flooring and finishing",
                          "Paint and handover",
                        ].map((phase) => (
                          <div key={phase} className="timeline-phase">
                            <span className="timeline-dot" />
                            <span>{phase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        handleWishlistToggle(selectedProduct);
                      }}
                    >
                      {isInWishlist(selectedProduct.id) ? "Liked" : "Like"}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => onNavigate("contact")}
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Profile Modal */}
      {selectedSeller && (
        <div className="modal-backdrop" onClick={() => setSelectedSeller(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedSeller.name}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedSeller(null)}
              >
                x
              </button>
            </div>
            <div className="modal-body">
              <div className="seller-profile-header">
                <div className="seller-profile-avatar">
                  {selectedSeller.avatar}
                </div>
                <div>
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 6px",
                      fontSize: "1.4rem",
                    }}
                  >
                    {selectedSeller.name}
                    {selectedSeller.verified && (
                      <span
                        style={{
                          color: "#34d399",
                          marginLeft: 10,
                          fontSize: 14,
                        }}
                      >
                        Verified
                      </span>
                    )}
                  </h3>
                  <p style={{ color: "#94a3b8", margin: 0 }}>
                    {selectedSeller.location} - Est.{" "}
                    {selectedSeller.established}
                  </p>
                </div>
              </div>

              <div className="seller-stats-grid">
                <div className="seller-stat-card">
                  <div className="seller-stat-value">
                    {selectedSeller.rating.toFixed(1)}
                  </div>
                  <div className="seller-stat-label">Rating</div>
                </div>
                <div className="seller-stat-card">
                  <div className="seller-stat-value">
                    {
                      products.filter(
                        (product) => product.seller === selectedSeller.name,
                      ).length
                    }
                  </div>
                  <div className="seller-stat-label">Products</div>
                </div>
                <button
                  type="button"
                  className="seller-stat-card"
                  onClick={() => {
                    void handleContactSellerFromProfile();
                  }}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div className="seller-stat-value">Contact seller</div>
                  <div className="seller-stat-label">Response</div>
                </button>
              </div>

              {selectedSeller.description ? (
                <div className="seller-section">
                  <h3>About</h3>
                  <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
                    {selectedSeller.description}
                  </p>
                </div>
              ) : null}

              <div className="seller-section">
                <h3>Contact</h3>
                <p style={{ color: "#cbd5e1", lineHeight: 1.8, margin: 0 }}>
                  Phone: {selectedSeller.phone || "-"}
                  <br />
                  Email: {selectedSeller.email || "-"}
                </p>
              </div>

              <div className="seller-section">
                <h3>Certifications</h3>
                <div className="seller-certifications">
                  {selectedSeller.certifications.map((certification) => (
                    <span key={certification} className="seller-cert-tag">
                      {certification}
                    </span>
                  ))}
                </div>
              </div>

              <div className="seller-section">
                <h3>Products</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  {products
                    .filter((product) => product.seller === selectedSeller.name)
                    .slice(0, 4)
                    .map((product) => renderProductCard(product))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
};
