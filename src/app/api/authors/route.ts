import connectDB from "@/lib/mongodb";
import auther, { IAuthor } from "@/models/author";
import { NextResponse } from "next/server";

// get all authors
export async function GET(){
    try {
        await connectDB()
        const authors = await auther.find().sort({name:1})
        return NextResponse.json(authors, {status:200})
    } catch (error) {
        return NextResponse.json(
          {
            error: "Failed to fetch authors",
            details: (error as Error).message,
          },
          { status: 500 }
        );
    }
}

// create new author
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    let { name, slug, bio, profilePictureUrl, socialLinks } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    const newAuthor: IAuthor = await auther.create({
      name,
      slug,
      bio,
      profilePictureUrl,
      socialLinks,
    });

    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create author", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// update author

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }

    // Auto-generate slug if name changes and no slug passed
    if (updateFields.name && !updateFields.slug) {
      updateFields.slug = updateFields.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");
    }

    const updatedAuthor = await auther.findByIdAndUpdate(_id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAuthor, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update author", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// delete author
export async function DELETE(request: Request){
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

      const deletedAuthor = await auther.findByIdAndDelete(id);

      if (!deletedAuthor) {
        return NextResponse.json({ error: "Author not found" }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Author deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete Author", details: (error as Error).message },
        { status: 500 }
      );
    }
}
