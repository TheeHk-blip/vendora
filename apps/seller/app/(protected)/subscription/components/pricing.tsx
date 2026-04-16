"use client";

import { Cancel } from "@mui/icons-material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Button, Column, Table, title, useToast } from "@vendora/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FeatureRow {
  feature: string;
  basic: string | boolean;
  startup: string | boolean;
  pro: string | boolean;
}

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Ideal for solo sellers starting their online journey.",   
    button: "Switch to Basic"
  }, 
  {
    name: "Startup",
    price: "KES 3,500",
    description: "Recommended for seasoned sellers looking for advanced tooling.",
    button: "Upgrade"
  }, 
  {
    name: "Pro",
    price: "KES 7,500",
    description: "Best for enterprise level sellers.",
    button: "Upgrade"
  }
];

const planColors = {
  Basic: undefined,
  Startup: "blue",
  Pro: "yellow"
} as const;

const comparisonData: FeatureRow[] = [
  { feature: "General Commission", basic: "12%", startup: "7%", pro: "5%" },
  { feature: "Fashion Commission", basic: "16%", startup: "11%", pro: "9%" },
  { feature: "Analytics", basic: "Basic", startup: "Advanced", pro: "Advanced" },
  { feature: "Marketing Tools", basic: false, startup: true, pro: true },
  { feature: "Support", basic: "Basic support", startup: "Dedicated support", pro: "Priority support"},
  { feature: "Extra User Accounts", basic: "0", startup: "Up to 2", pro: "Up to 5" },
  { feature: "Trusted Badge", basic: false, startup: "After 100 sales with no returns", pro: "After 100 sales with no returns" },
];

export default function Pricing() {
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <CheckCircle className="text-green-500 scale-90"/>
      ) : (
        <Cancel className="text-gray-500 dark:text-neutral-600 scale-90" />
      )
    }
    return <span>{val}</span>
  };

  const columns: Column<FeatureRow>[] = [
    { 
      key: "feature", 
      title: "Features", 
      className: "text-gray-600 dark:text-gray-300" 
    },
    { 
      key: "basic", 
      title: "Basic (Free)", 
      className: "text-center",
      render: (row) => renderCell(row.basic)
    },
    { 
      key: "startup", 
      title: "Startup (KES 3.5k)", 
      className: "text-center",
      render: (row) => renderCell(row.startup)
    },
    { 
      key: "pro", 
      title: "Pro (KES 7.5k)", 
      className: "text-center",
      render: (row) => renderCell(row.pro)
    },
  ]

  const handleDowngrade = async () => {
    try {      
      setLoading(true);
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ subPlan: "basic" })
      });

      const result = await response.json();      
      if (result.ok) router.refresh()
      showToast(`Subscription successfully updated to ${result.subPlan}`, "success");
    } catch (error) {
      console.error("Error:", error);
      showToast("Error updating your plan", "error")
    } finally {
      setLoading(false);
    }
  }
  return (
    <main aria-label="Choose the right plan for your needs" className="min-h-screen py-10 px-4 rounded-2xl bg-linear-to-r from-black/10 to-white/45 dark:from-neutral-700/30 dark:to-zinc-950">      
      <h1 className={title({ className: "mb-2.5"})}>Available Plans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-5">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className="flex flex-col justify-between gap-1 bg-foreground/15 rounded-xl px-4 py-2"
          >
            <div className="flex flex-row justify-between items-center">
              <span className={title({ color: planColors[plan.name as keyof typeof planColors]})} >{plan.name}</span>
              <span className="font-bold md:text-xl">{plan.price}</span>
            </div>       
            <span>{plan.description}</span>
            {plan.button && plan.name !== "Basic" &&
              <Link 
                href={`/subscription/payment?plan=${plan.name.toLowerCase()}`} 
                className="px-2 py-1 text-sm rounded-xl ring-2 text-purple-700 text-center hover:bg-purple-500/25 hover:dark:bg-purple-400/20 hover:ring-0 transition-all duration-300"
              >
                {plan.button}
              </Link>
            }      
            {plan.button && plan.name === "Basic" && 
              <Button
                className="text-yellow-500 ring-2 hover:bg-orange-300/25 dark:hover:bg-orange-300/25 hover:ring-0 hover:text-yellow-500 active:scale-95"
                onClick={handleDowngrade}
                disabled={loading}
              >
                { loading ? <span className="animate-pulse">Updating plan...</span> : <span>{plan.button}</span> }
              </Button>
            }      
          </div>
        ))}
      </div>
      <Table<FeatureRow>                
        columns={columns}       
        data={comparisonData} 
        pageSize={10}
        renderFooter={() => null}
      />
    </main>
  );
}