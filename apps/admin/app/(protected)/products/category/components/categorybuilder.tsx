"use client";

import { Add, Delete, PostAdd } from "@mui/icons-material";
import { Button, InputField, SelectField, Table, title, UsePage, useToast } from "@vendora/ui";
import React, { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useCategories } from "../../../hooks/useCategory";
import FilePicker from "@vendora/ui/src/components/filePicker";
import { ICategory } from "@vendora/db/frontend";

interface ICategoryField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "radio" | "checkbox";
  options: string[];
  required: boolean;
  isMulti?: boolean;
  step?: string;
}

export default function CategoryBuilder() {
  const { showToast } = useToast();
  const {categories} = useCategories();
  const { page,  setPage} = UsePage();
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [isSubCategory, setIsSubCategory] = useState(false);    
  const [fields, setFields] = useState<ICategoryField[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string,number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (isSubCategory && categories.length > 0 && !parentId) {
      setParentId(categories[0]._id.toString());
    } 
  }, [isSubCategory, categories, parentId]);

  const addField = () => {
    setFields([...fields, {
      id: crypto.randomUUID(),
      label: "",
      type: "text",
      options: [],
      required: false
    }])
  };

  const removeField = (id: string) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !==id));
  }

  const updateField = (id: string, key: keyof ICategoryField, value: string | string[] | boolean) => {
    setFields(prev => prev.map(f => f.id === id ? {...f, [key]: value}: f));
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files)
  }

  const loadCategoryForEdit = (category: ICategory) => {
    if (!category) return;    
    setEditingId(category._id.toString());
    setCategoryName(category.name || "");

    const pId = category.parentId?.toString() || "";
    setIsSubCategory(!!pId);
    setParentId(pId);
    
    const catFields = category.fields as unknown as ICategoryField[];
    setFields (catFields.map((f) => ({
      ...f,
      id: crypto.randomUUID()
    })));
  }

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const finalparentId = isSubCategory ? parentId : null;
    try {
      const newBlob = selectedFiles.map((file) =>
        upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/product/upload",
          onUploadProgress: (p) => {
            setProgress((prev) => ({ ...prev, [file.name]: p.percentage}));
          }
        })
      );

      const results = await Promise.all(newBlob);
      const imageUrls = results.map(r => r.url);

      const payload = {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
        images: imageUrls,
        parentId: finalparentId,
        // Remove local IDs before sending to mongo
        fields: fields.map(({ ...rest }) => ({
          ...rest,
          fieldId: rest.label.toLowerCase().replace(/\s+/g, "-")
        }))
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/product/category/${editingId}` : "/api/product/category"

      const response = await fetch(url, {
        method,
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        showToast("Category created successfully", "success");
        setCategoryName("");
        setFields([]);
        setParentId("");      
        setSelectedFiles([]);
        await  fetch(`${process.env.NEXT_PUBLIC_STORE_URL}/api/revalidate`, {
          method: "POST",
          body: JSON.stringify({
            secret: process.env.REVALIDATION_SECRET,
            tags: [ "home-data" ]
          }),
        });
        window.location.reload();
      } 
    } catch (error) {
      console.error("Failed to publish category", error);
      showToast("Failed to create category", "error");
    }
  }

  return (
    <main className="flex flex-col justify-center w-full py-4" >
      <h1 className={title({ className: "mb-5 text-center text-gray-600 dark:text-gray-300" })}>Category Builder</h1>
      <div className="flex flex-col gap-2.5 self-center w-full" >
        <form onSubmit={handleSubmit} className="px-4 py-2.5 rounded-2xl w-full bg-black/10 dark:bg-neutral-800" >
          <FilePicker 
            MAX_FILES={1} 
            MIN_FILES={1} 
            value={selectedFiles}
            onFilesChange={handleFilesChange}
            progress={progress}            
          />
          <h2 className="font-semibold text-gray-600 dark:text-gray-300 mb-5">Category Name</h2>          
          <InputField 
            type="text"
            required
            label="Category Name"
            placeholder="Category Name e.g Electronics"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />          

          <div className="ml-4.5 flex flex-row gap-2" >        
            <label htmlFor="checkbox" className="text-sm text-gray-700 dark:text-gray-300">Sub category?</label>
            <input   
              id="checkbox"                                  
              type="checkbox"              
              onChange={(e) => setIsSubCategory(e.target.checked)}                                     
            />            
          </div>

          <div className="flex mt-5">
          {isSubCategory && (
            <SelectField
              label="Parent category"
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value)}            
            >
              <option value="" disabled>Select Parent Category</option> 
              {categories.map((cat) => {
                const catId = cat._id.toString();
                return(
                  <option key={catId} value={catId}>
                    {cat.name}
                  </option>
                )
              })}             
            </SelectField>
          )}
         </div>

         {(isSubCategory) && (
          <div>
            <h2 className="font-semibold text-gray-600 text-center dark:text-gray-300 my-5" >Product Attributes</h2>

            {fields.map((field) => (
              <div key={field.id}>
                <div className="grid grid-cols-2 items-center gap-2.5 my-1">
                  <div className="flex">
                    <InputField 
                      required
                      label="Attribute"
                      placeholder="e.g. Storage Capacity"
                      value={field.label}
                      onChange={(e) => updateField(field.id, "label", e.target.value)}                
                    />
                  </div>

                  <div className="flex" >                  
                    <SelectField                    
                      label="Input type"
                      value={field.type}
                      onChange={(e) => updateField(field.id, "type", e.target.value)}
                    >
                      <option value="text">Short Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown (select)</option>
                    </SelectField>
                  </div>
                </div>

                {field.type === "select" && (
                  <div className="flex items-center my-3" >
                    <InputField 
                      label="Options (comma separated)"
                      onChange={(e) => updateField(field.id, "options", e.target.value.split(",").map(s => s.trim()))}
                    />
                    <div className="flex items-center gap-2.5 ml-4.5">
                      <label htmlFor="checkbox" className="text-xs">Multiple selection?</label>
                      <input                        
                        type="checkbox"
                        checked={field.isMulti || false}
                        onChange={(e) => updateField(field.id, "isMulti", e.target.checked)}                      
                      />
                    </div>
                  </div>
                )}                        

                <div className="flex w-full justify-between" >
                  <div className="flex items-center gap-2.5 ml-4.5" >
                    <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">Required field?</label>
                    <input   
                      id="required"                                      
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => updateField(field.id, "required",  e.target.checked)}
                    />
                  </div>
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => removeField(field.id)}
                  >
                    <Delete />
                    Attribute
                  </Button>                
                </div>
              </div>          
            ))}      
          </div>    
          )}

          <div className="flex justify-between my-5" >
            <Button
              type="button"
              onClick={addField}
              color="primary"
              className="gap-1"
            >
              <Add />
              Attribute
            </Button>  

            <Button
              type="submit"
              color="success"
              className="gap-1"
            >
              <PostAdd />
              Publish Category
            </Button>
          </div>        
        </form>      
        <Table 
          rowKey={"_id"}
          columns={[
            {key: "name", title: "Category Name"},
            {
              key: "parentCategory", 
              title: "Parent Category",
              render: (row) => row.parentId ? "Sub-category" : "Root"
            },
            {
              key: "fields", 
              title: "Attributes",
              render: (row) => row.fields && Array.isArray(row.fields) ? `${row.fields.length} Fields` : "None"
            },
            {
              key: "action", 
              title: "Action",
              render: (row) => (
                <button onClick={() => loadCategoryForEdit(row)} className="bg-blue-500/15 text-blue-600 px-1.5 py-1 rounded-md">Edit</button>
              )
            }
          ]}
          data={categories}
          page={page}
          onPageChange={setPage}
       /> 
      </div>
    </main>
  )
}