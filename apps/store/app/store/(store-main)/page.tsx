import { connectDB } from "@vendora/db/src/connection/client";
import Product from "@vendora/db/src/models/product";
import ProductCard from "./components/productCard";
import { SerializeData } from "@vendora/ui/src/utilities/serialize";
import { Suspense } from "react";
import ProductFilter from "./components/productFilter";
import { getStoreData } from "./components/getProducts";
import mongoose from "mongoose";
import Category from "@vendora/db/src/models/category";
import { BreadCrumbs } from "./components/breadCrumbs";

async function getCategoryBranch(categoryId: string): Promise<mongoose.Types.ObjectId[]> {
  const children = await Category.find({ parentId: categoryId }).select("_id").lean();
  let ids = [new mongoose.Types.ObjectId(categoryId)];

  if (children.length > 0) {
    const childIds = await Promise.all(
      children.map((child) => getCategoryBranch(SerializeData(child._id)))
    );
    ids = ids.concat(childIds.flat());
  }
  return ids;
}

async function getProducts({searchParams}: {searchParams: Promise<{q?: string, categoryId?: string}>}) {
  const { q: query, categoryId } = await searchParams;
  await connectDB();

  let categoryIds: mongoose.Types.ObjectId[] = [];
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    categoryIds = await getCategoryBranch(categoryId);
  }

  if (query) {
    const searchStages: any[] = [
      {
        $search: {
          index: "products",
          compound: {
            must: [
              {
                text: {
                  query: query,
                  path: ["name", "description", "brand"],
                  fuzzy: { maxEdits: 2, prefixLength: 2}
                }
              }
            ],
                // use "filter" inside $search for strict category matching
            ...(categoryId && {
              filter: [{
                equals: {
                  path: "categoryId",
                  value: new mongoose.Types.ObjectId(categoryId)
                }
              }]
            })
          }
        }
      },
      { $match: { status: "live" }},
      { $limit: 40}
    ];

    const products = await Product.aggregate(searchStages);
    return products.map(p => SerializeData(p));
  }

  const filter: any = { status: "live" };
  if (categoryIds.length > 0) {
    filter.categoryId = { $in: categoryIds };
  }
  
  const products = await Product.find(filter)
    .sort({ createdAt: -1})
    .limit(40)
    .lean();

  return products.map(p => SerializeData(p));
}

export default async function Store({searchParams}: { searchParams: Promise<{ q?: string, categoryId: string}>}) {
  await connectDB();
  const products = await getProducts({ searchParams });
  const dynamicData = await getStoreData({ searchParams });
  return (  
    <div className="flex flex-row max-w-7xl mx-auto w-full gap-2.5">
      <aside className="hidden sm:flex w-[250px] shrink-0">
        <ProductFilter dynamicData={dynamicData}/>
      </aside>
      <div className="flex flex-col" >
        <BreadCrumbs crumbs={dynamicData.breadCrumbs} />
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {products.length > 0 ? (
            products.map((product, index) => (      
              <Suspense
                key={product._id}
                fallback={<div className="animate-pulse bg-gray-500 gap-2 w-[150px] h-[150px]"></div>}
              >
                <ProductCard 
                  key={product._id}
                  product={product} 
                  index={index} 
                />
              </Suspense>                                   
            ))        
          ):(
            <div className="col-span-full py-10 text-center text-gray-500" >
              No product found for that search
            </div>
          )}               
        </div>
      </div>
    </div>
  )
}