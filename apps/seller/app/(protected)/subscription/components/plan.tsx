import { title } from "@vendora/ui";
import { UserPlan } from "../page";

interface PlanProps {
  subscription: UserPlan
}

export function Plan ({subscription}: PlanProps) {
  const isExpired = new Date(subscription?.expiryDate) < new Date();
  return(
    <div className="flex flex-col bg-foreground/50 px-4 py-2 gap-2.5 rounded-xl">  
      <span className="flex flex-row justify-between items-center" >
        <span className={title({size: "sm"})}>Your Plan</span>
        <h1 className={title({ size: "sm"})} >{subscription?.plan?.name}</h1> 
      </span>    
      <span className="flex flex-row items-center justify-between ml-3" >
        <h2 className="text-xl" >Status</h2>
        <span className={isExpired ? "text-red-500" : "text-green-500 ring px-2 rounded-lg"} >
          {subscription?.status}
        </span> 
      </span>                           
      {subscription?.isLifeTime !== true &&
        <span className="flex flex-row items-center justify-between ml-3"  >
          <h3 className="text-xl" >Due</h3>
          <span className="text-gray-800 dark:text-gray-300" >          
            {new Date(subscription?.expiryDate).toLocaleDateString("en-KE", {
              dateStyle: "long"
            })}
          </span>   
        </span> 
      }          
    </div>
  )
}