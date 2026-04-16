"use client";

import { TransformedOrderItem } from "@vendora/db/frontend";
import { Column, Table, UsePage } from "@vendora/ui";

export function RecentsTable({data}: {data: TransformedOrderItem[]} ) {
  const { page, setPage } = UsePage();
  const columns: Column<TransformedOrderItem>[] = [
    { key: "orderNumber", title: "Order Number" },
    { key: "buyer", title: "Buyer" },
    { key: "productName", title: "Product"},
    { key: "sku", title: "SKU"},
    { key: "orderAmount", title: "Order Amount"},
    { 
      key: "status", 
      title: "Status",
      render: (row: TransformedOrderItem) => {    
        const status = row.status;    
        const styles: Record<TransformedOrderItem["status"], string> = {
          awaitingCommitment: "ring text-orange-700",
          awaitingDispatch: "ring text-blue-700",
          inTransit: "ring text-indigo-700",
          delivered: "ring-2 text-green-700",
          rejected: "ring text-red-700",
        }
        return (
          <span className={`text-xs rounded-lg px-2 py-0.5 m-1 font-semibold ${styles[status]}`}>
            {status.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim()}
          </span>
        )
      }
    },
    { key: "date", title: "Date"}
  ]

  return (
    <Table<TransformedOrderItem>      
      columns={columns}      
      data={data}
      pageSize={7}
      page={page}
      onPageChange={setPage}
    />
  )
}