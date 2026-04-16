import { Metadata } from "next";
import CategoryBuilder from "./components/categorybuilder";


export const metadata: Metadata = {
  title: "Category | Vendora",
  description: "Create, edit and manage product categories conviniently"
}

export default function CategoryPage() {
  return (
    <CategoryBuilder />
  )
}