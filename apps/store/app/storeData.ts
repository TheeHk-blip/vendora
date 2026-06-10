import { Category, connectDB, ICategory, IProduct, LeanArray, Product, RequireIdLean, Review, Variant } from "@vendora/db/frontend";
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

type ProductWithToken = LeanArray<IProduct>[number] & {
  paginationToken?: string;
}

function sanitizeObjectId(id: unknown): string | null {
  if (typeof id !== "string") return null;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return id;
}

function sanitizePrice(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 1_000_000_000) return null;
  return n;
}

function sanitizeSearchQuery(q: unknown): string | null {
  if (typeof q !== "string") return null;
  const trimmed = q.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return null;
  // Strip special Atlas Search operators
  return trimmed.replace(/[+\-|"*~^(){}[\]\\]/g, " ").trim();
}

function sanitizeBrandList(brand: unknown): string[] {
  if (typeof brand !== "string") return [];
  return brand
    .split(",")
    .map(b => b.trim())
    .filter(b => b.length > 0 && b.length <= 100)
    .slice(0, 20); // cap list size
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

export async function getCachedProducts(
  query?: string,
  categoryId?: string,
  brand?: string,
  minPrice?: string,
  maxPrice?: string,
  cursor?: string
) {
  "use cache";  
  cacheLife("hours");
  cacheTag("products")
  
  await connectDB();

  const safeCategoryId = sanitizeObjectId(categoryId);
  const safeQuery = sanitizeSearchQuery(query);
  const safeBrands = sanitizeBrandList(brand);
  const safeMinPrice = sanitizePrice(minPrice);
  const safeMaxPrice = sanitizePrice(maxPrice);

  let categoryIds: mongoose.Types.ObjectId[] = [];
  if (safeCategoryId && mongoose.Types.ObjectId.isValid(safeCategoryId)) {
    categoryIds = await getCategoryBranch(safeCategoryId);
  }

  if (safeQuery) {
    const searchStages: PipelineStage[] = [
      {
        $search: {
          index: "products",
          returnStoredSource: false,
          compound: {
            must: [
              {
                text: {
                  query: safeQuery,
                  path: ["name", "description", "brand"],
                  fuzzy: { maxEdits: 2, prefixLength: 2}
                }
              }
            ],
            filter: [
              ...(safeCategoryId ? [{
                equals: {
                  path: "categoryId",
                  value: new mongoose.Types.ObjectId(safeCategoryId)
                }
              }]: []),
              ...(safeBrands.length > 0 ? [{
                in: {
                  path: "fields.brand",
                  value: safeBrands
                }
              }] : [])
            ]           
          }
        }
      },
      {
        $addFields: {
          paginationToken: { $meta: "searchSequenceToken" }
        }
      },
      { $match: { status: "live" }},
      { $limit: 40}
    ];

    const products = await Product.aggregate<ProductWithToken>(searchStages);
    const nextCursor = products.length === 10
      ? products[products.length -1].paginationToken ?? null
      : null;

    return {
      products: products.map(({ paginationToken, ...p}) => SerializeData(p)),
      nextCursor
    };
  }

  const filter: FilterQuery<IProduct> = { status: "live" };
  if (categoryIds.length > 0) {
    filter.safeCategoryId = { $in: categoryIds };
  }

  if (safeBrands.length > 0) {
    filter["fields.brand"] = { $in: safeBrands };
  }

  if (safeMinPrice || safeMaxPrice) {
    filter.price = {};
    if (safeMinPrice) filter.price.$gte = Number(safeMinPrice);
    if (safeMaxPrice) filter.price.$lte = Number(safeMaxPrice);
  }

  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }
  
  const products = await Product.find(filter)
    .sort({ _id: -1 })
    .limit(5)
    .lean();
  
  const nextCursor = products.length === 5
    ? products[products.length - 1]._id.toString()
    : null;

  return { 
    products: products.map(p => SerializeData(p)), 
    nextCursor 
  };
}

export async function fetchNextPage(
  cursor: string,
  filters: {
    q?: string,
    categoryId?: string,
    brand?: string,
    minPrice?: string,
    maxPrice?: string
  }
) {
  return getCachedProducts (
    filters.q,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.categoryId,
    cursor
  );
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
  cacheTag(`product-${id}`);

  await connectDB();

  const product  = await Product.findById(id)
    .populate([
      {
        path: "sellerId",
        model: "Seller",
        select: "businessName averageRating totalReviews",
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
    .limit(8)
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
