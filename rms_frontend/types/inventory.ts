export interface Category {
    id: number;
    name: string;
    description?: string;
    parent?: number;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    tax_number: string | null;
    website: string | null;
    payment_terms: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    description?: string;
    category: number | Category;
    supplier: number | Supplier;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    minimum_stock: number;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductVariation {
    id: number;
    product: number;
    variation_code: string;
    attributes: Record<string, string>;
    price_adjustment: number;
    stock_quantity: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    product: number;
    variation?: number;
    image_url: string;
    is_primary: boolean;
    created_at: string;
}

// DTOs for creating/updating
export interface CreateCategoryDTO {
    name: string;
    description?: string;
    parent?: number;
}

export type CreateSupplierDTO = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSupplierDTO = Partial<CreateSupplierDTO> & { id: number };

export interface CreateProductDTO {
    name: string;
    sku: string;
    barcode?: string;
    description?: string;
    category?: number;
    supplier?: number;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    minimum_stock: number;
    image?: File;
    is_active: boolean;
}

export interface CreateProductVariationDTO {
    product: number;
    variation_code: string;
    attributes: Record<string, string>;
    price_adjustment: number;
    stock_quantity: number;
    is_active: boolean;
}

export interface CreateProductImageDTO {
    product: number;
    variation?: number;
    image: File;
    is_primary: boolean;
}

// Update DTOs extend the Create DTOs with an id
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
    id: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: number;
}

export interface UpdateProductVariationDTO extends Partial<CreateProductVariationDTO> {
    id: number;
}

export interface UpdateProductImageDTO extends Partial<CreateProductImageDTO> {
    id: number;
} 