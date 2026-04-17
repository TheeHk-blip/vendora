"use client";

import { Button, ProductVariant, title, useToast } from "@vendora/ui";
import FileUpload from "./components/filePicker";
import React, { useState } from "react";
import { Upload } from "@mui/icons-material";
import { upload } from "@vercel/blob/client";
import { VariantManager } from "./components/variantManager";
import { CategorySelector } from "./components/categorySelector";
import { BasicProductInfo } from "./components/basicProductInfo";

export interface ICategoryField {
  fieldId: string;
  label: string;
  type: "text" | "number" | "select";
  options: {value: string, label: string}[];
  required?: boolean;
  isMulti?: boolean;
  placeholder: string;
} 

interface ICategory {
  _id: string;
  name: string;
  fields: ICategoryField[];
}

export interface ProductProps {
  name: string;
  price: string;
  discountedPrice: string;
  discount: string;
  description: string;
  images: string[];
  categoryId: string;
  releaseYear: string;
  dynamicFields: Record<string, string | number | string[]>
}

export default function CreateProduct() {  
  const {showToast} = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<ICategory | null>(null);
  const [selectedLeafCategory, setSelectedLeafCategory] = useState<ICategory | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const INITIAL_FORM_STATE = {
    name: "",
    price: "",
    discountedPrice: "",
    discount: "",
    description: "",
    images: [] as string [],
    categoryId: "",
    releaseYear: "",
    dynamicFields: {} as Record<string, string | number | string[]>
  }

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedLeafCategory(null);
    setSelectedSubCategory(null);
    setSelectedFiles([]);
    setProgress({});    
    setVariants([]);
  }

  const [formData, setFormData] = useState<ProductProps>({
    name: "",
    price: "",
    discountedPrice: "",
    discount: "",
    description: "",
    images: [] as string [],
    categoryId: "",
    releaseYear: "",
    dynamicFields: {} as Record<string, string | number | string[]>
  });

  const isBasicInfoComplete = formData.name !== "" && formData.price !== "" && formData.description.length >= 200 && formData.categoryId !== "";

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  }

  const discount = (Number(formData.discountedPrice) === 0 || Number(formData.discountedPrice) === Number(formData.price))
    ? 0
    : Math.floor(((Number(formData.price) - Number(formData.discountedPrice)) / Number(formData.price)) * 100);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const errors: string[] = [];

    // Check standard fields
    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.price || Number(formData.price) <= 0) errors.push("A valid price is required");
    if (!formData.description) errors.push("Product description is required")
    if (!selectedSubCategory) errors.push("Please select a sub-category");

    // check dynamic required fields
    selectedSubCategory?.fields?.forEach((field: ICategoryField) => {
      if (field.required) {
        const value = formData.dynamicFields[field.fieldId];
        const isEmpty = !value || (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          errors.push(`${field.label} is required.`);
        }
      }
    });

    if (errors.length > 0) {
      showToast(errors[0], "error");
      return;
    }
    
    try {
      setIsPublishing(true);

      const mainProductImages = selectedFiles.map((file) =>
        upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/product/upload",
          onUploadProgress: (p) => {
            setProgress((prev) => ({ ...prev, [file.name]: p.percentage}));
          }
        })
      );

      const results = await Promise.all(mainProductImages);
      const imageurls = results.map(r => r.url);

      const updatedVariants = await Promise.all(variants.map(async (variant) => {
        if (variant.image && variant.image[0] instanceof File) {
          const file = variant.image[0];

          const variantBlob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/product/upload",
            onUploadProgress: (p) => {
              setProgress((prev) => ({
                ...prev,
                [`Variant-${variant.id}`]: p.percentage
              }));            
            }
          });

          return {...variant, image: variantBlob.url};
        }
        return variant;
      }))

      const payload = {
        ...formData,
        discount: discount,
        images: imageurls,
        variants: updatedVariants,
        categoryId: selectedLeafCategory?._id
      }

      const response = await fetch("/api/product", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast("Product published successfully", "success");
        resetForm();       
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      showToast("Failed to create Product", "error")
    } finally {
      setIsPublishing(false);
    }
  }

  return(
    <main 
      aria-label="Product upload"
      className="flex flex-col w-full"
    >
      <h1 className={title({ color: "foreground", className: "text-center mb-5" })}>Create Product</h1>
      <div className="bg-foreground/15 p-2 rounded-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" >
          <div className="flex flex-row gap-2.5" >
            <div className="flex flex-col gap-3.5 w-full" >
              <FileUpload value={selectedFiles} progress={progress} onFilesChange={handleFilesChange} />
              <BasicProductInfo formData={formData} setFormData={setFormData} />            
            </div>            
            <div className="my-2.5 w-full" >                                  
              <CategorySelector 
                formData={formData}
                setFormData={setFormData}                                
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
                selectedLeafCategory={selectedLeafCategory}
                setSelectedLeafCategory={setSelectedLeafCategory}
              />                                                             
            </div>
          </div>
          <VariantManager 
            dynamicFields={formData.dynamicFields}
            variants={variants}
            setVariants={setVariants}
            progress={progress}
          />
          <Button
            type="submit"
            onClick={() => handleSubmit}
            disabled={!isBasicInfoComplete || isPublishing}
            className="flex rounded-2xl w-fit self-center my-2 text-blue-600 bg-black/15 dark:bg-white/5"
          >
            {isPublishing 
              ? <span className="animate-pulse">Publishing...</span>
              : <>
                <Upload />
                Publish Product
              </>
            }            
          </Button>
        </form>
      </div>
    </main>
  )
}