import { model, models, Schema } from "mongoose";


export interface IAuthor extends Document {
  name: string;
  bio?: string;
  profileImageUrl?: string;
  socialLinks?: {
    [key: string]: string; 
  };
  slug: string;  
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    bio: { type: String },
    profileImageUrl: { type: String },
    socialLinks: { type: Map, of: String }, 
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);


export default models.Author || model<IAuthor>('Author',AuthorSchema);