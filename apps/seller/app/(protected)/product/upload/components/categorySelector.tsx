import { useEffect, useState } from "react";
import { ICategoryField, ProductProps } from "../page";
import { SelectField } from "@vendora/ui";
import { DynamicFieldRenderer } from "./fieldRenderer";

export interface FormProps {
  formData: ProductProps;
  setFormData: React.Dispatch<React.SetStateAction<ProductProps>>;
}

interface CategoryProps {
  formData: ProductProps;
  setFormData: React.Dispatch<React.SetStateAction<ProductProps>>;
  selectedCategory: ICategory | null;
  setSelectedCategory: (cat: ICategory | null) => void;
  selectedSubCategory: ICategory | null;
  setSelectedSubCategory: (cat: ICategory | null) => void;
  selectedLeafCategory: ICategory | null;
  setSelectedLeafCategory: (cat: ICategory | null) => void;
}

interface ICategory {
  _id: string;
  name: string;
  fields: ICategoryField[];
}

export function CategorySelector({ 
  formData, 
  setFormData,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  selectedLeafCategory,
  setSelectedLeafCategory
}: CategoryProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [leafCategories, setLeafCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    fetch("/api/product/category?parentId=null")
    .then(res => res.json())
    .then(data => setCategories(data.categories || []));
  }, [setCategories]);

  useEffect(() => {
    if (!selectedCategory?._id) {
      setSubCategories([]);
      return;
    }

    fetch(`/api/product/category?parentId=${selectedCategory._id}`, {cache: "no-store"})
    .then(res => res.json())
    .then(data => setSubCategories(data.categories || []));
  }, [selectedCategory?._id, setSubCategories]);
  
  useEffect(() => {
    if (!selectedSubCategory?._id) {
      setLeafCategories([]);
      return;
    }

    fetch(`/api/product/category?parentId=${selectedSubCategory._id}`, {cache: "no-store"})
      .then(res => res.json())
      .then(data => setLeafCategories(data.categories || []));
  }, [setLeafCategories, selectedSubCategory?._id]);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;    
    if (!parentId) {
      setSelectedCategory(null);
      setSelectedSubCategory(null);
      setFormData(prev => ({...prev, categoryId: ""}));
      return;
    };

    const category = categories?.find(cat => cat._id === parentId);
    setSelectedCategory(category as ICategory);
    setSelectedSubCategory(null);
    setFormData(prev => ({...prev, categoryId: parentId, dynamicFields: {}}));
  };
    
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = e.target.value;

    const subCategory = subCategories.find(cat => cat._id === subId);

    setSelectedSubCategory(subCategory as ICategory);
    setFormData(prev => ({...prev, categoryId: subId, dynamicFields: {}}));
  };

  const handleLeafCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leafId = e.target.value;

    const leafCategory = leafCategories.find(cat => cat._id === leafId);

    setSelectedLeafCategory(leafCategory as ICategory);
    setFormData(prev => ({...prev, categoryId: leafId, dynamicFields: {}}));
  };

  const handleDynamicChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      dynamicFields: {
        ...prev.dynamicFields,
        [fieldId]: value
      }
    }))
  }
  
  return (
    <div className="flex flex-col gap-2.5">
      <SelectField
        label="Select Category"
        value={selectedCategory?._id || ""}
        onChange={handleCategoryChange}
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </SelectField>

      {selectedCategory && subCategories.length > 0 && (
        <div className="my-1">
          <SelectField
            label={`Specify category in ${selectedCategory.name}`}
            value={selectedSubCategory?._id || ""}
            onChange={handleSubCategoryChange}
          >
            <option value="">Select Sub-category</option>
            {subCategories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </SelectField>
        </div>
      )}

      {selectedSubCategory && leafCategories.length > 0 && (
        <div className="my-1">
          <SelectField
            label="Product Type"
            value={selectedLeafCategory?._id || ""}
            onChange={handleLeafCategoryChange}
          >
            <option value="">Select Sub-category</option>
            {leafCategories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </SelectField>
        </div>
      )}             

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2.5">
        {(selectedLeafCategory || selectedSubCategory)?.fields?.map((field: ICategoryField) => (                
          <DynamicFieldRenderer 
            key={field.fieldId}
            field={field}
            value={formData.dynamicFields[field.fieldId]}
            onUpdate={handleDynamicChange}            
          />              
        ))}
      </div> 
    </div>
  )
}