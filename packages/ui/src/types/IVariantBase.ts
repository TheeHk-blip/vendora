export interface IVariantBase {
  productId?: string;
  _id: string;
  sku?: string;
  price?: number;
  stock?: number;
  color?: string;
  image?: string;
  attributes?: Record<string, any>;
}