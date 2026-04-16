import { Product, IProduct, connectDB } from "@vendora/db/frontend";
import { STATUS_COLORS } from "@vendora/ui";
import Image from "next/image";
import { StatusReview } from "./components/statusReview";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";

type Params = Promise<{ id: string}>;

export default async function ReviewPage({ params }: {params : Params}) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id).lean<IProduct>();
  if (!product) return <p>Product not found</p>
  
  return (
    <div className="flex flex-col justify-center w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4" >
        {product.images.map((imageUrl: string, index: number) => (       
          <Image 
            key={index}
            src={imageUrl}
            alt={`product image ${index + 1}`}
            width={150}
            height={150}
            className="rounded-xl m-1"
          />       
        ))}
      </div>
      <div className="flex flex-col gap-2.5" >
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-row gap-2.5">
            <span>{product.name}</span>                  
            <PriceDisplay 
              amount={product.price} 
              className="text-gray-600 dark:text-gray-300"
            />
          </div>          
          <span className={`${product.status ? STATUS_COLORS[product.status] : "bg-grey-500/10 text-gray-600 dark:text-gray-300"} w-fit px-1 rounded-lg`}>{product.status}</span>                  
        </div>
        <p className="whitespace-pre-line prose dark:prose-invert">{product.description}</p>
      </div>
      <div className="flex my-2.5 items-center w-full" >
        <StatusReview id={id}/>
      </div>      
    </div>
  )
}