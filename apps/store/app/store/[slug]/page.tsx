import { connectDB, Review } from "@vendora/db";
import { Product, Variant } from "@vendora/db";
import ProductView from "./components/productView";
import { groupVariants } from "@/app/utilities/variantHelper";
import { SerializeData } from "@vendora/ui/src/utilities/serialize";

type Params = Promise<{slug: string}>;

export default async function ProductDetails({params}: {params : Params}) {
  const slug = (await params).slug.split("-")[0];
  const id = decodeURIComponent(slug)
  await connectDB();

  const [product, variants, reviews] = await Promise.all([
    Product.findById(id)      
      .populate([
        {
          path: "sellerId",
          model: "Seller",
          select: "businessName rating averageRating totalReviews",
          foreignField: "userId"
        }
      ])
      .lean(),
    Variant.find({ productId: id }).lean(),
    Review.find({ productId: id })
      .populate([
        {
          path: "reviewerId",
          model: "User",
          select: "name"
        }
      ])
      .lean()
  ])

  const serializedProduct = SerializeData(product);  
  const serializedVariants = SerializeData(variants);
  const serializedReviews = SerializeData(reviews);
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
        sellerInfo={serializedProduct.sellerId}
        reviewInfo={serializedReviews}
        variants={serializedVariants} 
        options={options}
        initialSelections={initialSelections}
      />
    </div>
  )
}