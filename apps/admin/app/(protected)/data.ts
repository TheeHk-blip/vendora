import { connectDB, getDetailedOrders, IOrder, Order, TransformedOrderItem, transformOrderData, User } from "@vendora/db/frontend";
import { SerializeData } from "@vendora/ui";

const calculateTrend = (c: number, p: number) => p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / p) * 100);
export type TimeRange = "1wk" | "30d" | "90d" | "all";

export async function TUsers() {
  await connectDB()

  const totalUsers = await User.countDocuments();
  return totalUsers;
}

export async function PlatformStats(range: TimeRange = "30d") {
  await connectDB();

  const now = new Date();
  let currentStart = new Date(now);
  let previousStart = new Date(now);
  const isAllTime = range === "all";

  if (range === "1wk") {
    currentStart.setDate(now.getDate() - 7);
    previousStart.setDate(now.getDate() - 14);
  } else if (range === "90d") {
    currentStart.setDate(now.getDate() - 90);
    previousStart.setDate(now.getDate() - 180);
  } else if (range === "all") {
    currentStart = new Date(0);
    previousStart = new Date(0);
  } else {
    currentStart.setDate(now.getDate() - 30);
    previousStart.setDate(now.getDate() - 60);
  };

  const metricsMatchStage = isAllTime
    ? { status: "delivered" }
    : { createdAt: { $gte: previousStart }, status: "delivered" };

  const metrics = await Order.aggregate([
    { $match: metricsMatchStage},
    {
      $facet: {
        current: [
          { $match: { createdAt: { $gte: currentStart } }},
          { $group: {
              _id: null,
              platformRevenue: { $sum: "$financials.platformRevenue" },   
              totalRevenue: { $sum: "$financials.totalProductValue"}
          }},
          { $project: { platformRevenue: 1, totalRevenue: 1 }}
        ],
        previous: isAllTime ? [ { $project: { platformRevenue: { $literal: 0 }, totalRevenue: { $literal: 0 }}}] : [
          { $match: { createdAt: { $gte: previousStart, $lt: currentStart }}},
          { $group: {
              _id: null,
              platformRevenue: { $sum: "$financials.platformRevenue" },      
              totalRevenue: { $sum: "$financials.totalProductValue" }                        
          }},
          { $project: { platformRevenue: 1, totalRevenue: 1 }}
        ],
        chart: [
          { $match: { createdAt: { $gte: currentStart } }},
          { $group: {
            _id: { $dateToString: { format: "%d %b %Y", date: "$createdAt" }},
            totalRevenue: { $sum: "$financials.totalProductValue" },
            platformRevenue: { $sum: "$financials.platformRevenue"}
          }},
          { $sort: { "_id": 1 }},
          { $project: { date: "$_id", totalRevenue: 1, platformRevenue: 1, _id: 0 }}
        ],
      }
    }
  ]);

  const recentOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: currentStart }}},
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
  ]);

  const userMatchStage = isAllTime ? {} : { createdAt: { $gte: previousStart }};
  const userStats = await User.aggregate([
    { $match: userMatchStage },
    {
      $facet: {
        current: [
          { $match: { createdAt: { $gte: currentStart } }},
          { $count: "count" }
        ],
        previous: isAllTime ? [ { $project: { count: { $literal: 0 } }}] : [
          { $match: { createdAt: { $gte: previousStart, $lt: currentStart } }},
          { $count: "count" }
        ],
        chart: [
          { $match: { createdAt: { $gte: currentStart } }},
          {  $group: {
            _id: { $dateToString: { format: "%d %b %Y", date: "$createdAt" }},
            count: { $sum: 1 }
          }},
          { $sort: { "_id": 1 }},
          { $project: { date: "$_id", count: 1, _id: 0 }}
        ],
        recentUsers: [
          { $sort: { createdAt: -1 }},
          { $limit: 10 },
          { $project: { name: 1, email: 1, createdAt: 1, role: 1 }}
        ],
        buyers: [
          { $match: { role: "buyer" }},
          { $count: "count" }
        ],
        sellers: [
          { $match:{ role: "seller" }},
          { $count: "count" }
        ]       
      }
    }
  ]);

  const currUsers = userStats[0]?.current[0]?.count || 0;
  const prevUsers = userStats[0]?.previous[0]?.count || 0;

  const currPlatformFinances = metrics[0]?.current[0] || { platformRevenue: 0 };
  const prevPlatformFinances = metrics[0]?.previous[0] || { platformRevenue: 0 };

  const currTotalFinances = metrics[0]?.current[0] || { totalRevenue: 0 };
  const prevTotalFinances = metrics[0]?.previous[0] || { totalRevenue: 0 };
  const chartData = metrics[0]?.chart || [];

  const rawOrders = await getDetailedOrders({});
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

  return {
    orders,
    chartData,
    recentOrdersData: SerializeData(recentOrdersData),
    monthlyTrend: calculateTrend(currUsers, prevUsers),
    buyers: userStats[0].buyers[0]?.count || 0,
    sellers: userStats[0].sellers[0]?.count || 0,
    platformRevenue: Number(currPlatformFinances.platformRevenue),
    prevPlatformRevenue: Number(prevPlatformFinances.platformRevenue),
    totalRevenue: Number(currTotalFinances.totalRevenue),
    prevTotalRevenue: Number(prevTotalFinances.totalRevenue),
    totalRevenueTrend: isAllTime ? 0 : calculateTrend(currTotalFinances?.totalRevenue, prevTotalFinances?.totalRevenue),
    platformRevenueTrend: isAllTime ? 0 : calculateTrend(currPlatformFinances?.platformRevenue, prevPlatformFinances?.platformRevenue)
  }
}