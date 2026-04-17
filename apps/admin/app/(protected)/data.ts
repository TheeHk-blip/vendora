import { connectDB, getDetailedOrders, IOrder, Order, TransformedOrderItem, transformOrderData, User } from "@vendora/db/frontend";
import { SerializeData } from "@vendora/ui";

const calculateTrend = (c: number, p: number) => p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / p) * 100);

export async function TUsers() {
  await connectDB()

  const totalUsers = await User.countDocuments();
  return totalUsers;
}

export async function PlatformStats() {
  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [userStats, order] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo } }},
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } }},
            { $count: "count" }
          ],
          previous: [
            { $match: { createdAt: { $lt: thirtyDaysAgo } }},
            { $count: "count" }
          ],
          chart: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } }},
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
            { $match: { createdAt: { $gte: thirtyDaysAgo }, role: "buyer" }},
            { $count: "count" }
          ],
          sellers: [
            { $match: { createdAt: { $gte: thirtyDaysAgo }, role: "seller" }},
            { $count: "count" }
          ]       
        }
      }
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo } }},
      {
        $facet: {
          current: [
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "delivered" }},
            { $group: {
                _id: null,
                platformRevenue: { $sum: "$financials.platformRevenue" },   
                totalRevenue: { $sum: "$financials.totalProductValue"}
            }},
            { $project: { platformRevenue: 1, totalRevenue: 1 }}
          ],
          previous: [
            { $match: { createdAt: { $lt: sixtyDaysAgo }, status: "delivered" }},
            { $group: {
                _id: null,
                platformRevenue: { $sum: "$financials.platformRevenue" },      
                totalRevenue: { $sum: "$financials.totalProductRevenue" }                        
            }},
            { $project: { platformRevenue: 1, totalRevenue: 1 }}
          ],
          chart: [
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "delivered" }},
            { $group: {
              _id: { $dateToString: { format: "%d %b %Y", date: "$createdAt" }},
              totalRevenue: { $sum: "$financials.totalProductValue" },
              platformRevenue: { $sum: "$financials.platformRevenue"}
            }},
            { $sort: { "_id": 1 }},
            { $project: { date: "$_id", totalRevenue: 1, platformRevenue: 1, _id: 0 }}
          ],
          recentOrders: [
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
          ],  
        }
      }
    ])
  ])

  const currUsers = userStats[0].current[0]?.count || 0;
  const prevUsers = userStats[0].previous[0]?.count || 0;
  const currPlatformFinances = order[0].current[0] || { PlatformRevenue: 0 };
  const prevPlatformFinances = order[0].previous[0] || { platformRevenue: 0 };
  const currTotalFinances = order[0]?.current[0] || { totalRevenue: 0 };
  const prevTotalFinances = order[0]?.previous[0] || { totalRevenue: 0 };
  const chartData = order[0]?.chart || [];

  const rawOrders = await getDetailedOrders({});
  const orders: TransformedOrderItem[] = transformOrderData(SerializeData(rawOrders), false);
  const recentOrdersData = order[0].recentOrders.map((order: IOrder) => ({
    ...order,
    date: new Date(order.createdAt).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      minute: "2-digit",
      hour: "2-digit",
      hour12: false
    })
  }))

  return {
    orders,
    chartData,
    recentOrdersData: SerializeData(recentOrdersData),
    monthlyTrend: calculateTrend(currUsers, prevUsers),
    buyers: userStats[0].buyers[0].count || 0,
    sellers: userStats[0].sellers[0].count || 0,
    platformRevenue: currPlatformFinances.platformRevenue,
    totalRevenue: currTotalFinances.totalRevenue,
    totalRevenueTrend: calculateTrend(currTotalFinances?.totalRevenue, prevTotalFinances?.totalRevenue),
    platformRevenueTrend: calculateTrend(currPlatformFinances?.platformRevenue, prevPlatformFinances?.platformRevenue)
  }
}