import ProductView from "./components/productView";
import { groupVariants } from "@/app/utilities/variantHelper";
import { Suspense } from "react";
import { getCachedProductDetails } from "@/app/storeData";

type Params = Promise<{slug: string}>;

async function ProductDetailsComponent({params}: {params : Params}) {
  const slug = (await params).slug.split("-")[0];
  const id = decodeURIComponent(slug)
  
  const data = await getCachedProductDetails(id);

  if (!data) return <div>Product not found</div>

  const { options, colors } = groupVariants(data.variants);
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
        product={data.product} 
        similarProduct={data.similar}
        sellerInfo={data.product.sellerId}
        reviewInfo={data.reviews}
        variants={data.variants} 
        options={options}
        initialSelections={initialSelections}
      />
    </div>
  )
}

export default async function ProductDetails({params}: {params: Params}) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center w-full h-dvh p-6">Loading product details...</div>} >
      <ProductDetailsComponent params={params} />
    </Suspense>
  )
}