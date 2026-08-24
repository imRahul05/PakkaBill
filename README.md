# PakkaBill — Indian GST Billing & Invoice Generator

> A fast, privacy-first, 100% client-side billing web application designed for Indian shopkeepers, jewellers, kirana stores, and traders to generate professional, GST-compliant invoices in under a minute. Zero login required. No data ever leaves the browser.

---

## ✨ Key Features

### 🏢 4 Dedicated Commerce Categories
* **Gold Jewellery & Bullion**:
  * Dual-weight tracking: Gross Weight vs Net Weight (up to 3 decimal places).
  * Gold purity selection (24K, 22K 916, 20K, 18K 750, 14K, 9K).
  * Dual-tax calculation: Metal Value (3% GST) + Making Charges (5% GST, flat ₹ or % of metal).
  * BIS Hallmark HUID tracking and Old Gold Exchange / Return credit deduction.
* **Silver Articles & Utensils**:
  * Purity grades (999 Fine, 925 Sterling, 900 Coin, 800 Standard).
  * Special Cuttack Filigree work toggle (applying statutory 1.5% GST and HSN `71131110`).
  * Old Silver Return / Exchange credit deduction.
* **Grocery & Kirana**:
  * Loose unbranded vs pre-packaged & labelled toggle (auto 0% exempt vs 5% GST).
  * Metric & volumetric units (`kg`, `g`, `L`, `ml`, `packet`, `piece`, `dozen`, `box`, `bag`).
  * 1-Click Fast Counter Add presets for common staples (Atta, Rice, Ghee, Sugar, Oil, Salt, Dal).
* **General Goods & Services**:
  * Standard HSN / SAC code lookup.
  * 2026 GST 2.0 slabs (0%, 0.1%, 1.5%, 3%, 5%, 12%, 18%, 28%).
  * Percentage and flat discount calculations.

---

### 📄 40 Print-Ready Templates (10 per Category)
* **Gold (10)**: `Classic Jewellers`, `Royal Zari`, `Minimal Karat`, `Hallmark Ledger`, `Vintage Ornate`, `Modern Boutique`, `Temple Gold`, `Bridal Collection`, `Bullion Simple`, `Compact Counter`.
* **Silver (10)**: `Silverline Classic`, `Filigree Frame`, `Modern Mint`, `Ledger Pure`, `Temple Silver`, `Rustic Artisan`, `Coin & Bar`, `Minimal Sterling`, `Boutique Silver`, `Compact Counter`.
* **Grocery (10)**: `Kirana Classic`, `Fresh Mart`, `80mm Thermal POS Roll`, `58mm Thermal POS Roll`, `Wholesale Ledger`, `Daily Needs`, `Farm Fresh`, `Mini Mart Compact`, `Bazaar Bold`, `Super Saver`.
* **General (10)**: `Corporate Clean`, `Minimal Mono`, `Bold Header`, `Classic Ledger`, `Modern Grid`, `Freelancer Simple`, `Trade Invoice`, `Service Pro`, `Two-Tone Tax`, `Compact A5`.

---

### 🛡️ Real-Time Rule 46 GST Compliance Engine
* Live advisory checklist checking statutory invoice essentials:
  * 15-character Seller GSTIN validation with state jurisdiction code check.
  * B2B Buyer GSTIN validation.
  * Unique sequential invoice numbering (max 16 characters).
  * Intra-State (CGST + SGST 50/50 split) vs Inter-State (IGST full rate) tax determination.
  * Reverse Charge Mechanism (RCM) declaration.
  * Mandatory PAN notice for high-value transactions (> ₹2,00,000).
  * Amount in Words generated using the Indian numbering system (Lakhs & Crores).

---

### 🔒 100% Client-Side Privacy & Storage
* **Zero Server Storage**: Everything is processed in the client's browser.
* **LocalStorage**: Remembers your business profile, first-run preferences, and auto-saves the active draft.
* **IndexedDB**:
  * Stores the last 10 bills history with automatic FIFO eviction notices.
  * Reusable bill preset templates.
* **Data Portability**: 1-Click JSON backup export and full database restore.
* **Payment Ready**: Live scannable UPI QR codes generated dynamically on every invoice.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, zero `any` / `unknown`)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **UI Components**: Headless primitives & Lucide Icons
* **PDF & Printing**: `jspdf` + `html2canvas` and CSS `@media print` engine
* **Validation**: Zod & custom Indian statutory validators

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v20 or higher recommended)
* [pnpm](https://pnpm.io/) (or npm / yarn)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/imRahul05/PakkaBill.git
   cd local-billing-app
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the local development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts local Next.js development server with Turbopack |
| `pnpm build` | Compiles optimized static production build |
| `pnpm start` | Serves the production build locally |
| `pnpm run lint` | Runs ESLint checks (strict 0-error policy) |
| `pnpm exec tsc --noEmit` | Runs full TypeScript compiler type check |

---

## 📂 Project Structure

```
├── src/
│   ├── app/                      # Next.js 16 App Router & globals.css
│   ├── components/
│   │   ├── gallery/              # Template gallery & live rendered thumbnails
│   │   ├── history/              # IndexedDB bill history drawer & cards
│   │   ├── layout/               # Header, mobile navigation & footer
│   │   ├── modals/               # Profile, preview, presets, HSN search & import/export modals
│   │   ├── sidebar/              # Quick financial summary, compliance checklist & action buttons
│   │   ├── tabs/                 # Tabbed editors (Seller, Buyer, Invoice, Items, Other)
│   │   │   └── items/            # Category-aware item editors (Gold, Silver, Grocery, General)
│   │   ├── templates/            # 40 print-ready invoice templates (10 per category)
│   │   │   ├── general/
│   │   │   ├── gold/
│   │   │   ├── grocery/
│   │   │   ├── silver/
│   │   │   └── shared/           # Shared print headers, tax tables, UPI QR & signatures
│   │   └── ui/                   # Reusable UI primitives (Button, Input, Select, Dialog, Card, etc.)
│   ├── constants/                # Categories, 2026 GST slabs, HSN directory, states & templates
│   ├── hooks/                    # Custom React hooks (useInvoiceState, useBusinessProfile, useBillHistory, etc.)
│   ├── lib/
│   │   ├── calculations/         # Category tax logic, metal values & financial summaries
│   │   ├── formatters/           # Indian currency (₹), date-time & gram weights
│   │   ├── pdf/                  # Vector PDF export & thermal print triggers
│   │   ├── qr/                   # UPI payment QR string & canvas generator
│   │   ├── storage/              # LocalStorage, IndexedDB & JSON backup engine
│   │   └── validators/           # GSTIN, PAN & Rule 46 compliance checks
│   └── types/                    # Strict TypeScript interfaces and type definitions
```

---

## 🔐 Privacy & Security

PakkaBill operates entirely on the client side:
* **No Database Server**: Customer details, prices, and bills never touch any backend server.
* **No Tracking**: No third-party tracking cookies or advertising scripts.
* **Offline Compatible**: Works seamlessly offline once loaded in the browser.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
