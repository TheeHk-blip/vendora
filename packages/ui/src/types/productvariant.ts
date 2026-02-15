export interface ProductVariant {
  id: string;
  attributes: Record<string, string>;
  sku: string;
  price: string;
  stock: string;
  color: string;
  image: File[];
}