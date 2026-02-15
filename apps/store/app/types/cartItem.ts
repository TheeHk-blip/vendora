export interface CartItem {
  id: string;
  variantId: string;
  imageUrl?: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
}