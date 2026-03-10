import { CartItem } from "@/app/types/cartItem";
import Star from "@mui/icons-material/Star";
import { Button } from "@vendora/ui/src/components/Button";
import PriceDisplay from "@vendora/ui/src/components/priceDisplay";
import { title } from "@vendora/ui/src/primitives";
import Image from "next/image";

interface OrderSummaryProps {
  items: readonly CartItem[];
  subTotal: number;
  shipping: number;
  total: number;
  loading: boolean;
  sizes: string;
}

export function OrderSummary({
  items,
  subTotal,
  shipping,
  total,
  loading,
  sizes
}: OrderSummaryProps){

  return(
    <div className="flex flex-col w-full ">
      <h1 className={title()}>Order Summary</h1>
      <div className="md:overflow-scroll md:h-fit md:max-h-[330px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none md:px-1 md:my-1.5 md:rounded-2xl md:ring-1 md:ring-green-500">
        {items.map((cartItem) => (
          <div key={cartItem.variantId} className="flex flex-col w-full gap-2.5" >
            <div className="flex flex-col bg-black/20 dark:bg-white/20 shadow-sm px-2.5 py-2 my-2 rounded-xl">
              <span className="mb-2 text-xl">{cartItem.name}</span>
              <div className="flex flex-row gap-5 w-full" >
                <div className="relative z-0 aspect-square w-[100px]">
                  <Image 
                    src={cartItem.imageUrl!}
                    alt={`${cartItem.name} image`}
                    fill
                    sizes={sizes}
                    fetchPriority="high"
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span>SKU: {cartItem.sku}</span>
                  <span>Quantity: {cartItem.quantity}</span>
                  <span>Price: <PriceDisplay amount={cartItem.price} /></span>
                </div>
              </div> 
              <div>           
                <p className="text-xl">Seller Information</p>
                <div className="ml-2.5 flex flex-col">                  
                  <span>Merchant: {cartItem.sellerInfo?.businessName}</span>
                  <div className="flex flex-row items-center gap-1" >
                    <span>Rating:</span>
                    <Star className="text-yellow-500" />
                    {cartItem.sellerInfo?.rating.toFixed(1)} / 5                
                  </div>    
                </div>                 
              </div>
            </div>              
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 my-2.5" >
        <div className="flex justify-between bg-black/20 dark:bg-white/20 rounded-xl px-2 py-1">
          <div className="flex flex-col" >
            <span>Subtotal</span>
            <span>Shipping Fee</span>
            <span className="mt-2.5 border-t-2" >Total</span>
          </div>
          <div className="flex flex-col" >
            <PriceDisplay amount={subTotal} />
            <span>{shipping}</span>
            <span className="mt-2.5 border-t-2">
              <PriceDisplay amount={total} />
            </span>              
          </div>
        </div>                         
        <Button            
          type="submit"
          className="bg-green-600 dark:bg-green-600 py-2 px-4"
          disabled={loading}
        >
          {loading ? <span className="animate-pulse">Making Payment...</span> : "Place Order"}
        </Button>    
      </div>
    </div>
  )
}