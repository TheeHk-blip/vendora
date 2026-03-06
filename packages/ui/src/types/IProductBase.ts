export interface IProductBase {  
  _id: string;
  sellerId?: string;
  name?: string;
  price: number;
  description?: string;
  fields?: Record<string, string | number>;
  discount?: number;
  discountedPrice?:number; 
  images: [string];
  featured?: boolean;
}