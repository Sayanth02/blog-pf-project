import connectDB from "@/lib/mongodb";
import category from "@/models/category";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    console.log("Fetching category with id:", params.id);
    const categoryItem = await category.findById(params.id);
    if (!categoryItem) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(categoryItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch category by id",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
