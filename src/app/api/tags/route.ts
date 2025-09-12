import connectDB from "@/lib/mongodb";
import tag, { ITag } from "@/models/tag";
import { NextResponse } from "next/server";


export async function GET(){
  try {
    await connectDB();
    const tags = await tag.find().sort({ name: 1 });
     return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch tags",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// create tags
export async function POST(request: Request){
  try {
    await connectDB()
    const body = await request.json()
    let {name,slug} = body;

    if (!slug) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    const newTag = await tag.create({ name, slug });
    return NextResponse.json(newTag.toObject(), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tag", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// update tag

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }


    const updatedTag = await tag.findByIdAndUpdate(_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedTag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTag, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Tag", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// delete category

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get("_id");

    if (!id) {
      return NextResponse.json(
        { error: "_id query parameter is required" },
        { status: 400 }
      );
    }

    const deletedTag = await tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return NextResponse.json(
        { error: "Tag is not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tag", details: (error as Error).message },
      { status: 500 }
    );
  }
}