import { authOptions } from "@vendora/auth";
import { getDetailedOrders, IOrder, ISeller, Order, Review, Seller, TransformedOrderItem, transformOrderData } from "@vendora/db/frontend";
import { SerializeData } from "@vendora/ui";
import { getServerSession } from "next-auth";

export interface ChartDataPoint {
  date: string;
  revenue: number;
}

export async function getSellerStats() {
  const session = await getServerSession(authOptions);
  const sessionId = session?.user._id;
  const seller = await Seller.findOne({ userId: sessionId }).lean<ISeller>();
  const sellerId = seller?._id;
  
  const now = new Date();
  const thirtyDaysAgo = new Date; thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date; sixtyDaysAgo.setDate(now.getDate() - 60);

  const metrics = await Order.aggregate([
    { $match: { "items.seller.sellerId": sellerId, createdAt: { $gte: sixtyDaysAgo}}},
    {
      $facet: {
        current: [
          { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "delivered" }},
          { $group: {
              _id: null,
              revenue: { $sum: "$financials.sellerPayout" },
              customers: { $addToSet: "$buyer.buyerId" },              
          }},
          { $project: { revenue: 1, count: { $size: "$customers" }}}
        ],
        previous: [
          { $match: { createdAt: { $lt: thirtyDaysAgo }, status: "delivered" }},
          { $group: {
            _id: null,
            revenue: { $sum: "financials.sellerPayout" },
            customers: { $addToSet: "$buyer.buyerId" }
          }},
        ],
        chart: [
          { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "delivered" }},
          { $group: {
            _id: { $dateToString: { format: "%d %b %Y", date: "$createdAt" }},
            revenue: { $sum: "$financials.sellerPayout" }
          }},
          { $sort: { "_id": 1 }},
          { $project: { date: "$_id", revenue: 1, _id: 0 }}
        ],
      }
    }
  ]);

  const recentOrders = await Order.aggregate([
    { $match: { "items.seller.sellerId": sellerId, createdAt: { $gte: thirtyDaysAgo }}},
    { $sort: { createdAt: -1 }},
    { $limit: 10 },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "variants",
        localField: "items.variantId",
        foreignField: "_id",
        as: "variantData"
      }
    },
    { $unwind: "$variantData" },
    {
      $lookup: {
        from: "products",
        localField: "variantData.productId",
        foreignField: "_id",
        as: "productData"
      }
    },
    { $unwind: "$productData" },          
    { $project: { 
        orderNumber: 1, 
        buyer: "$buyer.name", 
        productName: "$productData.name", 
        sku: "$variantData.sku", 
        status: 1, 
        createdAt: 1, 
        orderAmount: "$items.price" 
    }}
  ])

  const reviewResults = await Review.aggregate([
    { $match: { sellerId: sellerId, createdAt: { $gte: sixtyDaysAgo } }},
    { $facet: {
      current: [
        { $match: { createdAt: { $gte: thirtyDaysAgo }}},
        { $count: "count"}
      ],
      previous: [
        { $match: { createdAt: { $lt: thirtyDaysAgo }}},
        { $count: "count"}
      ]
    }}
  ]);

  const currRevenue = metrics[0].current[0] || { revenue: 0 };
  const prevRevenue = metrics[0].previous[0] || { revenue: 0 };
  const currCustomerCount = metrics[0].current[0] || { count: 0};
  const prevCustomerCount = metrics[0].previous[0] || { count: 0 };
  const currReview = reviewResults[0].current[0]?.count || 0;
  const prevReview = reviewResults[0].previous[0]?.count || 0;
  const chartData = metrics[0].chart || [];

  const calculateTrend = (c: number, p: number) => p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / p) * 100);

  const rawOrders = await getDetailedOrders({ "items.seller.sellerId": seller?._id});
  const orders: TransformedOrderItem[] = transformOrderData(SerializeData(rawOrders), false);  
  const recentOrdersData = recentOrders.map((order: IOrder) => ({
    ...order,
    date: new Date(order.createdAt).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      minute: "2-digit",
      hour: "2-digit",
      hour12: false
    })
  }));

  const rating = seller?.averageRating;
  const totalReviews = seller?.totalReviews;

  return {
    totalRevenue: currRevenue.revenue,
    revenueTrend: calculateTrend(currRevenue.revenue, prevRevenue.revenue),
    chartData,
    orders,
    customers: currCustomerCount.count,
    customerTrend: calculateTrend(currCustomerCount.count, prevCustomerCount.count),
    rating,
    totalReviews, 
    reviewTrend: calculateTrend(currReview, prevReview),
    recentOrdersData: SerializeData(recentOrdersData)
  }
}