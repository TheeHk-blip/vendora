import { ICategory } from "@vendora/db";
import { useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/product/category");
        const data = await response.json();
        if (data.publishedCategory) {
          setCategories(data.publishedCategory);
        }
        
      } catch (error) {
        console.error("Failed to fetch:", error)
      }
    }
    fetchCategories();
  }, []);

  return {categories}
}