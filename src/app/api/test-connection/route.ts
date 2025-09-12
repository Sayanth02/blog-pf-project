import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB(); 
    return new Response("MongoDB is connected", { status: 200 });
  } catch (error) {
    return new Response("MongoDB connection failed", { status: 500 });
  }
}
