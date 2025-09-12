// import connectDB from "@/lib/mongodb";
// import user from "@/models/user";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";



// export async function POST(request: Request){
//     try {
//         await connectDB()
//         const {username, email, password } = await request.json()
//           if (!username || !email || !password) {
//             return NextResponse.json(
//               { error: "All fields required" },
//               { status: 400 }
//             );
//           }
//           const existing = await user.findOne({ email: email.toLowerCase() });
//           if (existing) {
//             return NextResponse.json(
//               { error: "Email exists" },
//               { status: 409 }
//             );
//           }
//           const hash = await bcrypt.hash(password, 10);
//           await user.create({
//             username,
//             email: email.toLowerCase(),
//             passwordHash: hash,
//             role: "User",
//           });
//            return NextResponse.json(
//              { message: "User created" },
//              { status: 201 }
//            );
//     } catch (error) {
//         return NextResponse.json(
//                   { error: "Failed to create user", details: (error as Error).message },
//                   { status: 500 }
//                 );
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body || {};

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
      role: "User",
    });

    return NextResponse.json(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e?.message },
      { status: 500 }
    );
  }
}


