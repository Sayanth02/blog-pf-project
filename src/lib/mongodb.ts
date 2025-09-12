import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("MongoDB is already connected.");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully.");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("MongoDB connection failed:", error);
         console.error(error)
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
