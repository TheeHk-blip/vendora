import User from "@vendora/db/src/models/user";
import { connectDB } from "@vendora/db";

export  async function TotalUsers() {
  await connectDB();

  let totalUsers = 0;
  totalUsers = await User.countDocuments().exec();
  return(
    totalUsers
  )
};

export async function WeeklyUserStats() {
  await connectDB();

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const thisWeekCount = await User.countDocuments({
    createdAt: { $gte: oneWeekAgo, $lte: now }
  });

  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const lastWeekCount = await User.countDocuments({
    createdAt: { $gte: twoWeeksAgo, $lte: oneWeekAgo }
  });

  const growth = lastWeekCount === 0
  ? (thisWeekCount > 0 ? 100 : 0)
  : ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;

  return growth;
}