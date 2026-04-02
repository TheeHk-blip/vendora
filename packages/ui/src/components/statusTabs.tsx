"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./Button";

interface TabOption {
  label: string;
  value: string;
  count?: number;
}

interface StatusTabsProps {
  tabs: TabOption[];
  paramName?: string;
}

export default function StatusTabs({ tabs, paramName}: StatusTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeValue = searchParams.get(paramName!);

  const handleTabClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName!, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-row justify-evenly w-full mt-2.5 gap-1" >
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`
            ${activeValue === tab.value
              ? "bg-purple-500/40"
              : "text-purple-600 ring"
            } gap-1 sm:gap-2
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white" >
              {tab.count}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}