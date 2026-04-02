import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string;
  name: string;
  images: [string];
  parentId: Schema.Types.ObjectId;
  fields: Schema.Types.Mixed;
}

const categorySchema = new Schema<ICategory>({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type:  String,
    required: true
  },
  images: {
    type: [String],
    default: [],
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "Category",     
    default: null
  },
  fields: {
    type: [Schema.Types.Mixed],
    required: true
  } // Stores the [{id, label, type ... }]
});

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;