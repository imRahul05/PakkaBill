import { z } from "zod";
import { GSTIN_REGEX, PAN_REGEX } from "./gstin";

export const AddressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  stateCode: z.string().length(2, "State code must be 2 digits"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
});

export const BankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().min(1, "IFSC code is required"),
  branchName: z.string().optional(),
  accountHolderName: z.string().optional(),
});

export const SellerProfileSchema = z.object({
  legalName: z.string().min(1, "Seller legal name is required"),
  tradeName: z.string().min(1, "Seller trade name is required"),
  gstin: z.string().regex(GSTIN_REGEX, "Valid 15-character GSTIN is required"),
  pan: z.string().regex(PAN_REGEX, "Valid 10-character PAN is required"),
  address: AddressSchema,
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  website: z.string().optional(),
  logoBase64: z.string().optional(),
  signatureBase64: z.string().optional(),
  signatureText: z.string().optional(),
  bankDetails: BankDetailsSchema.optional(),
  upiId: z.string().optional(),
  lutNumber: z.string().optional(),
  compositionScheme: z.boolean().default(false),
});

export const BuyerDetailsSchema = z.object({
  name: z.string().min(1, "Buyer name is required"),
  tradeName: z.string().optional(),
  gstin: z.string().regex(GSTIN_REGEX, "Invalid GSTIN").optional().or(z.literal("")),
  pan: z.string().regex(PAN_REGEX, "Invalid PAN").optional().or(z.literal("")),
  address: AddressSchema,
  placeOfSupply: z.string().min(1, "Place of supply is required"),
  placeOfSupplyCode: z.string().length(2, "Place of supply code must be 2 digits"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const InvoiceMetadataSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required").max(16, "Max 16 characters"),
  invoiceDate: z.string().min(10, "Invoice date is required"),
  dueDate: z.string().optional(),
  invoiceType: z.enum([
    "tax_invoice",
    "bill_of_supply",
    "cash_memo",
    "proforma_invoice",
    "quotation",
    "estimate",
    "delivery_challan",
  ]),
  reverseCharge: z.boolean().default(false),
  poNumber: z.string().optional(),
  poDate: z.string().optional(),
  vehicleNumber: z.string().optional(),
  eWayBillNumber: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.array(z.string()).optional(),
});
