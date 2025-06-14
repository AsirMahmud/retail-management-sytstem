import { z } from "zod";

export const supplierSchema = z.object({
    company_name: z.string().min(2, "Company name must be at least 2 characters").optional().or(z.literal("")),
    contact_person: z.string().min(2, "Contact person must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address must be at least 5 characters").optional().or(z.literal("")),
    tax_number: z.string().optional().or(z.literal("")),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
    payment_terms: z.string().optional().or(z.literal("")),
    is_active: z.boolean().default(true),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>; 