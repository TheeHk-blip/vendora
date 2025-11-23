import { Add } from "@mui/icons-material";
import { title } from "@vendora/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Vendora",
  description: "Create, edit and manage products conviniently"
}

export default function Products() {

  return (
    <div className="flex justify-center w-full max-w-full" >
      <div className="flex flex-row items-center w-full justify-between mx-2">
        <h1 className={title({ color: "foreground"})}>Products</h1>
        <span className="flex gap-1 text-purple-500 bg-purple-50 rounded-3xl px-3 py-1.5" >
          <Add />
          Product
        </span>
      </div>
    </div>
  )
}