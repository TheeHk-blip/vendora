"use client";

import { updateProductStatus } from "@/actions/productstatus";
import { Button } from "@vendora/ui";

interface Props {
  id: string
};

export function StatusReview({id}: Props) {
  return (
    <div className="flex flex-row gap-5 items-center">
      <Button
        color="success"
        onClick={() => updateProductStatus(id, "live")}          
      >
        Approve Product
      </Button>

      <Button        
        onClick={() => updateProductStatus(id, "pending")}
        className="text-orange-500 bg-orange-200"          
      >
        Put under review
      </Button>

      <Button
        color="danger"
        onClick={() => updateProductStatus(id, "rejected")}          
      >
        Reject Product
      </Button>
    </div>
  )
}