import { Schema, model, models, Document } from "mongoose";


export interface ITag extends Document {
  name: string;
  slug: string; 
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default models.Tag || model<ITag>("Tag", TagSchema);

