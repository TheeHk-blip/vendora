import { Button } from "@vendora/ui/src/components/Button";
import { InputField } from "@vendora/ui/src/components/Input";
import { title } from "@vendora/ui/src/primitives";
import Image from "next/image";
import { CheckoutProps } from "../page";
import Link from "next/link";
 
interface ShippingProps {
  formData: CheckoutProps;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutProps>>;  
  paymentMethod: "card" | "mpesa";
  setPaymentMethod: (method: "card" | "mpesa") => void;
  checkoutSelection: "upfront" | "partial";
  setCheckoutSelection: (selection: "upfront" | "partial") => void;
}

export function Shipping({ 
  formData, 
  setFormData, 
  paymentMethod, 
  setPaymentMethod, 
  checkoutSelection, 
  setCheckoutSelection 
}: ShippingProps ) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } =e.target;
  setFormData((prev) => ({ ...prev, [name]: value}));
  }  
  return (
    <div className="flex flex-col w-full">
        <h1 className={title()}>Shipping Address</h1>                   
        <div className="flex flex-row justify-between gap-3.5 my-2 w-full">
          <InputField
            onChange={handleChange}
            name="firstName"
            value={formData.firstName}      
            label="First Name"                  
            placeholder="John"
            autoComplete="given-name"
            required
          />
          <InputField
            onChange={handleChange}
            name="lastName"
            value={formData.lastName}
            label="Last Name"
            placeholder="Doe"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="flex flex-row justify-between gap-3.5 w-full">   
          <InputField
            onChange={handleChange}            
            type="tel"
            name="phone"
            value={formData.phone}
            label="Phone"
            placeholder="0712345678"
            autoComplete="tel"
            required
          />      
          <InputField
            onChange={handleChange}
            type="text"
            name="county"
            value={formData.county}     
            label="County"         
            placeholder="Nairobi"
            autoComplete="adress-level1"
            required
          />
        </div>
        <div className="flex flex-row justify-between gap-3.5 my-2 w-full">
          <InputField
            onChange={handleChange}
            type="text"
            name="constituency"
            value={formData.constituency}
            label="Constituency"
            placeholder="Kasarani"
            autoComplete="address-level2"
            required
          />
          <InputField
            onChange={handleChange}
            type="text"
            name="ward"
            value={formData.ward}
            label="Ward"
            placeholder="Kasarani"
            autoComplete="address-level3"
            required
          />
        </div>  
        <div className="flex flex-col gap-4">
          <h2 className={title({ size: "xs"})} >Choose Payment Method</h2>          
          <div className="flex flex-row items-center justify-center gap-5">
            <Button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-[200px] h-20 ring-2 ${paymentMethod === "card" ? "ring-green-500": "ring-transparent"}`}
            >
              <Image alt="card image" src="/card.png" fetchPriority="high" width={100} height={100} /> 
            </Button>
            <Button
              type="button"
              onClick={() => setPaymentMethod("mpesa")}
              className={`w-[200px] h-20 ring-2 ${paymentMethod === "mpesa" ? "ring-green-500": "ring-transparent"}`}
            >
              <Image alt="mpesa icon" src="/mpesa.png" fetchPriority="high" width={100} height={100} />            
            </Button>
          </div>
        </div>  
        <div className="flex flex-col my-2">
          <h2 className={title({ size: "xs"})} >Secure Checkout Selection</h2> 
          <h3>All  Checkout methods are secure and protected by our <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/help-center/refund#inad`} className="text-blue-600">Buy what you ordered policy</Link></h3>         
          <div className="flex flex-col md:flex-row gap-5 mt-2">
            <div              
              onClick={() => setCheckoutSelection("upfront")}
              className={`flex flex-col px-2 py-1 rounded-md bg-black/20 dark:bg-white/20 shadow-sm cursor-pointer ring-2 ${checkoutSelection === "upfront" ? "ring-green-500": "ring-transparent"}`}
            >
              <h1 className="text-xl font-semibold" >Upfront Payment</h1>
              <div className="pl-1.5 text-start">Pay the full price of the product + shipping to initiate delivery.</div>                
            </div>
            <div              
              onClick={() => setCheckoutSelection("partial")}
              className={`flex flex-col px-2 py-1 rounded-md shadow-sm bg-black/20 dark:bg-white/20 cursor-pointer ring-2 ${checkoutSelection === "partial" ? "ring-green-500": "ring-transparent"}`}
            >
              <h1 className="text-xl font-semibold" >Partial Payment</h1>
              <div className="pl-1.5 text-start">Pay the shipping fee first and the rest upon delivery</div>        
            </div>
          </div>
        </div>         
      </div>
  )
}