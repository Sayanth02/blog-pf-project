import connectDB from "@/lib/mongodb";
import user from "@/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getAuthContext, requireRole } from "../auth/withAuth";
import { Policies } from "../auth/roles";

// get all user

export async function GET() {
  try {
    await connectDB();
    const users = await user
      .find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// create user
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      username,
      email,
      password,
      role,
      profileDetails,
      bookmarkedPostIds,
    } = body;
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and passwordHash are required" },
        { status: 400 }
      );
    }
    const existingUser = await user.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
      role: role || "User",
      profileDetails,
      bookmarkedPostIds,
    });

    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// update user

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }

    // If role change is requested, only Admins can perform it
    if (Object.prototype.hasOwnProperty.call(updateFields, "role")) {
      const guard = requireRole(Policies.manageUsers);
      const ctxOrRes = await guard(request);
      if (ctxOrRes instanceof Response) return ctxOrRes;
    }

    // If email update is present, ensure uniqueness
    if (updateFields.email) {
      const existingUser = await user.findOne({
        email: updateFields.email,
        _id: { $ne: _id },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use by another user" },
          { status: 409 }
        );
      }
      updateFields.email = updateFields.email.toLowerCase();
    }

    const updatedUser = await user
      .findByIdAndUpdate(_id, updateFields, {
        new: true,
        runValidators: true,
      })
      .select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// delete user

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

    const deletedUser = await user.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user", details: (error as Error).message },
      { status: 500 }
    );
  }
}
