import { AccountBox, CurrencyExchange, DateRange, MonetizationOn, Money, MoneySharp, Pending, PendingActions, PointOfSale, PolicyOutlined, ShoppingBag, ShoppingCartCheckout, Subscriptions, TrendingDown, TrendingUp, VerifiedUser, Wallet } from "@mui/icons-material";
import { Card, title } from "@vendora/ui";

export default function Home() {
  return (
    <Card>
      <span className={title({ color: "violet", className: "mb-2.5" })} >Dashboard</span>
      <div className="grid grid-cols-1  gap-5 max-w-6xl mx-auto">                
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-2.5" >
          {[
            {
              title: "Orders",
              icon: <ShoppingBag/>,
              value: "697",
              change: "2%",
              trend: <TrendingUp />,
              description: "Compared to last month",
              textColor: "text-green-600"
            },
            {
              title: "Sales",
              icon: <ShoppingCartCheckout />,
              value: "$17,497",
              change: "6%",
              trend: <TrendingDown />,
              description: "Compared to last month",
              textColor: "text-red-600"
            },
            {
              title: "Revenue",
              icon: <CurrencyExchange />,
              value: "$9,231.67",
              change: "12%",
              trend: <TrendingUp />,
              description: "Compared to last month",
              textColor: "text-green-600"
            },
            {
              title: "Users",
              icon: <AccountBox />,
              value: "7,497",
              change: "2%",
              trend: <TrendingDown />,
              description: "Compared to last month",
              textColor: "text-red-600"
            }
          ].map((feature) => (
            <Card
              key={feature.title}
              header={
                <span className="text-gray-500 font-semibold flex flex-row items-center justify-between" >
                  {feature.title}
                  {feature.icon}
                </span>
              }
              variant="admin_card"
              hoverable
            >
              <div className="flex flex-col gap-2.5 " >
                <span className="text-2xl font-bold" >{feature.value}</span>
                <div className="flex flex-col gap-1 p-1 " >
                  <div className={`${feature.textColor} text-sm flex flex-row`} >
                    <span>{feature.change}</span>
                    {feature.trend}
                  </div>
                  <span className="text-sm" >{feature.description}</span>
                </div>                
              </div> 
            </Card>
          ))}
        </div>         
        
        <div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <Card
                variant="admin_card"
                header={
                  <span className="text-blue-600 font-semibold flex flex-row items-center justify-between" >
                    Funds Received
                    <MonetizationOn />
                  </span>
                  }
              >
                <div>                
                  <span className=" text-lg md:text-2xl font-semibold">$241,652</span>
                </div>
              </Card>

              <Card
                variant="admin_card"
                header={
                  <span className="text-green-600 font-semibold flex flex-row items-center justify-between" >
                    Paid Invoices
                    <PointOfSale />
                  </span>
                }
              >
                <div>                
                  <span className="text-lg md:text-2xl font-semibold">$71,192.54</span>
                </div>
              </Card>

              <Card
                variant="admin_card"
                header={
                  <span className="text-orange-600 font-semibold flex flex-row items-center justify-between" >
                    Pending Payments
                    <PendingActions />
                  </span>
                }
              >
                <div>                
                  <span className="text-lg md:text-2xl font-semibold">$11,192.54</span>
                </div>
              </Card>
            </div>          
        </div>
      </div>
    </Card>
  );
}
