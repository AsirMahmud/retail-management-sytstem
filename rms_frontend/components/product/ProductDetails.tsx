"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    description: string;
    sku: string;
    barcode: string;
    cost_price: string;
    selling_price: string;
    stock_quantity: number;
    minimum_stock: number;
    total_stock: number;
    category_name: string | null;
    supplier_name: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    image: string | null;
    images: string[];
    variations: any[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
          </div>
          <Badge variant={product.is_active ? "default" : "secondary"}>
            {product.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Product Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">{product.barcode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">
                    {product.category_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">
                    {product.supplier_name || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cost Price</p>
                  <p className="font-medium">${product.cost_price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  <p className="font-medium">${product.selling_price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="font-medium">
                    {(
                      ((parseFloat(product.selling_price) -
                        parseFloat(product.cost_price)) /
                        parseFloat(product.cost_price)) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Stock Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-medium">{product.stock_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="font-medium">{product.total_stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                  <p className="font-medium">{product.minimum_stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Status</p>
                  <Badge
                    variant={
                      product.stock_quantity > product.minimum_stock
                        ? "default"
                        : "destructive"
                    }
                  >
                    {product.stock_quantity > product.minimum_stock
                      ? "In Stock"
                      : "Low Stock"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {(product.image || product.images.length > 0) && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(() => {
              // Collect all images: main image first, then additional images
              const allImages: string[] = []
              if (product.image) allImages.push(product.image)
              if (product.images.length > 0) allImages.push(...product.images)

              // Reorder: if 4 or more, move 1st (index 0) to last
              if (allImages.length >= 4) {
                const first = allImages.shift()
                if (first) allImages.push(first)
              }

              return allImages.map((img, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))
            })()}
          </div>
        </Card>
      )}

      {product.variations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Product Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.variations.map((variation, index) => (
              <div key={index} className="p-4 border rounded-lg">
                {/* Render variation details here */}
                <pre className="text-sm">
                  {JSON.stringify(variation, null, 2)}
                </pre>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    const labelWindow = window.open(
                      "",
                      "_blank",
                      "width=220,height=120"
                    );
                    if (!labelWindow) return;
                    const style = `
                      <style>
                        body { margin: 0; padding: 0; }
                        .label {
                          width: 57mm;
                          height: 30mm;
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                          font-family: Arial, sans-serif;
                          font-size: 14px;
                          border: 1px dashed #333;
                          box-sizing: border-box;
                        }
                        .sku { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
                        .price { font-size: 16px; margin-bottom: 4px; }
                        .size { font-size: 14px; }
                      </style>
                    `;
                    const sku = variation.sku || product.sku;
                    const price = variation.price || product.selling_price;
                    const size =
                      variation.size ||
                      variation.size_name ||
                      variation.Size ||
                      "";
                    labelWindow.document.write(`
                      <html><head><title>Print Label</title>${style}</head><body>
                        <div class="label">
                          <div class="sku">SKU: ${sku}</div>
                          <div class="price">Price: $${price}</div>
                          <div class="size">Size: ${size}</div>
                        </div>
                        <script>window.onload = function() { window.print(); window.onafterprint = window.close; }<\/script>
                      </body></html>
                    `);
                    labelWindow.document.close();
                  }}
                >
                  Print Label
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
