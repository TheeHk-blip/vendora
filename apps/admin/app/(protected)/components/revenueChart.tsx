"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueProps {
  data: {
    date: string,
    totalRevenue: number,
    platformRevenue: number,
  }[]
}

export function RevenueChart({ data }: RevenueProps) {
  return (
    <div className="w-[80%] h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart                
          data={data}        
          margin={{ top: 5, left: 5, right: 5, bottom: 5}}
        >
          <CartesianGrid stroke="gray" strokeDasharray={"3 3"} />
          <Legend />
          <Tooltip 
            cursor={{
              stroke: "white"
            }}
            contentStyle={{
              backgroundColor: "black",
              color: "gray",
              borderRadius: "12px",            
            }}
          />
          <XAxis 
            dataKey={"date"} 
            interval={0} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            width={"auto"} 
            axisLine={false} 
            tickLine={false}
            fontSize={12}
            tickFormatter={(value) => `KSH ${value}`}
          />
          <Line 
            type="monotone" 
            dataKey={"totalRevenue"} 
            stroke="violet" 
            strokeWidth={2} 
            dot={{ fill: "orange" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey={"platformRevenue"} 
            stroke="green" 
            strokeWidth={2} 
            dot={{ fill: "orange" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}