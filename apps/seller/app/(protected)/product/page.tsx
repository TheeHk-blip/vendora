import Add from "@mui/icons-material/Add";
import { authOptions } from "@vendora/auth/src/authoptions";
import { IProduct, Product, connectDB } from "@vendora/db/frontend";

import StatusTabs from "@vendora/ui/src/components/statusTabs";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { Types } from "mongoose";
import { title } from "@vendora/ui/src/primitives";
import { ProductCard } from "./components/productcard";

interface PageProps {
  searchParams: Promise<{ status?: string}>;
}

export default async function Products({searchParams}: PageProps) {  
  noStore();

  const resolvedParams = await searchParams;
  const status = resolvedParams.status;

  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);

  const sellerId = session.user._id;
  
  const query: Record<string, string | Types.ObjectId> = {
    sellerId: new Types.ObjectId(sellerId)
  };
  if (status) {
    query.status = status;
  }

  const products = await Product.find(query)
  .sort({ createdAt: -1})
  .lean<IProduct[]>();

  const [liveCount, pendingCount, rejectedCount] = await Promise.all ([
    Product.countDocuments({sellerId, status: "live"}),
    Product.countDocuments({sellerId, status: "pending"}),
    Product.countDocuments({sellerId, status: "rejected"})
  ])

  return(
    <main className="flex justify-center max-w-full">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <h1 className={title({ color: "foreground" })}>Products</h1>
          <Link
            href={"/product/upload"}
            className="flex h-fit items-center gap-1 rounded-xl px-2 py-1 hover:ring text-purple-600 bg-purple-400/20 transition-all"
          >
            <Add />
            Product
          </Link>      
        </div>        
        <div className="mb-2.5">
          <StatusTabs             
            paramName="status"
            tabs={[                
              { label: "Approved", value: "live", count: liveCount },
              { label: "Pending Approval", value: "pending", count: pendingCount },                           
              { label: "Rejected", value: "rejected", count: rejectedCount }
            ]}
          />
        </div>
        <ProductCard products={products} />     
      </div>
    </main>
  )
}