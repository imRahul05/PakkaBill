import { CategoryId, GoldPurity, SilverPurity, GroceryUnit, GeneralUnit } from "@/types/category.types";

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortLabel: string;
  tagline: string;
  iconName: string;
  defaultHsn: string;
  defaultTemplateId: string;
  themeColor: string;
  badge: string;
  description: string;
  features: string[];
}

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  gold: {
    id: "gold",
    name: "Gold & Precious Jewellery",
    shortLabel: "Gold Jewellery",
    tagline: "3% Metal + 5% Making Split, HUID, Net Weight, Old Gold Exchange",
    iconName: "Sparkles",
    defaultHsn: "7113",
    defaultTemplateId: "gold-classic-jewellers",
    themeColor: "amber",
    badge: "Jewellers",
    description: "Tailored for retail jewellery showrooms, bullion dealers, and hallmarked ornament artisans.",
    features: [
      "Rate per 10g manual quote",
      "Gross weight, Net weight & Purity (24K/22K/18K/14K)",
      "3% Metal Value + 5% Making Charges tax split",
      "Making charges in Flat ₹ or Percentage (%)",
      "HUID & Hallmark verification tracking",
      "Old Gold exchange deduction line",
    ],
  },
  silver: {
    id: "silver",
    name: "Silver Ornaments & Articles",
    shortLabel: "Silver Articles",
    tagline: "3% Metal / 1.5% Filigree, Making Charges, Hallmark & Exchange",
    iconName: "Gem",
    defaultHsn: "7114",
    defaultTemplateId: "silver-silverline-classic",
    themeColor: "slate",
    badge: "Silversmiths",
    description: "Purpose-built for silver utensils, idols, filigree work, and 925 sterling jewellery shops.",
    features: [
      "Rate per 10g / per kg entry",
      "Purity ratings (999 Fine, 925 Sterling, 900, 800)",
      "Special 1.5% Filigree Work rate toggle",
      "Itemized making charges and hallmark fields",
      "Old Silver exchange deduction",
    ],
  },
  grocery: {
    id: "grocery",
    name: "Grocery & Kirana Store",
    shortLabel: "Grocery / Kirana",
    tagline: "Packaged 5% vs Loose 0%, High Item Repeat, Thermal Receipt 58/80mm",
    iconName: "ShoppingBag",
    defaultHsn: "1006",
    defaultTemplateId: "grocery-kirana-classic",
    themeColor: "emerald",
    badge: "Retail / Kirana",
    description: "Optimized for super-fast counter billing with thermal printer receipts and loose vs packaged grain classification.",
    features: [
      "Packaged vs Loose toggle (0% vs 5% auto-suggestion)",
      "Fast repeat items and unit stepper",
      "58mm & 80mm POS Thermal Receipt layouts",
      "Item-level discounts & bulk quantity handling",
    ],
  },
  general: {
    id: "general",
    name: "General Goods & Services",
    shortLabel: "General / Services",
    tagline: "Multi-Rate GST (0/5/18/40%), HSN/SAC, Shipping, Discounts & PO Ref",
    iconName: "Layers",
    defaultHsn: "8471",
    defaultTemplateId: "general-corporate-clean",
    themeColor: "blue",
    badge: "B2B & B2C",
    description: "Standard GST tax invoice for traders, wholesalers, hardware, electronics, manufacturers, and professional consultants.",
    features: [
      "Multi-rate GST calculation (0%, 5%, 18%, 40% & custom)",
      "Full HSN/SAC code tracking and breakdown table",
      "Discounts, Freight/Shipping charges, and Round-off",
      "Buyer PO references, E-Way bill, and Vehicle numbers",
    ],
  },
};

export const GOLD_PURITIES: GoldPurity[] = [
  "24K (999)",
  "22K (916)",
  "18K (750)",
  "14K (585)",
  "Other",
];

export const SILVER_PURITIES: SilverPurity[] = [
  "999 (Fine Silver)",
  "925 (Sterling)",
  "900 (Coin Silver)",
  "800 (Artisan)",
  "Other",
];

export const GROCERY_UNITS: GroceryUnit[] = [
  "kg",
  "g",
  "L",
  "ml",
  "pcs",
  "packet",
  "box",
  "bag",
  "dozen",
  "can",
];

export const GENERAL_UNITS: GeneralUnit[] = [
  "pcs",
  "box",
  "packet",
  "kg",
  "g",
  "meter",
  "sq_ft",
  "sq_meter",
  "liter",
  "set",
  "hours",
  "days",
  "month",
];
