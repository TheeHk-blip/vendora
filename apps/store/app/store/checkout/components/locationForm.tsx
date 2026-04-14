import { shippingConfig } from "../../../../../../packages/db/src/utilities/shipping";
import { CheckoutProps } from "../page";
import { SearchableSelect } from "@vendora/ui";

interface LocationFormProps {
  formData: CheckoutProps;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutProps>>;
}

export function LocationForm({ formData, setFormData }: LocationFormProps) {
  const subCounties = shippingConfig.county.find(c => c.name === formData.county)?.subCounty || [];
  const wards = subCounties.find(s => s.name === formData.subCounty)?.ward || [];

  return (
    <div className="grid grid-cols-3 gap-1.5 my-2" >
      <SearchableSelect
        label="County"
        options={shippingConfig.county.map(c => c.name)}
        value={formData.county}
        onChange={(val) => setFormData((prev) => ({ ...prev, county: val ?? "", subCounty: "", ward: ""}))}
      />
      <SearchableSelect 
        label="Sub-County"
        options={subCounties.map(sc => sc.name)}
        value={formData.subCounty}
        disabled={!formData.county}
        onChange={(val) => setFormData((prev) => ({ ...prev, subCounty: val ?? "", ward: ""}))}
      />
      <SearchableSelect
        label="Ward"
        options={Array.from(wards)}
        value={formData.ward}
        disabled={!formData.subCounty}
        onChange={(val) => setFormData((prev) => ({ ...prev, ward: val ?? "" }))}
      />
    </div>
  )
}