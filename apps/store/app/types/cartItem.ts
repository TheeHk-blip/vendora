export interface CartItem {
  id: string;
  sellerInfo?: {
    _id: string;
    businessName: string;
    rating: number;
  };
  variantId: string;
  imageUrl?: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
}