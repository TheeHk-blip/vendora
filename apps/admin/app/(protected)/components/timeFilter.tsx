"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "1wk";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", e.target.value);
    router.push(`?${params.toString()}`, {scroll: false});
  };

  return (
    <select
      value={currentRange}
      onChange={handleChange}      
      className="bg-gray-100 dark:bg-neutral-600 text-sm font-medium rounded-lg p-2 border border-gray-300 dark:border-gray-700 focus:outline-none"
    >
      <option value="1wk">1 Week</option>
      <option value="30d">Last 30 Days</option>
      <option value="90d">Last 3 Months</option>
      <option value="all">All Time</option>
    </select>
  )
}