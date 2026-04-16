import Add from "@mui/icons-material/Add";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { connectDB, IProduct, Product } from "@vendora/db/frontend";
import { getServerSession } from "next-auth";
import { authOptions } from "@vendora/auth/src/authoptions";
import { redirect } from "next/navigation";
import StatusTabs from "@vendora/ui/src/components/statusTabs";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { title } from "@vendora/ui/src/primitives";
import { STATUS_COLORS } from "@vendora/ui/src/utilities/statusColor";
import { ObjectId } from "mongoose";

export const metadata: Metadata = {
  title: "Products | Vendora",
  description: "Create, edit and manage products conviniently"
}

interface PageProps {
  searchParams: Promise<{status?: string}>
}

export default async function Products({searchParams}: PageProps) {
  noStore();

  const resolvedParams = await searchParams;
  const status = resolvedParams.status;

  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/signin`);


  const query: Record<string, ObjectId | string>  = {};
  if (status) {
    query.status = status;
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1})
    .lean<IProduct[]>();

  const [liveCount, pendingCount, rejectedCount] = await Promise.all([
    Product.countDocuments({ status: "live"}),
    Product.countDocuments({ status: "pending"}),
    Product.countDocuments({ status: "rejected"})
  ])
  
  return (
    <div className="flex flex-col justify-center w-full max-w-full" >
      <div className="flex flex-row items-center w-full justify-between mx-2">
        <h1 className={title({ color: "foreground"})}>Products</h1>
        <Link 
          href={"/products/category"}
          className="flex gap-1 text-purple-500 bg-purple-400/20 hover:ring rounded-3xl px-3 py-1.5 transition-all duration-200" 
        >
          <Add />
          Category
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 w-full gap-2.5">        
        {products.map((product) => (
          <Link
            key={product._id.toString()}
            href={`/products/${product._id.toString()}`}
            className="w-fit"
          >
            <div 
              key={product._id.toString()}     
              className="flex flex-col rounded-xl bg-black/15 dark:bg-white/15 w-fit"     
            >  
              <div className="flex flex-col">      
                <Image 
                  alt="Product images"
                  src={product.images[0]}
                  width={150}
                  height={150}
                  className="object-contain shadow-sm"
                />       
                <div className="ml-2" >
                  <span className="text-gray-600 dark:text-gray-300 text-medium line-clamp-1" >{product.name}</span>        
                  <PriceDisplay 
                    amount={product.price}
                    className="text-sm"
                  />  
                </div>
              </div>              
              <div className="flex flex-row gap-1.5 ml-2 items-center w-full">
                <span>Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  STATUS_COLORS[product.status ?? ""] || "bg-gray-500/20 text-gray-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>  
          </Link>        
        ))}        
      </div>
    </div>
  )
}