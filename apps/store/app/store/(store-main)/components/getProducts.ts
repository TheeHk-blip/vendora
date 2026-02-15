import { connectDB } from "@vendora/db/src/connection/client";
import Category from "@vendora/db/src/models/category";
import Product from "@vendora/db/src/models/product";
import { SerializeData } from "@vendora/ui";
import mongoose from "mongoose";

interface CategoryDoc {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  parentId: mongoose.Types.ObjectId | string | null;
}
type Params = Promise<any>

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

  const categoryId = resolvedParams.categoryId;
  await connectDB(); 

  const isValid = mongoose.Types.ObjectId.isValid(categoryId);
  const targetId = isValid ? categoryId: null;

  const parentCategory = await Category.find({ parentId: null }).lean();

  let subCategory: any[] = [];
  let leafCategory: any [] = [];
  let activeCategory: any = null;
  let brandCounts: { name: string; count: number }[] = [];

  if (targetId) {
    activeCategory = await Category.findById(targetId).lean();

    subCategory = await Category.find({ parentId: targetId }).lean();

    if (subCategory.length > 0) {
      const subCategoryIds = subCategory.map(cat => cat._id);
      leafCategory = await Category.find({ parentId: { $in: subCategoryIds }}).lean();
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
      { $project: { name: "$_id", count: 1, _id: 0 }},
      { $sort: { name: 1 }}      
    ]);
  }

  const breadCrumbs = await getBreadCrumbs(categoryId);

  return {
    parentCategory,
    subCategory,
    leafCategory,
    activeCategory,
    availableBrands: brandCounts,
    breadCrumbs
  }
}