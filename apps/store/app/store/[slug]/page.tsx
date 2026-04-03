import { connectDB, Review } from "@vendora/db";
import { Product, Variant } from "@vendora/db";
import ProductView from "./components/productView";
import { groupVariants } from "@/app/utilities/variantHelper";
import { SerializeData } from "@vendora/ui/src/utilities/serialize";
import { IProductBase } from "@vendora/ui/src/types/IProductBase";

type Params = Promise<{slug: string}>;

export default async function ProductDetails({params}: {params : Params}) {
  const slug = (await params).slug.split("-")[0];
  const id = decodeURIComponent(slug)
  await connectDB();

  const product = await Product.findById(id)      
    .populate([
      {
        path: "sellerId",
        model: "Seller",
        select: "businessName rating averageRating totalReviews",
        foreignField: "userId"
      }
    ])
    .lean<IProductBase>();

  if (!product) return <div>Product not found</div>
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
  ])

  const serializedProduct = SerializeData(product);  
  const serializedVariants = SerializeData(variants);
  const serializedReviews = SerializeData(reviews);
  const serializedSimilarProducts = SerializeData(similarProducts);
  const { options, colors } = groupVariants(serializedVariants);
  const initialSelections = {
    color: colors[0] || "",
    ...Object.keys(options).reduce((acc, key) => ({
      ...acc,
      [key]: options[key][0]
    }), {} as Record<string, string>)
  };

  return (
    <div>
      <ProductView 
        product={serializedProduct} 
        similarProduct={serializedSimilarProducts}
        sellerInfo={serializedProduct.sellerId}
        reviewInfo={serializedReviews}
        variants={serializedVariants} 
        options={options}
        initialSelections={initialSelections}
      />
    </div>
  )
}