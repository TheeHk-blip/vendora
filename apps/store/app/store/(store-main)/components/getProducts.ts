import { connectDB, Category, Product, LeanArray, ICategory, RequireIdLean } from "@vendora/db";
import { SerializeData } from "@vendora/ui";
import mongoose from "mongoose";

/**
 * Filter system that retrieves data from DB depending on searchParams
 * 
 */

export interface CategoryDoc {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  parentId: mongoose.Types.ObjectId | string | null;
}

type Params = Promise<Record<string, string | string[] | undefined>>;

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


export async function getStoreData({ searchParams }: { searchParams: Params}) {
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