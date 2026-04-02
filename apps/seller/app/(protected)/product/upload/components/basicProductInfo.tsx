import { InputField, TextField } from "@vendora/ui";
import { FormProps } from "./categorySelector";


export function BasicProductInfo({formData, setFormData}: FormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return(
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-row gap-2.5">
        <InputField
          type="text"
          name="name"
          placeholder="Product name"
          label="Product Name"
          value={formData.name}                
          onChange={handleChange}
        />  

        <InputField
          type="number"
          name="releaseYear"
          placeholder="Release Year"
          label="Release Year"
          value={formData.releaseYear}                
          onChange={handleChange}
        />  
      </div>
      <div className="flex flex-row gap-2.5" >
        <InputField
          type="number"
          name="price"
          placeholder="Price"
          label="Price"
          value={formData.price}
          onChange={handleChange}
        /> 

        <InputField
          type="number"
          name="discountedPrice"
          placeholder="Price"
          label="Discounted Price"
          value={formData.discountedPrice}
          onChange={handleChange}
        /> 

        <input
          type="number"
          name="discount"
          placeholder="Discount"              
          hidden
          value={formData.discount}
          onChange={handleChange}
        /> 
      </div>
      <TextField 
        name="description"
        label="Description"
        value={formData.description}
        rows={5}
        minChar={200}
        limit={5000}
        onChange={handleChange}
      />
    </div>
  )
}