import { IProductBase } from "@vendora/ui/src/types/IProductBase";
import { IVariantBase } from "@vendora/ui/src/types/IVariantBase";
import dynamic from "next/dynamic";
import { title } from "@vendora/ui/src/primitives";
import { VariantSelection } from "./variantSelection";
import { IReview } from "@vendora/ui";
import { SimilarProducts, SimilarProductsSkeleton } from "./similarProducts";
import { Suspense } from "react";

interface ProductProps {
  product: IProductBase;
  similarProduct: IProductBase[];
  sellerInfo: {
    _id: string,
    businessName: string,
    rating: number,
    averageRating: number,
    totalReviews: number
  };
  reviewInfo: IReview[];
  variants: IVariantBase[];
  options: Record<string, string[]>;
  initialSelections: Record<string, string>;
}

const ProductGallery = dynamic(() => import("@vendora/ui/src/components/ProductGallery").then(mod => mod.ProductGallery), {
  ssr: true,
  loading: () => <div className="aspect-square w-full, bg-gray-100 animate-pulse rounded-lg" />
})

export default function ProductView({ product, similarProduct, variants, options, initialSelections, sellerInfo, reviewInfo}: ProductProps) {
  return (
    <div className="flex flex-col w-full py-2" >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5" >
        <div className="flex flex-col gap-2.5">
          <ProductGallery images={product.images} />
          <div className="hidden md:flex">
            {similarProduct && similarProduct.length > 0 &&
              <Suspense fallback={<SimilarProductsSkeleton />} >
                <SimilarProducts product={similarProduct} />
              </Suspense>            
            }
          </div>
        </div>
           
        <div className="flex flex-col my-2">
          <p className={title({size: "sm", className: "text-center"})}>
            {product.name}
          </p>
        
          <VariantSelection 
            initialSelections={initialSelections}
            options={options}
            variants={variants}
            product={product}        
            sellerInfo={sellerInfo}
            reviewInfo={reviewInfo}
          />                 

          <div className="md:hidden flex">
            {similarProduct && similarProduct.length > 0 &&
              <Suspense fallback={<SimilarProductsSkeleton />} >
                <SimilarProducts product={similarProduct} />
              </Suspense>            
            }
          </div>
          <div className="mt-2" >
            <h2 className={title({size: "xs"})}>Features</h2>
            {Object.entries(product.fields || {}).map(([key, value]) => (
              <div key={key}>
                <span className="capitalize font-medium">{key.replace(/-/g, ' ')}: </span>
                <span className="text-black/70 dark:text-white/70" >{String(value)}</span>
              </div>
            ))}
          </div>
        </div>        
      </div>

      <div>
        <h2 className={title({size: "sm", className: "mb-2"})}>Description</h2>
        <p className="whitespace-pre-line prose dark:prose-invert">{product.description}</p>
      </div>
    </div>
  )
}