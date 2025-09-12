import { model, models, Schema, Document, Types } from "mongoose";

export type UserRole = "Admin" | "Author" | "User";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  googleId?: string;
  profileDetails?: {
    bio?: string;
    profileImageUrl?: string;
    [key: string]: any;
  };
  bookmarkedPostIds?: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Author", "User"], default: "User" },
    googleId: { type: String, index: true }, 
    profileDetails: {
      bio: { type: String },
      profileImageUrl: { type: String },
    },
    bookmarkedPostIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);


export default models.User || model<IUser>("User", UserSchema);
