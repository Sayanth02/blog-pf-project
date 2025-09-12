import connectDB from "@/lib/mongodb";
import category, { ICategory } from "@/models/category";
import { NextResponse } from "next/server";




// get all category
export async function GET(){
  try {
    await connectDB();
    const categories = await category.find().sort({ name: 1 });
     return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}



// create category
export async function POST(request: Request){
  try {
    await connectDB()
    const body = await request.json()
    let {name,description,slug} = body;

    if (!slug) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    const newCategory : ICategory =  await category.create({
        name,
        description,
        slug
    })
     return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create author", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// update  category

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }


    const updatedCategory = await category.findByIdAndUpdate(_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return NextResponse.json({ error: "category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update category", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// delete category

export async function DELETE(request: Request) {
  try {
    await connectDB();
   const _id = await request.json();   


    if (!_id) {
      return NextResponse.json(
        { error: "_id query parameter is required" },
        { status: 400 }
      );
    }

    const deletedCategory = await category.findByIdAndDelete(_id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category is not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Category", details: (error as Error).message },
      { status: 500 }
    );
  }
}