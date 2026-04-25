"use client";

import { Cancel } from "@mui/icons-material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { Column, Table, title } from "@vendora/ui";
import { motion } from "framer-motion";

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
    description: "Ideal for solo sellers starting their online journey."
  }, 
  {
    name: "Startup",
    price: "KES 3,500",
    description: "Recommended for seasoned sellers looking for advanced tooling."
  }, 
  {
    name: "Pro",
    price: "KES 7,500",
    description: "Best for enterprise level sellers."
  }
];

const comparisonData: FeatureRow[] = [
  { feature: "General Commission", basic: "12%", startup: "7%", pro: "5%" },
  { feature: "Fashion Commission", basic: "16%", startup: "11%", pro: "9%" },
  { feature: "Analytics", basic: "Basic", startup: "Advanced", pro: "Advanced" },
  { feature: "Marketing Tools", basic: false, startup: true, pro: true },
  { feature: "Extra User Accounts", basic: "0", startup: "Up to 2", pro: "Up to 5" },
  { feature: "Trusted Badge", basic: false, startup: "After 100 sales with no returns", pro: "After 100 sales with no returns" },
];

export default function Pricing() {
  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <CheckCircle className="text-green-500 scale-90"/>
      ) : (
        <Cancel className="text-gray-700 dark:text-gray-400 scale-90" />
      )
    }
    return <span className="font-medium">{val}</span>
  };

  const columns: Column<FeatureRow>[] = [
    { 
      key: "feature", 
      title: "Features", 
      className: "text-gray-900 dark:text-white" 
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
  return (
    <main aria-label="Choose the right plan for your needs" className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className={title({ color: "foreground", size: "lg"})}>Flexible Plans for Every</span>
          <span className={title({ color: "blue", size: "lg", className: "ml-2.5" })}>Business</span>
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Whether you&apos;re just starting or scaling fast, Vendora has a plan that
          fits your needs.
        </p>
        <span className="text-gray-700 dark:text-gray-400">Note: You can manage your subscription in your dashboard!</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-5">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className="flex flex-col bg-white/50 dark:bg-neutral-700/50 rounded-xl shadow-sm px-4 py-2"
          >
            <div className="flex flex-row justify-between items-center">
              <span className="text-2xl" >{plan.name}</span>
              <span className="font-bold text-foreground/70 text-xl">{plan.price}</span>
            </div>
            <span>{plan.description}</span>
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