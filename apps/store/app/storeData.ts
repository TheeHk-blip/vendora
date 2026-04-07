import { Category, connectDB, ICategory, IProduct, LeanArray, Product, RequireIdLean, Review, Variant } from "@vendora/db";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import { SerializeData } from "@vendora/ui/src/utilities/serialize";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

export type Params = Promise<{
  q?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export interface HomeDataProps {
  categories: ICategory[];
  exclusiveOffers: IProduct[];
  latestProducts: IProduct[];
}

export async function getHomeData(): Promise<HomeDataProps>  {
  "use cache"  
  cacheLife("hours");
  cacheTag("home-data");

  await connectDB();

  const [categories, exclusiveOffers, latestProducts] = await Promise.all([
    Category.find()
    .select("name slug images _id")
    .lean<ICategory[]>(),
    Product.find({ discount: { $exists: true, $gt: 10 }, status: "live" })
    .select("name price discountedPrice discount images")
    .lean<IProduct[]>(),
    Product.find({ releaseYear:  2026 })
    .sort({ releaseYear: -1 })
    .select("name price discountedPrice discount images")
    .limit(10)
    .lean<IProduct[]>()
  ]);

  return { categories: SerializeData(categories), exclusiveOffers: SerializeData(exclusiveOffers), latestProducts: SerializeData(latestProducts) }
}

export async function getCategoryBranch(categoryId: string): Promise<mongoose.Types.ObjectId[]> {
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

async function getCachedProducts(
  query?: string,
  categoryId?: string,
  brand?: string,
  minPrice?: string,
  maxPrice?: string
) {
  "use cache";  
  cacheLife("hours");
  cacheTag("products")
  
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

export async function getProducts({ searchParams }: { searchParams: Params }) {
  const resolved = await searchParams;

  return getCachedProducts(
    resolved.q as string,
    resolved.categoryId as string,
    resolved.brand as string,
    resolved.minPrice as string,
    resolved.maxPrice as string
  )
}

export async function getCachedProductDetails(id: string) {
  "use cache";  
  cacheLife("hours");
  cacheTag("products", `product-${id}`);

  await connectDB();

  const product  = await Product.findById(id)
    .populate([
      {
        path: "sellerId",
        model: "Seller",
        select: "businessName rating averageRating totalReviews",
        foreignField: "userId"
      }
    ])
    .lean<IProductBase>();

  if (!product) return null;
  const productBrand = product.fields?.brand;

  const [variants, reviews, similarProducts] = await Promise.all([    
    Variant.find({ productId: id }).lean(),
    Review.find({ productId: id })
      .populate([
        {
          path: "reviewerId",
          model: "User",
          select: "name"
        }
      ])
      .lean(),
    Product.find({ 
      "fields.brand": productBrand, 
      categoryId: product.categoryId,
      _id: { $ne: id }
    })
    .limit(4)
    .select("name images price")
    .lean()
  ]);

  return {
    product: SerializeData(product),
    variants: SerializeData(variants),
    reviews: SerializeData(reviews),
    similar: SerializeData(similarProducts)
  }

}

export interface CategoryDoc {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  parentId: mongoose.Types.ObjectId | string | null;
}

type FilterParams = Promise<Record<string, string | string[] | undefined>>;

async function getBreadCrumbs(categoryId: string | null): Promise<CategoryDoc[]> {
  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) return [];

  const crumbs: CategoryDoc[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const cat = await Category.findById(currentId).select("name _id parentId").lean() as CategoryDoc | null;
    const vCategory = SerializeData(cat)
    if (vCategory) {
      crumbs.unshift(vCategory);
      currentId = vCategory.parentId ? vCategory.parentId.toString() : null;
    } else {
      currentId = null;
    }
  }
  return crumbs;
}

async function getCachedStoreData(categoryId: string | null) {
  "use cache";
  cacheLife("hours");
  cacheTag("store-filter", categoryId ?? "all")
  
  await connectDB(); 

  const isValid = categoryId ? mongoose.Types.ObjectId.isValid(categoryId) : false;
  const targetId = isValid ? categoryId: null;

  const parentCategory = await Category.find({ parentId: null }).lean<ICategory[]>();

  let subCategory: LeanArray<ICategory> = [];
  let leafCategory: LeanArray<ICategory> = [];
  let activeCategory: RequireIdLean<ICategory> | null = null;
  let brandCounts: { name: string; count: number }[] = [];

  if (targetId) {
    activeCategory = await Category.findById(targetId).lean<RequireIdLean<ICategory>>();

    subCategory = await Category.find({ parentId: targetId }).lean<LeanArray<ICategory>>();

    if (subCategory.length > 0) {
      const subCategoryIds = subCategory.map(cat => cat._id);
      leafCategory = await Category.find({ parentId: { $in: subCategoryIds }}).lean<LeanArray<ICategory>>();
    }

    brandCounts = await Product.aggregate([
      {
        $match: {
          categoryId: mongoose.Types.ObjectId.createFromHexString(targetId),
          status: "live"
        }
      },
      {
        $group: {
          _id: "$fields.brand",
          count: { $sum: 1}
        }
      },
      { $project: { name: { $ifNull: ["$_id", "Unknown Brand"]}, count: 1, _id: 0 }},
      { $sort: { name: 1 }}      
    ]);
  }

  const breadCrumbs = await getBreadCrumbs(categoryId);
  const maxPriceDoc = await Product.find({})
    .sort({ price: -1})
    .limit(1)
    .select("price")
    .lean();

  const minPriceDoc = await Product.find({})
    .sort({ price: 1})
    .limit(1)
    .select("price")
    .lean();

  const maxStorePrice: number = maxPriceDoc.length > 0 ? maxPriceDoc[0].price : 500000;
  const minStorePrice: number = minPriceDoc.length > 0 ? minPriceDoc[0].price : 500000;

  return {
    parentCategory: SerializeData(parentCategory),
    subCategory: SerializeData(subCategory),
    leafCategory: SerializeData(leafCategory),
    activeCategory: SerializeData(activeCategory),
    availableBrands: SerializeData(brandCounts),
    breadCrumbs: SerializeData(breadCrumbs),
    maxStorePrice,
    minStorePrice
  }
}

export async function getStoreData({ searchParams }: { searchParams: FilterParams }) {
  await connection();
  const resolvedParams = await searchParams;
  const categoryId = resolvedParams.categoryId as string || null;

  return getCachedStoreData(categoryId);
}
