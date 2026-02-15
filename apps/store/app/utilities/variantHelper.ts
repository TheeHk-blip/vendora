import { IVariantBase } from "@vendora/db";

export const groupVariants = (variants: IVariantBase[]) => {
  if (!variants?.length) return { options: {}, colors: []};

  const options: Record<string, string[]> = {};
  
  variants.forEach((v) => {
    const atrrs = (v.attributes as Record<string, any>) || {};
    Object.keys(atrrs).forEach((key) => {
      if (!options[key]) options[key] = [];
      if (!options[key].includes(atrrs[key])) {
        options[key].push(atrrs[key]);
      }
    });
  });

  const colors = Array.from(new Set(variants.map(v =>
    Array.isArray(v.color) ? v.color[0] : v.color
  ).filter(Boolean)));

  return { options, colors};
}