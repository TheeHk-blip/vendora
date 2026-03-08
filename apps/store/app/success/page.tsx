import { title } from "@vendora/ui";

export default function OrderSuccess() {
  return (
    <div className="flex justify-center w-full h-[400px]">
      <div className="flex flex-col itemms-center px-4 py-3 rounded-2xl my-auto mx-auto w-fit bg-black/20 dark:bg-white/20 shadow-md">
        <h1 className={title({ color: "green", className: "text-center"})}>Success</h1>
        <p>Your order was created successfully and it is awaiting dispatch. <br/> We will keep in touch through email with the status of your order</p> 
      </div>      
    </div>
  )
}