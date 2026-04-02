import { Button, InputField, SelectField } from "@vendora/ui";
import { ICategoryField } from "../page";


interface FieldRendererProps {  
  field: ICategoryField;
  value: string | number | string[];
  onUpdate: (fieldId: string, newValue: string | string[]) => void;
}

export function DynamicFieldRenderer({field, value, onUpdate}: FieldRendererProps) {
  if (!field || !field.type) return null;  

  // Type-safe selection handling
  const currentSelections = Array.isArray(value) ? value : (field.isMulti ? [] : "");

  switch (field.type) {
    case "select": 
      if (field.isMulti) {
        return (
          <div>
            <label className="text-xs">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* Selectable tile grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 w-fit gap-2" >
              {field.options?.map((opt, idx: number) => {
                const optValue = typeof opt === "object" ? opt.value : opt;
                const optLabel = typeof opt === "object" ? opt.label : opt;
                const isSelected = currentSelections.includes(optValue);                
                return (
                  <Button
                    key={idx}
                    type="button"
                    variant={isSelected ? "flat" : "outlined"}
                    onClick={() => {
                      const safeSelections = Array.isArray(currentSelections) ? currentSelections : [];
                      const next = isSelected
                      ? safeSelections.filter(v => v !== optValue)
                      : [...safeSelections, optValue];
                      onUpdate(field.fieldId, next)
                    }}
                  >
                    {optLabel}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Select all that apply for this product variant</p>
          </div>
        );
      }
      return (
        <div>            
          <SelectField
            value={value || ""}
            label={<span>{field.label} {field.required && <span className="text-xs text-red-500" >*</span>}</span>}
            onChange={(e) => onUpdate(field.fieldId, e.target.value)}
          >
            <option value="" className="text-[12px]" >{field.label}</option>
            {field.options?.map((opt, i: number) => {
              const optValue = typeof opt === "object" ? opt.value : opt;
              const optLabel = typeof opt === "object" ? opt.label : opt;
              return (                
              <option key={i} value={optValue}>{optLabel}</option>
              )
            })}
          </SelectField>
        </div>
      );
    
    case "number":
      return (
        <InputField 
          label={<span>{field.label} {field.required && <span className="text-xs text-red-500" >*</span>}</span>}
          type="number"
          step={"any"}
          value={value || ""}
          placeholder={field.label}
          onChange={(e) => onUpdate(field.fieldId, e.target.value) }
        />
      );

    default: 
      return (
        <InputField 
          type="text"
          label={<span>{field.label} {field.required && <span className="text-xs text-red-500" >*</span>}</span>}
          placeholder={field.placeholder}
          onChange={(e) => onUpdate(field.fieldId, e.target.value)}
        />
      );
  }
}