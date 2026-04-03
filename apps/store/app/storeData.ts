import { Category, connectDB, ICategory, IProduct, LeanArray, Product, RequireIdLean } from "@vendora/db";
import { SerializeData } from "@vendora/ui/src/utilities/serialize";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";

export type Params = Promise<{
  q?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}>;

export async function getHomeData() {
  const [categories, exclusiveOffers, latestProducts] = await Promise.all([
    Category.find()
    .select("name slug images")
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

  return { categories, exclusiveOffers, latestProducts}
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

export async function getProducts({searchParams}: {searchParams: Params}) {
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

export async function getStoreData({ searchParams }: { searchParams: FilterParams}) {
  const resolvedParams = await searchParams;

  const categoryId = resolvedParams.categoryId as string | null;
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
    parentCategory,
    subCategory,
    leafCategory,
    activeCategory,
    availableBrands: brandCounts,
    breadCrumbs,
    maxStorePrice,
    minStorePrice
  }
}