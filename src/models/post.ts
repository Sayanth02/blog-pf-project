import { model, models, Schema, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  authorIds: Types.ObjectId[];
  publishDate?: Date;
  content: string;
  categoryIds: Types.ObjectId[];
  tagIds?: Types.ObjectId[];
  summary?: string;
  thumbnail?: string;
  isFeatured? : boolean;
  relatedPostIds?: Types.ObjectId[];
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    authorIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true },
    categoryIds: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    tagIds: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    summary: { type: String },
    thumbnail: { type: String },
    relatedPostIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    isFeatured : {type:Boolean, default:false}
  },
  { timestamps: true }
);

// Indexes for common queries and sorts
PostSchema.index({ publishDate: -1 });
// Optional multikey indexes if you filter by these often
PostSchema.index({ categoryIds: 1 });
PostSchema.index({ tagIds: 1 });
PostSchema.index({ authorIds: 1 });

export default models.Post || model<IPost>("Post", PostSchema);
