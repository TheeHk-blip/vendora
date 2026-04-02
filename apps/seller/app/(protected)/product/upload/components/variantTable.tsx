import { Delete } from "@mui/icons-material";
import { Button, Column, InputField, ProductVariant, Table, UsePage } from "@vendora/ui";
import FilePicker from "@vendora/ui/src/components/filePicker";


interface TableProps {
  data: ProductVariant[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: string, value: string | string[] | File[]) => void;
  uploadProgress: Record<string, number>;
}


export function VariantTable({data, onDelete, onUpdate, uploadProgress}: TableProps) {
  const { page, setPage } = UsePage()
  const variantColumns: Column<ProductVariant>[] = [
    {
      key: "attributes",
      title: "Variant",     
      render: (row) => Object.values(row.attributes).join(" / "),
    },
    {
      key: "sku",
      title: "SKU",
      render: (row) => <code className="text-xs bg-black/5 p-1 rounded">{row.sku}</code>
    },
    {
      key: "price",
      title: "Price",
      render: (row) => (
        <InputField 
          type="number"
          placeholder="0.00"
          value={row.price}
          onChange={(e) => onUpdate(row.id, "price", e.target.value)}
        />
      )
    },
    {
      key: "stock",
      title: "Stock",
      render: (row) => (
        <InputField 
          type="number"
          placeholder="0"
          value={row.stock}
          onChange={(e) => onUpdate(row.id, "stock", e.target.value)}
        />
      )
    },
    {
      key: "color",
      title: "Color",
      render: (row) => (
        <InputField
          type="text"
          placeholder="e.g black"
          value={row.color}
          onChange={(e) => onUpdate(row.id, "color", e.target.value)}
        />
      )
    },
    {
      key: "image",
      title: "Image",
      render: (row) => {  
        const individualProgress = uploadProgress?.[`variant-${row.id}`] ?? 0;
        const fileName = row.image?.[0]?.name || "image"
        return (
          <FilePicker
            value={row.image}        
            onFilesChange={(file) => onUpdate(row.id, "image", file)}
            MAX_FILES={1}
            MIN_FILES={1}       
            progress={{[fileName]: individualProgress}}
          />     
        )
      }
    },
    {
      key: "actions",
      title: "Action",
      className: "text-right",
      render: (row) => (
        <Button
          type="button"
          onClick={() => onDelete(row.id)}
          className="text-red-500"
        >
          <Delete />
        </Button>
      )
    }
  ]

  return (
    <div className="flex my-1.5" >
      <Table<ProductVariant>
        columns={variantColumns}
        data={data}
        rowKey={"id"}
        pageSize={5}
        page={page}
        onPageChange={setPage}
        empty="No variants selected"
      />
    </div>
  )
}