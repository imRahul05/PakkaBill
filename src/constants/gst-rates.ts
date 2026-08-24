export interface GstRateInfo {
  rate: number;
  label: string;
  description: string;
  category: "nil" | "standard_low" | "standard_high" | "luxury" | "special";
}

export const GST_SLABS_2026: GstRateInfo[] = [
  {
    rate: 0,
    label: "0% (Nil / Exempt)",
    description: "Unbranded/loose grains, fresh fruits & vegetables, fresh milk, unbranded roti, life-saving drugs",
    category: "nil",
  },
  {
    rate: 0.25,
    label: "0.25% (Rough Diamonds)",
    description: "Rough diamonds, unworked precious stones",
    category: "special",
  },
  {
    rate: 1.5,
    label: "1.5% (Filigree / Composition)",
    description: "Silver filigree work (HSN 7113 11 10) and trader composition schemes",
    category: "special",
  },
  {
    rate: 3,
    label: "3% (Gold & Silver Metal)",
    description: "Gold, Silver, Platinum jewellery metal value (HSN 7113, 7108, 7106, 7114)",
    category: "special",
  },
  {
    rate: 5,
    label: "5% (Essential & Making Charges)",
    description: "Packaged foods, branded grocery items, ghee, tea, spices, apparel <₹1000, jewellery making charges",
    category: "standard_low",
  },
  {
    rate: 18,
    label: "18% (Standard Goods & Services)",
    description: "Electronics, mobiles, machinery, IT services, consulting, software, hardware, furniture",
    category: "standard_high",
  },
  {
    rate: 40,
    label: "40% (Sin & Luxury Slabs)",
    description: "Tobacco, aerated/caffeinated drinks, luxury motor vehicles, casinos",
    category: "luxury",
  },
];

export const GST_RATES_2026 = GST_SLABS_2026;

export interface HsnReference {
  hsn: string;
  description: string;
  category: "gold" | "silver" | "grocery" | "general";
  defaultRate: number;
  rate?: number;
  unit?: string;
  notes?: string;
  isPackagedSensitive?: boolean;
}

export const BUNDLED_HSN_DIRECTORY: HsnReference[] = [
  // Gold & Precious Metals
  { hsn: "7113", description: "Articles of jewellery of gold / silver / platinum", category: "gold", defaultRate: 3, rate: 3 },
  { hsn: "7108", description: "Gold, unwrought or in semi-manufactured forms, gold powder, bullion", category: "gold", defaultRate: 3, rate: 3 },
  { hsn: "7118", description: "Coin (Gold / Silver / Commemorative)", category: "gold", defaultRate: 3, rate: 3 },
  { hsn: "998892", description: "Job work / Making charges on gold and precious jewellery", category: "gold", defaultRate: 5, rate: 5 },
  
  // Silver
  { hsn: "7106", description: "Silver, unwrought or semi-manufactured forms, silver bullion", category: "silver", defaultRate: 3, rate: 3 },
  { hsn: "7114", description: "Articles of goldsmiths' or silversmiths' wares (utensils, idols)", category: "silver", defaultRate: 3, rate: 3 },
  { hsn: "71131110", description: "Silver filigree work jewellery", category: "silver", defaultRate: 1.5, rate: 1.5, notes: "Special 1.5% concession rate" },
  
  // Grocery & Food
  { hsn: "1006", description: "Rice (Packaged: 5%, Loose/Unbranded: 0%)", category: "grocery", defaultRate: 5, rate: 5, unit: "kg", isPackagedSensitive: true },
  { hsn: "1001", description: "Wheat and meslin (Packaged: 5%, Loose: 0%)", category: "grocery", defaultRate: 5, rate: 5, unit: "kg", isPackagedSensitive: true },
  { hsn: "1101", description: "Wheat flour (Atta / Maida / Suji) (Packaged: 5%, Loose: 0%)", category: "grocery", defaultRate: 5, rate: 5, unit: "kg", isPackagedSensitive: true },
  { hsn: "0713", description: "Dried leguminous vegetables, Pulses / Dal (Packaged: 5%, Loose: 0%)", category: "grocery", defaultRate: 5, rate: 5, unit: "kg", isPackagedSensitive: true },
  { hsn: "0405", description: "Butter, Ghee and other dairy fats", category: "grocery", defaultRate: 5, rate: 5, unit: "kg" },
  { hsn: "0406", description: "Cheese and Paneer (Packaged)", category: "grocery", defaultRate: 5, rate: 5, unit: "kg", isPackagedSensitive: true },
  { hsn: "0902", description: "Tea, whether or not flavored", category: "grocery", defaultRate: 5, rate: 5, unit: "kg" },
  { hsn: "0901", description: "Coffee, whether or not roasted", category: "grocery", defaultRate: 5, rate: 5, unit: "kg" },
  { hsn: "0904", description: "Pepper, dried or crushed/ground spices", category: "grocery", defaultRate: 5, rate: 5, unit: "kg" },
  { hsn: "1512", description: "Sunflower seed, safflower or cotton-seed cooking oil", category: "grocery", defaultRate: 5, rate: 5, unit: "L" },
  { hsn: "1511", description: "Palm oil and refined edible cooking oil", category: "grocery", defaultRate: 5, rate: 5, unit: "L" },
  { hsn: "1701", description: "Cane or beet sugar and chemically pure sucrose", category: "grocery", defaultRate: 5, rate: 5, unit: "kg" },
  { hsn: "2106", description: "Food preparations, health supplements, namkeen, sweets", category: "grocery", defaultRate: 5, rate: 5, unit: "packet" },
  { hsn: "1905", description: "Bread, pastry, cakes, biscuits and bakery wares", category: "grocery", defaultRate: 5, rate: 5, unit: "packet" },
  { hsn: "3401", description: "Soap, organic surface-active products for bath/washing", category: "grocery", defaultRate: 5, rate: 5, unit: "pcs" },
  { hsn: "3306", description: "Toothpaste, dental hygiene preparations", category: "grocery", defaultRate: 5, unit: "pcs", rate: 5 },
  { hsn: "3305", description: "Shampoo, hair oils and hair care products", category: "grocery", defaultRate: 5, unit: "bottle", rate: 5 },
  
  // General Goods & Services
  { hsn: "8471", description: "Computers, laptops, data processing machines", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "8517", description: "Smartphones, telephones, networking equipment", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "9403", description: "Other furniture and parts thereof (Office/Home)", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "8418", description: "Refrigerators, freezers and other cooling devices", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "8415", description: "Air conditioning machines", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "7318", description: "Screws, bolts, nuts, coach screws, screw hooks (Hardware)", category: "general", defaultRate: 18, unit: "kg", rate: 18 },
  { hsn: "6203", description: "Men's or boys' suits, jackets, blazers, trousers", category: "general", defaultRate: 18, unit: "pcs", rate: 18 },
  { hsn: "998311", description: "Management consulting, professional advisory services", category: "general", defaultRate: 18, unit: "hours", rate: 18 },
  { hsn: "998314", description: "Information technology (IT) consulting and software support", category: "general", defaultRate: 18, unit: "hours", rate: 18 },
  { hsn: "998315", description: "Hosting and information technology infrastructure provisioning", category: "general", defaultRate: 18, unit: "month", rate: 18 },
  { hsn: "9954", description: "General building construction & repair services", category: "general", defaultRate: 18, unit: "sq_ft", rate: 18 },
];

export const HSN_DIRECTORY = BUNDLED_HSN_DIRECTORY;

export const GST_RATE_VERIFICATION_DATE = "August 2026";
export const GST_DISCLAIMER_TEXT =
  "GST rates reflect statutory notifications as of August 2026. Rate suggestions are advisory — please verify applicable HSN and rate before filing returns.";
