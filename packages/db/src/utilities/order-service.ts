import Order, {IOrder}  from "@db/models/order";

interface PopulatedVariant {
  sku: string;
  productId: {
    name: string,
    _id: string;
  }
}

export interface TransformedOrderItem {
  orderNumber: string;
  buyer: string;
  productName: string;
  sku: string;
  orderAmount: number;
  status: "awaitingCommitment" | "awaitingDispatch" | "inTransit" | "delivered" | "rejected";
  date: string;
  createdAt: Date | string; 
  sellerId?: string;
}

export const getDetailedOrders = async (query: object = {}) => {
  return await Order.find(query)
    .select("orderNumber buyer financials status createdAt items")
    .populate([
      {
        path: "items.variantId",
        model: "Variant",
        select: "sku productId",
        populate: {
          path: "productId",
          model: "Product",
          select: "name",
        }
      }
    ])
    .sort({ createdAt: -1 })
    .lean<IOrder>();
};

export const transformOrderData = (orders: IOrder[], includeTime = true) => {
  if (!orders) return [];

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit", hour12: false })
  };
  
  return orders.flatMap((order: IOrder) => 
    order.items.map((item) => {
      const variant = item.variantId as unknown as PopulatedVariant;
      const product = variant?.productId;

      return {
        orderNumber: order.orderNumber,
        buyer: order.buyer.name,
        productName: product.name,
        sku: variant.sku,
        orderAmount: item.seller.sellerPayout,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString("en-KE", dateOptions),
        createdAt: order.createdAt
      }
    })
  )
}