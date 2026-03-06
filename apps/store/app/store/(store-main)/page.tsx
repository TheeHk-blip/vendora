import ProductCard from "./components/productCard";
import { Suspense } from "react";
import ProductFilter from "./components/productFilter";
import { getStoreData } from "./components/getProducts";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { BreadCrumbs } from "./components/breadCrumbs";
import { MobileFilter } from "./components/mobileFilter";
import { SerializeData } from "@vendora/ui";
import { Product, Category, connectDB, LeanArray, type IProduct } from "@vendora/db";


type Params = Promise<{
  q?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

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

async function getProducts({searchParams}: {searchParams: Params}) {
  const { q: query, categoryId, brand, minPrice, maxPrice } = await searchParams;
  await connectDB();

  const brandList = brand ? brand.split(",") : [];
  let categoryIds: mongoose.Types.ObjectId[] = [];
  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    categoryIds = await getCategoryBranch(categoryId);
  }

  if (query) {
    const searchStages: PipelineStage[] = [
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
            filter: [
              ...(categoryId ? [{
                equals: {
                  path: "categoryId",
                  value: new mongoose.Types.ObjectId(categoryId)
                }
              }]: []),
              ...(brandList.length > 0 ? [{
                in: {
                  path: "fields.brand",
                  value: brandList
                }
              }] : [])
            ]           
          }
        }
      },
      { $match: { status: "live" }},
      { $limit: 40}
    ];

    const products: LeanArray<IProduct> = await Product.aggregate(searchStages);
    return products.map(p => SerializeData(p));
  }

  const filter: FilterQuery<IProduct> = { status: "live" };
  if (categoryIds.length > 0) {
    filter.categoryId = { $in: categoryIds };
  }

  if (brandList.length > 0) {
    filter["fields.brand"] = { $in: brandList };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (query) {
    const searchFilter = [];
    if (minPrice || maxPrice) {
      searchFilter.push({
        range: {
          path: "price",
          gte: Number(minPrice),
          lte: Number(maxPrice)
        }
      });
    }
  }
  
  const products = await Product.find(filter)
    .sort({ createdAt: -1})
    .limit(40)
    .lean();

  return products.map(p => SerializeData(p));
}

export default async function Store({searchParams}: { searchParams: Params}) {
  await connectDB();
  const products = await getProducts({ searchParams });
  const dynamicData = await getStoreData({ searchParams });
  return (  
    <div className="flex flex-row max-w-7xl mx-auto w-full gap-2.5">
      <aside className="hidden sm:flex w-min">
        <ProductFilter dynamicData={dynamicData}/>
      </aside>
      <div className="flex flex-col w-full" >
        <div className="sticky top-[58px] bg-background" >
          <MobileFilter dynamicData={SerializeData(dynamicData)} />
          <BreadCrumbs crumbs={dynamicData.breadCrumbs} />
        </div>        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-1">
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