# Ecommerce API Integration

This document describes the API integration for the ecommerce frontend.

## Environment Setup

Create a `.env.local` file in the `rms_ecom` directory with:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Endpoints Used

### Product Showcase APIs
- `GET /api/inventory/products/showcase/` - Get all showcase data (new arrivals, top selling, featured)
- `GET /api/inventory/products/new_arrivals/` - Get new arrival products
- `GET /api/inventory/products/top_selling/` - Get top selling products
- `GET /api/inventory/products/featured/` - Get featured products
- `GET /api/inventory/products/{id}/showcase_detail/` - Get detailed product information

### Category APIs
- `GET /api/inventory/online-categories/` - Get online categories

## Features Implemented

1. **Online Product Filter**: Only products with `assign_to_online=true` are displayed
2. **Image Order**: Products display images in order: primary, secondary, third, fourth
3. **Dynamic Data**: All product data is fetched from the backend API
4. **Category Pages**: Dynamic category pages that fetch products by online category
5. **Product Details**: Detailed product pages with all product information

## Pages Updated

- `app/page.tsx` - Homepage with showcase data
- `app/product/[id]/page.tsx` - Product detail page
- `app/category/[slug]/page.tsx` - Category page
- `components/product-grid.tsx` - Product grid component

## Data Flow

1. Backend APIs filter products by `assign_to_online=true`
2. Frontend fetches data using `ecommerceApi` functions
3. Data is transformed to match component interfaces
4. Images are displayed in the correct order (primary, secondary, third, fourth)
5. Products are displayed with proper categorization and filtering
