import { GeneratingTokens } from "@mui/icons-material";
import { Button, ColorInput, ProductVariant } from "@vendora/ui";
import { VariantTable } from "./variantTable";
import { useState } from "react";

export const VariantManager = ({
  dynamicFields,
  variants,
  setVariants,
  progress
  }:{
  dynamicFields: Record<string, string | number | string[]>, 
  variants: ProductVariant[], 
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>,
  progress: Record<string, number>
}) => {
  const [colorTags, setColorTags] = useState<string[]>([]);

  const generate = () => {
    const multiSelectFields: Record<string, string[]> = {};
    Object.entries(dynamicFields).forEach(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) 
        multiSelectFields[key] = val;
    });

    if (colorTags.length > 0) {
      multiSelectFields["color"] = colorTags;
    }

    const newVariants = cartesianProductLogic(multiSelectFields);
    setVariants((existingVariants) => {
      return newVariants.map((newVariant) => {
        const existingMatch = existingVariants.find(
          (ev) => ev.sku === newVariant.sku
        );

        return existingMatch ? existingMatch : newVariant;
      })
    });    
  };
   
  const handleUpdate = (id: string, field: string, value: string | string[] | File[]) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleDelete = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="flex flex-col items-center my-2.5" >
      <div className="w-full mb-4">
        <ColorInput 
          colors={colorTags}
          onChange={(e) => setColorTags(e)}          
        />
      </div>
      <Button
        type="button"
        onClick={generate}
        className="rounded-xl bg-black/15 dark:bg-white/15"
      >
        <GeneratingTokens />
        Generate SKU Matrix
      </Button>
      <VariantTable 
        data={variants} 
        onUpdate={handleUpdate}
        onDelete={handleDelete} 
        uploadProgress={progress}
      />
    </div>
  )
}

const cartesianProductLogic = (attributes: Record<string, string[]>) => {
  const keys = Object.keys(attributes);
  if (keys.length === 0 || Object.values(attributes).every(a => a.length === 0)) return [];

  const values = Object.values(attributes);
  // acc = list of variants already built
  // curr = the new set of options about to be added to variants
  // d = the combinations so far
  // e = the new element
  const combinations = values.reduce((acc, curr) => {
    return acc.flatMap(d => curr.map(e => [...d, e]));
  }, [[]] as string[][]);

  return combinations.map((combo) => {
    const variantAtrributes: Record<string, string> = {};
    let colorValue = "";

    keys.forEach((key, index) => {
      variantAtrributes[key] = combo[index];
      if (key === "color") colorValue = combo[index]
    });

    const comboLabel = combo.join("-").toUpperCase().replace(/\s+/g, "");

    return {
      id: crypto.randomUUID(),
      attributes: variantAtrributes,
      sku: `${comboLabel}`,
      price: "",
      stock: "",
      color: colorValue,
      image: [] as File[]
    };
  });
};